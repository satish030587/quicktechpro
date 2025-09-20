import { Body, Controller, Get, Headers, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../realtime/events.gateway';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import * as crypto from 'crypto';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private prisma: PrismaService, private realtime: EventsGateway) {}

  @Get('config')
  async config() {
    const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
    const keyId = (cfg?.jsonValue as any)?.key || process.env.RAZORPAY_KEY_ID || '';
    return { keyId };
  }

  @UseGuards(JwtAccessGuard)
  @Post('razorpay/order')
  async createOrder(@Req() req: any, @Body() body: { invoiceId: string }) {
    const userId = req.user.sub as string;
    const invoice = await this.prisma.invoice.findUnique({ where: { id: body.invoiceId } });
    if (!invoice || invoice.customerId !== userId) throw new Error('Invoice not found');
    const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
    const keyId = (cfg?.jsonValue as any)?.key || process.env.RAZORPAY_KEY_ID;
    const keySecret = (cfg?.jsonValue as any)?.secret || process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error('Razorpay not configured');
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const amountPaise = Math.round(Number(invoice.total) * 100);
    const payment = await this.prisma.payment.create({ data: { invoiceId: invoice.id, amount: invoice.total, method: 'razorpay', status: 'CREATED', provider: 'razorpay' } });
    const order = await rzp.orders.create({ amount: amountPaise, currency: invoice.currency || 'INR', receipt: `${invoice.number}-${payment.id}` });
    await this.prisma.payment.update({ where: { id: payment.id }, data: { providerOrderId: order.id } });
    return { order, invoiceNumber: invoice.number, amount: invoice.total, currency: invoice.currency || 'INR' };
  }

  @UseGuards(JwtAccessGuard)
  @Post('razorpay/verify')
  async verify(@Req() req: any, @Body() body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
    const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
    const keySecret = (cfg?.jsonValue as any)?.secret || process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error('Razorpay not configured');
    const sign = crypto.createHmac('sha256', keySecret).update(body.razorpay_order_id + '|' + body.razorpay_payment_id).digest('hex');
    if (sign !== body.razorpay_signature) throw new Error('Invalid signature');
    const payment = await this.prisma.payment.findFirst({ where: { providerOrderId: body.razorpay_order_id } });
    if (!payment) throw new Error('Payment not found');
    // idempotent
    if (payment.status !== 'SUCCESS') {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'SUCCESS', providerTxnId: body.razorpay_payment_id } });
      await this.prisma.invoice.update({ where: { id: payment.invoiceId }, data: { status: 'PAID' } });
    }
    let createdTicketId = payment.createdTicketId;
    if (!createdTicketId) {
      const invoice = await this.prisma.invoice.findUnique({ where: { id: payment.invoiceId } });
      if (!invoice) throw new Error('Invoice not found');
      // Create remote support ticket if metadata contains plan/details
      const meta = (payment.metadata as any) || {};
      const ticket = await this.prisma.ticket.create({
        data: {
          code: await this.newTicketCode('REMOTE'),
          type: 'REMOTE' as any,
          status: 'NEW' as any,
          billingStatus: 'PAID' as any,
          priority: 'MEDIUM' as any,
          title: meta.title || `Remote Support - ${invoice.number}`,
          description: meta.details || 'Paid remote support request',
          customerId: invoice.customerId,
          invoiceId: invoice.id,
          paymentId: payment.id
        }
      });
      this.realtime.emitTicketCreated(ticket);
      createdTicketId = ticket.id;
      await this.prisma.payment.update({ where: { id: payment.id }, data: { createdTicketId } });
      // notify admin users (simple broadcast to Notification without userId)
      const notification = await this.prisma.notification.create({ data: { userId: null, type: 'PAYMENT_SUCCESS', message: `Paid remote ticket ${ticket.code} created` } });
      this.realtime.emitNotification(notification);
    }
    return { ok: true, ticketId: createdTicketId };
  }

  // Create remote order (plan & details) — creates invoice + payment + razorpay order
  @UseGuards(JwtAccessGuard)
  @Post('remote/order')
  async remoteOrder(@Req() req: any, @Body() body: { plan: 'BASIC'|'ADVANCED'|'PREMIUM'; title?: string; details?: string }) {
    const userId = req.user.sub as string;
    const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
    const keyId = (cfg?.jsonValue as any)?.key || process.env.RAZORPAY_KEY_ID;
    const keySecret = (cfg?.jsonValue as any)?.secret || process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error('Razorpay not configured');
    const planMap = {
      BASIC: { label: 'Remote Support — Basic (1 hour)', amount: 1499 },
      ADVANCED: { label: 'Remote Support — Advanced (2 hours)', amount: 1799 },
      PREMIUM: { label: 'Remote Support — Premium (3+ hours)', amount: 1999 }
    } as const;
    const plan = planMap[body.plan || 'BASIC'];
    const number = await this.newInvoiceNumber();
    const invoice = await this.prisma.invoice.create({
      data: {
        number,
        customerId: userId,
        status: 'PENDING',
        subtotal: plan.amount.toFixed(2),
        tax: '0.00',
        total: plan.amount.toFixed(2),
        currency: 'INR',
        items: { create: [{ name: plan.label, qty: 1, price: plan.amount.toFixed(2), total: plan.amount.toFixed(2) }] }
      },
      include: { items: true }
    });
    const Razorpay = require('razorpay');
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const payment = await this.prisma.payment.create({ data: { invoiceId: invoice.id, amount: invoice.total, method: 'razorpay', status: 'CREATED', provider: 'razorpay', metadata: { title: body.title, details: body.details, plan: body.plan } } });
    const order = await rzp.orders.create({ amount: Math.round(Number(invoice.total) * 100), currency: 'INR', receipt: `${invoice.number}-${payment.id}` });
    await this.prisma.payment.update({ where: { id: payment.id }, data: { providerOrderId: order.id } });
    return { order, keyId, invoiceId: invoice.id, paymentId: payment.id };
  }

  @Post('razorpay/webhook')
  @HttpCode(200)
  async webhook(@Headers('x-razorpay-signature') signature: string, @Body() body: any, @Res() res: Response) {
    try {
      const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
      const secret = (cfg?.jsonValue as any)?.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
      if (!secret) return res.status(200).json({ ok: true });
      const payload = JSON.stringify(body);
      const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      if (expected !== signature) return res.status(400).json({ ok: false });
      if (body.event === 'payment.captured') {
        const orderId = body.payload?.payment?.entity?.order_id;
        const paymentId = body.payload?.payment?.entity?.id;
        if (orderId && paymentId) {
          const payment = await this.prisma.payment.findFirst({ where: { providerOrderId: orderId } });
          if (payment && payment.status !== 'SUCCESS') {
            await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'SUCCESS', providerTxnId: paymentId } });
            await this.prisma.invoice.update({ where: { id: payment.invoiceId }, data: { status: 'PAID' } });
            if (!payment.createdTicketId) {
              const invoice = await this.prisma.invoice.findUnique({ where: { id: payment.invoiceId } });
              const meta = (payment.metadata as any) || {};
              const ticket = await this.prisma.ticket.create({ data: { code: await this.newTicketCode('REMOTE'), type: 'REMOTE' as any, status: 'NEW' as any, billingStatus: 'PAID' as any, priority: 'MEDIUM' as any, title: meta.title || `Remote Support - ${invoice?.number}`, description: meta.details || 'Paid remote support request', customerId: invoice!.customerId, invoiceId: invoice!.id, paymentId: payment.id } });
              this.realtime.emitTicketCreated(ticket);
              await this.prisma.payment.update({ where: { id: payment.id }, data: { createdTicketId: ticket.id } });
              const notification = await this.prisma.notification.create({ data: { userId: null, type: 'PAYMENT_SUCCESS', message: `Paid remote ticket ${ticket.code} created` } });
              this.realtime.emitNotification(notification);
            }
          }
        }
      }
      return res.json({ ok: true });
    } catch (e) {
      return res.status(200).json({ ok: true });
    }
  }

  private async newTicketCode(type: string): Promise<string> {
    const prefix = type === 'ONSITE' ? 'ON' : type === 'WEBDEV' ? 'WD' : 'RT';
    const number = Math.floor(10000 + Math.random() * 90000);
    const code = `${prefix}${new Date().getFullYear()}-${number}`;
    const exists = await this.prisma.ticket.findFirst({ where: { code } });
    if (exists) return this.newTicketCode(type);
    return code;
  }

  private async newInvoiceNumber() {
    const base = `INV-${new Date().getFullYear()}`;
    const count = await this.prisma.invoice.count();
    return `${base}-${String(count + 1).padStart(4, '0')}`;
  }
}















