import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager')
@Controller('admin')
export class FinanceController {
  constructor(private prisma: PrismaService) {}

  @Get('invoices')
  async invoices(@Query('status') status?: string) {
    const where: any = {};
    if (status) where.status = status as any;
    const items = await this.prisma.invoice.findMany({ where, include: { items: true, payments: true, customer: true }, orderBy: { createdAt: 'desc' }, take: 100 });
    return { items };
  }

  @Post('invoices')
  async createInvoice(@Body() body: { customerId: string; items: { name: string; qty: number; price: string }[]; taxPct?: number }) {
    const number = await this.newInvoiceNumber();
    const subtotal = body.items.reduce((sum, i) => sum + Number(i.price) * (i.qty || 1), 0);
    const tax = (Number(body.taxPct || 0) / 100) * subtotal;
    const total = subtotal + tax;
    const invoice = await this.prisma.invoice.create({
      data: {
        number,
        customerId: body.customerId,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        items: { create: body.items.map(i => ({ name: i.name, qty: i.qty || 1, price: i.price, total: (Number(i.price) * (i.qty || 1)).toFixed(2) })) }
      },
      include: { items: true }
    });
    return invoice;
  }

  @Patch('invoices/:id/status')
  async invoiceStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.prisma.invoice.update({ where: { id }, data: { status: body.status as any } });
  }

  @Get('payments')
  async payments(@Query('status') status?: string) {
    const where: any = {};
    if (status) where.status = status as any;
    const items = await this.prisma.payment.findMany({ where, include: { invoice: true }, orderBy: { createdAt: 'desc' }, take: 100 });
    return { items };
  }

  @Patch('payments/:id/reconcile')
  async reconcile(@Param('id') id: string, @Body() body: { status: 'SUCCESS' | 'FAILED' | 'REFUNDED' }) {
    return this.prisma.payment.update({ where: { id }, data: { status: body.status } });
  }

  private async newInvoiceNumber() {
    const base = `INV-${new Date().getFullYear()}`;
    const count = await this.prisma.invoice.count({});
    return `${base}-${String(count + 1).padStart(4, '0')}`;
  }
}

