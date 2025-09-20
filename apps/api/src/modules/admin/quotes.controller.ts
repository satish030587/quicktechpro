import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager')
@Controller('admin/quotations')
export class QuotesAdminController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('customerEmail') customerEmail?: string,
    @Query('q') q?: string
  ) {
    const where: any = {};
    if (status) where.status = status as any;
    if (customerEmail) where.customer = { email: customerEmail };
    if (q) where.title = { contains: q, mode: 'insensitive' };
    const items = await this.prisma.quote.findMany({ where, orderBy: { updatedAt: 'desc' }, include: { items: true, customer: true }, take: 100 });
    return { items };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.prisma.quote.findUnique({ where: { id }, include: { items: true, customer: true } });
  }

  @Post()
  async upsert(@Req() req: any, @Body() body: { id?: string; customerId?: string; customerEmail?: string; title: string; status?: string; items?: { id?: string; name: string; qty: number; price: string }[] }) {
    let customerId = body.customerId;
    if (!customerId && body.customerEmail) {
      const u = await this.prisma.user.findUnique({ where: { email: body.customerEmail } });
      if (!u) throw new Error('Customer not found');
      customerId = u.id;
    }
    if (!customerId) throw new Error('customerId or customerEmail required');

    const computeTotal = (items: any[]) => items.reduce((sum, it) => sum + Number(it.price) * (it.qty || 1), 0);

    if (body.id) {
      // Update quote and replace items if provided
      const update: any = { title: body.title };
      if (body.status) update.status = body.status as any;
      if (customerId) update.customerId = customerId;
      const q = await this.prisma.quote.update({ where: { id: body.id }, data: update });
      if (body.items) {
        await this.prisma.quoteItem.deleteMany({ where: { quoteId: q.id } });
        await this.prisma.quoteItem.createMany({ data: body.items.map(it => ({ quoteId: q.id, name: it.name, qty: it.qty || 1, price: it.price, total: (Number(it.price) * (it.qty || 1)).toFixed(2) })) });
        const total = computeTotal(body.items);
        await this.prisma.quote.update({ where: { id: q.id }, data: { total: total.toFixed(2) } });
      }
      return this.get(q.id);
    } else {
      const items = body.items || [];
      const total = computeTotal(items);
      const q = await this.prisma.quote.create({
        data: {
          customerId,
          title: body.title,
          status: (body.status as any) || 'DRAFT',
          total: total.toFixed(2),
          items: { create: items.map(it => ({ name: it.name, qty: it.qty || 1, price: it.price, total: (Number(it.price) * (it.qty || 1)).toFixed(2) })) }
        }
      });
      return this.get(q.id);
    }
  }

  @Patch(':id/status')
  async setStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.prisma.quote.update({ where: { id }, data: { status: body.status as any } });
  }

  @Post(':id/recalculate')
  async recalc(@Param('id') id: string) {
    const items = await this.prisma.quoteItem.findMany({ where: { quoteId: id } });
    const total = items.reduce((sum, it) => sum + Number(it.total), 0);
    return this.prisma.quote.update({ where: { id }, data: { total: total.toFixed(2) } });
  }

  @Post(':id/convert-to-invoice')
  async convert(@Param('id') id: string) {
    const q = await this.prisma.quote.findUnique({ where: { id }, include: { items: true } });
    if (!q) throw new Error('Quote not found');
    // Create invoice from quote items
    const baseNumber = `INV-${new Date().getFullYear()}`;
    const count = await this.prisma.invoice.count();
    const number = `${baseNumber}-${String(count + 1).padStart(4, '0')}`;
    const subtotal = q.items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0);
    const tax = 0;
    const invoice = await this.prisma.invoice.create({
      data: {
        number,
        customerId: q.customerId,
        status: 'PENDING',
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: (subtotal + tax).toFixed(2),
        items: { create: q.items.map(it => ({ name: it.name, qty: it.qty, price: it.price, total: (Number(it.price) * it.qty).toFixed(2) })) }
      },
      include: { items: true }
    });
    return invoice;
  }
}

