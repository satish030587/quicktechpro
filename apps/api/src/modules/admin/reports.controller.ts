import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager')
@Controller('admin/reports')
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async summary(@Query('from') from?: string, @Query('to') to?: string) {
    const range: any = {};
    if (from || to) {
      range.createdAt = {};
      if (from) range.createdAt.gte = new Date(from);
      if (to) range.createdAt.lte = new Date(to);
    }
    const [tickets, payments, invoices] = await Promise.all([
      this.prisma.ticket.groupBy({ by: ['status'], _count: true, where: range }),
      this.prisma.payment.groupBy({ by: ['status'], _sum: { amount: true }, where: { ...(range.createdAt ? { createdAt: range.createdAt } : {}), status: 'SUCCESS' } }),
      this.prisma.invoice.groupBy({ by: ['status'], _sum: { total: true }, where: range })
    ]);
    return { tickets, payments, invoices };
  }
}

