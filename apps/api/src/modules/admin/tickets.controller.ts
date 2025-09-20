import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EventsGateway } from '../../realtime/events.gateway';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager', 'technician')
@Controller('admin/tickets')
export class TicketsController {
  constructor(private prisma: PrismaService, private realtime: EventsGateway) {}

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('priority') priority?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('customerEmail') customerEmail?: string,
    @Query('q') q?: string,
    @Query('billingStatus') billingStatus?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string
  ) {
    const where: any = {};
    if (status) where.status = status as any;
    if (type) where.type = type as any;
    if (priority) where.priority = priority as any;
    if (assignedToId) where.assignedToId = assignedToId;
    if (customerEmail) where.customer = { email: customerEmail };
    if (billingStatus) where.billingStatus = billingStatus as any;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } }
      ];
    }
    const [items, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        include: { customer: true, assignedTo: true },
        orderBy: { createdAt: 'desc' },
        skip: skip ? Number(skip) : 0,
        take: take ? Number(take) : 50
      }),
      this.prisma.ticket.count({ where })
    ]);
    return { items, total };
  }

  @Post()
  async create(@Body() body: { type: string; priority?: string; title: string; description: string; customerId: string }) {
    const code = await this.generateTicketCode(body.type || 'REMOTE');
    const ticket = await this.prisma.ticket.create({
      data: {
        code,
        type: body.type as any,
        priority: (body.priority || 'MEDIUM') as any,
        title: body.title,
        description: body.description,
        customerId: body.customerId
      }
    });
    this.realtime.emitTicketCreated(ticket);
    return ticket;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        messages: { include: { sender: true } },
        attachments: true,
        audits: true,
        customer: true,
        assignedTo: true,
        invoice: true,
        payment: true,
        remoteSessions: true
      }
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    const fields = ['status', 'priority', 'title', 'description', 'assignedToId'];
    for (const f of fields) if (f in body) data[f] = body[f];
    const t = await this.prisma.ticket.update({ where: { id }, data });
    this.realtime.emitTicketUpdate(id, {
      fields: Object.keys(data),
      customerId: t.customerId,
      status: t.status,
    });
    return t;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existing = await this.prisma.ticket.findUnique({
      where: { id },
      select: { id: true, customerId: true },
    });
    await this.prisma.ticket.delete({ where: { id } });
    this.realtime.emitTicketDeleted(id, { customerId: existing?.customerId });
    return { ok: true };
  }

  @Post(':id/messages')
  async addMessage(@Param('id') id: string, @Body() body: { senderId: string; content: string; internal?: boolean }) {
    const m = await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.senderId, content: body.content, internal: Boolean(body.internal) } });
    if (!m.internal) this.realtime.emitTicketMessage(id, m);
    return m;
  }

  @Post(':id/notes')
  async addNote(@Param('id') id: string, @Body() body: { senderId: string; content: string }) {
    return this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.senderId, content: body.content, internal: true } });
  }

  @Post(':id/remote-session/start')
  async startSession(@Param('id') id: string, @Body() body: { tool: string; joinLink?: string; code?: string; technicianId: string }) {
    const t = await this.prisma.ticket.findUnique({ where: { id } });
    if (!t) throw new Error('Ticket not found');
    if (t.billingStatus !== 'PAID') throw new Error('Payment not confirmed');
    const session = await this.prisma.remoteSession.create({ data: { ticketId: id, tool: body.tool, joinLink: body.joinLink, code: body.code, technicianId: body.technicianId } });
    await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.technicianId, content: `Remote session started via ${body.tool}. ${body.joinLink ? 'Link: '+body.joinLink : ''} ${body.code ? 'Code: '+body.code : ''}`, internal: false } });
    this.realtime.emitTicketSession(id, { action: 'start', session });
    return session;
  }

  @Post(':id/remote-session/end')
  async endSession(@Param('id') id: string, @Body() body: { sessionId: string; notes?: string; technicianId: string }) {
    const session = await this.prisma.remoteSession.update({ where: { id: body.sessionId }, data: { endedAt: new Date(), notes: body.notes } });
    await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.technicianId, content: `Remote session ended. ${body.notes || ''}`, internal: false } });
    this.realtime.emitTicketSession(id, { action: 'end', session });
    return session;
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

