import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { EventsGateway } from '../../realtime/events.gateway';
import { PrismaService } from '../../prisma/prisma.service';

@UseGuards(JwtAccessGuard)
@Controller('customer')
export class CustomerController {
  constructor(private prisma: PrismaService, private realtime: EventsGateway) {}

  // Dashboard summary
  @Get('dashboard')
  async dashboard(@Req() req: any) {
    const userId = req.user.sub as string;
    const [openTickets, pendingQuotes, dueInvoices, nextAppt] = await Promise.all([
      this.prisma.ticket.count({ where: { customerId: userId, NOT: { status: 'CLOSED' } } }),
      this.prisma.quote.count({ where: { customerId: userId, status: 'SENT' } }).catch(()=>0),
      this.prisma.invoice.count({ where: { customerId: userId, status: { in: ['PENDING', 'OVERDUE'] } } }).catch(()=>0),
      this.prisma.appointment.findFirst({ where: { ticket: { customerId: userId } }, orderBy: { scheduledAt: 'asc' } }).catch(()=>null)
    ]);
    return { openTickets, pendingQuotes, dueInvoices, nextAppointment: nextAppt };
  }

  // Tickets
  @Get('tickets')
  async tickets(@Req() req: any, @Query('status') status?: string) {
    const userId = req.user.sub as string;
    const where: any = { customerId: userId };
    if (status) where.status = status as any;
    const items = await this.prisma.ticket.findMany({ where, orderBy: { createdAt: 'desc' }, include: { assignedTo: true } });
    return { items };
  }

  @Post('tickets')
  async createTicket(@Req() req: any, @Body() body: { type: string; priority?: string; title: string; description: string }) {
    const userId = req.user.sub as string;
    const code = await this.generateTicketCode(body.type || 'REMOTE');
    const t = await this.prisma.ticket.create({ data: { code, type: body.type as any, priority: (body.priority || 'MEDIUM') as any, title: body.title, description: body.description, customerId: userId } });
    this.realtime.emitTicketCreated(t);
    const notification = await this.prisma.notification.create({ data: { userId: null, type: 'ticket', message: `New ${(body.type || 'REMOTE')} ticket ${code} from ${req.user.email}` } });
    this.realtime.emitNotification(notification);
    return t;
  }

  @Get('tickets/:id')
  async ticket(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub as string;
    const t = await this.prisma.ticket.findFirst({ where: { id, customerId: userId }, include: { messages: { include: { sender: true } }, attachments: true, assignedTo: true } });
    return t;
  }

  @Post('tickets/:id/messages')
  async ticketMessage(@Req() req: any, @Param('id') id: string, @Body() body: { content: string }) {
    const userId = req.user.sub as string;
    // ensure ownership
    const owns = await this.prisma.ticket.findFirst({ where: { id, customerId: userId }, select: { id: true } });
    if (!owns) return { ok: false } as any;
    const m = await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: userId, content: body.content || '' } });
    this.realtime.emitTicketMessage(id, { ...m, internal: false });
    return m;
  }

  // Quotes
  @Get('quotes')
  async quotes(@Req() req: any, @Query('skip') skip?: string, @Query('take') take?: string) {
    const userId = req.user.sub as string;
    const where = { customerId: userId };
    const [items, total] = await Promise.all([
      this.prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' }, include: { items: true }, skip: Number(skip) || 0, take: Number(take) || 10 }),
      this.prisma.quote.count({ where })
    ]);
    return { items, total };
  }

  @Get('quotes/:id')
  async quoteDetail(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub as string;
    const q = await this.prisma.quote.findFirst({ where: { id, customerId: userId }, include: { items: true } });
    return q;
  }

  @Post('quotes/:id/accept')
  async acceptQuote(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub as string;
    const q = await this.prisma.quote.update({ where: { id }, data: { status: 'ACCEPTED' } });
    // ensure user owns; fallback simple check
    if (q.customerId !== userId) return { ok: false } as any;
    return { ok: true };
  }

  @Post('quotes/:id/reject')
  async rejectQuote(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub as string;
    const q = await this.prisma.quote.update({ where: { id }, data: { status: 'REJECTED' } });
    if (q.customerId !== userId) return { ok: false } as any;
    return { ok: true };
  }

  // Invoices & payments
  @Get('invoices')
  async invoices(@Req() req: any) {
    const userId = req.user.sub as string;
    const items = await this.prisma.invoice.findMany({ where: { customerId: userId }, include: { items: true, payments: true }, orderBy: { createdAt: 'desc' } });
    return { items };
  }

  @Get('payments')
  async payments(@Req() req: any) {
    const userId = req.user.sub as string;
    const items = await this.prisma.payment.findMany({ where: { invoice: { customerId: userId } }, include: { invoice: true }, orderBy: { createdAt: 'desc' } });
    return { items };
  }

  // Appointments
  @Get('appointments')
  async appointments(@Req() req: any) {
    const userId = req.user.sub as string;
    const items = await this.prisma.appointment.findMany({ where: { ticket: { customerId: userId } }, include: { ticket: true }, orderBy: { scheduledAt: 'asc' } });
    return { items };
  }

  @Post('appointments')
  async requestAppointment(@Req() req: any, @Body() body: { ticketId: string; scheduledAt: string; address?: string; notes?: string }) {
    const userId = req.user.sub as string;
    const owns = await this.prisma.ticket.findFirst({ where: { id: body.ticketId, customerId: userId }, select: { id: true, code: true, title: true, customerId: true } });
    if (!owns) {
      throw new BadRequestException('Ticket not found');
    }

    const scheduledAt = new Date(body.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException('Appointment time must be in the future');
    }

    const appointment = await this.prisma.appointment.upsert({
      where: { ticketId: body.ticketId },
      update: {
        scheduledAt,
        address: body.address,
        notes: body.notes?.trim() || 'Customer requested appointment',
        status: 'SCHEDULED'
      },
      create: {
        ticketId: body.ticketId,
        scheduledAt,
        address: body.address,
        notes: body.notes?.trim() || 'Customer requested appointment',
        status: 'SCHEDULED'
      },
      include: { ticket: { include: { customer: true } }, technician: true }
    });

    await this.prisma.notification.create({
      data: {
        userId: null,
        type: 'appointment',
        message: `Customer requested appointment for ticket ${owns.code || owns.id}`
      }
    }).catch(() => null);

    this.realtime.emitAppointmentUpsert(appointment);
    this.realtime.emitTicketUpdate(body.ticketId, { appointment });
    return appointment;
  }

  // Profile
  @Get('profile')
  async profile(@Req() req: any) {
    const userId = req.user.sub as string;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return { email: user?.email, name: user?.name, phone: user?.phone, marketingEmailOptIn: user?.marketingEmailOptIn, marketingSmsOptIn: user?.marketingSmsOptIn };
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: { name?: string; phone?: string; marketingEmailOptIn?: boolean; marketingSmsOptIn?: boolean }) {
    const userId = req.user.sub as string;
    const u = await this.prisma.user.update({ where: { id: userId }, data: { name: body.name, phone: body.phone, marketingEmailOptIn: body.marketingEmailOptIn, marketingSmsOptIn: body.marketingSmsOptIn } });
    return { ok: true };
  }

  // Notifications
  @Get('notifications')
  async notifications(@Req() req: any, @Query('skip') skip?: string, @Query('take') take?: string, @Query('read') read?: string) {
    const userId = req.user.sub as string;
    const where: any = { userId };
    if (read != null) where.read = read === 'true';
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip) || 0, take: Number(take) || 10 }),
      this.prisma.notification.count({ where })
    ]);
    const unreadCount = await this.prisma.notification.count({ where: { userId, read: false } });
    return { items, total, unreadCount };
  }

  @Post('notifications/:id/read')
  async markRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub as string;
    const n = await this.prisma.notification.update({ where: { id }, data: { read: true } });
    if (n.userId !== userId) return { ok: false } as any;
    return { ok: true };
  }

  @Post('notifications/mark-all-read')
  async markAllRead(@Req() req: any) {
    const userId = req.user.sub as string;
    await this.prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
    return { ok: true };
  }

  private async generateTicketCode(type: string): Promise<string> {
    const prefix = type === 'ONSITE' ? 'ON' : type === 'WEBDEV' ? 'WD' : 'RT';
    const number = Math.floor(10000 + Math.random() * 90000);
    const code = `${prefix}${new Date().getFullYear()}-${number}`;
    const exists = await this.prisma.ticket.findFirst({ where: { code } });
    if (exists) return this.generateTicketCode(type);
    return code;
  }
}



