import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager')
@Controller('admin/customers')
export class AdminCustomersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('q') q?: string, @Query('take') take?: string) {
    const where: any = {
      roles: { some: { role: { name: 'customer' } } }
    };
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } }
      ];
    }
    const items = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: take ? Number(take) : 50,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        isActive: true,
        _count: { select: { ticketsAsCustomer: true, invoices: true, quotes: true } }
      }
    });
    return { items };
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, phone: true, isActive: true, createdAt: true } });
    if (!user) return null;
    const [tickets, invoices, quotes, payments] = await Promise.all([
      this.prisma.ticket.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      this.prisma.invoice.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      this.prisma.quote.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      this.prisma.payment.findMany({ where: { invoice: { customerId: id } }, orderBy: { createdAt: 'desc' }, take: 5 })
    ]);
    return { user, tickets, invoices, quotes, payments };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string; phone?: string; isActive?: boolean }) {
    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    const user = await this.prisma.user.update({ where: { id }, data });
    return { user };
  }

  // Paginated resources for a customer
  @Get(':id/tickets')
  async tickets(@Param('id') id: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    const where = { customerId: id };
    const [items, total] = await Promise.all([
      this.prisma.ticket.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip)||0, take: Number(take)||10 }),
      this.prisma.ticket.count({ where })
    ]);
    return { items, total };
  }

  @Get(':id/invoices')
  async invoices(@Param('id') id: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    const where = { customerId: id };
    const [items, total] = await Promise.all([
      this.prisma.invoice.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip)||0, take: Number(take)||10 }),
      this.prisma.invoice.count({ where })
    ]);
    return { items, total };
  }

  @Get(':id/quotes')
  async quotes(@Param('id') id: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    const where = { customerId: id };
    const [items, total] = await Promise.all([
      this.prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip)||0, take: Number(take)||10 }),
      this.prisma.quote.count({ where })
    ]);
    return { items, total };
  }

  @Get(':id/payments')
  async payments(@Param('id') id: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    const where = { invoice: { customerId: id } } as any;
    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({ where, include: { invoice: true }, orderBy: { createdAt: 'desc' }, skip: Number(skip)||0, take: Number(take)||10 }),
      this.prisma.payment.count({ where })
    ]);
    return { items, total };
  }
}
