"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const events_gateway_1 = require("../../realtime/events.gateway");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const crypto = require("crypto");
let PaymentsController = class PaymentsController {
    constructor(prisma, realtime) {
        this.prisma = prisma;
        this.realtime = realtime;
    }
    async config() {
        const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
        const keyId = cfg?.jsonValue?.key || process.env.RAZORPAY_KEY_ID || '';
        return { keyId };
    }
    async createOrder(req, body) {
        const userId = req.user.sub;
        const invoice = await this.prisma.invoice.findUnique({ where: { id: body.invoiceId } });
        if (!invoice || invoice.customerId !== userId)
            throw new Error('Invoice not found');
        const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
        const keyId = cfg?.jsonValue?.key || process.env.RAZORPAY_KEY_ID;
        const keySecret = cfg?.jsonValue?.secret || process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret)
            throw new Error('Razorpay not configured');
        const Razorpay = require('razorpay');
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const amountPaise = Math.round(Number(invoice.total) * 100);
        const payment = await this.prisma.payment.create({ data: { invoiceId: invoice.id, amount: invoice.total, method: 'razorpay', status: 'CREATED', provider: 'razorpay' } });
        const order = await rzp.orders.create({ amount: amountPaise, currency: invoice.currency || 'INR', receipt: `${invoice.number}-${payment.id}` });
        await this.prisma.payment.update({ where: { id: payment.id }, data: { providerOrderId: order.id } });
        return { order, invoiceNumber: invoice.number, amount: invoice.total, currency: invoice.currency || 'INR' };
    }
    async verify(req, body) {
        const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
        const keySecret = cfg?.jsonValue?.secret || process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret)
            throw new Error('Razorpay not configured');
        const sign = crypto.createHmac('sha256', keySecret).update(body.razorpay_order_id + '|' + body.razorpay_payment_id).digest('hex');
        if (sign !== body.razorpay_signature)
            throw new Error('Invalid signature');
        const payment = await this.prisma.payment.findFirst({ where: { providerOrderId: body.razorpay_order_id } });
        if (!payment)
            throw new Error('Payment not found');
        if (payment.status !== 'SUCCESS') {
            await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'SUCCESS', providerTxnId: body.razorpay_payment_id } });
            await this.prisma.invoice.update({ where: { id: payment.invoiceId }, data: { status: 'PAID' } });
        }
        let createdTicketId = payment.createdTicketId;
        if (!createdTicketId) {
            const invoice = await this.prisma.invoice.findUnique({ where: { id: payment.invoiceId } });
            if (!invoice)
                throw new Error('Invoice not found');
            const meta = payment.metadata || {};
            const ticket = await this.prisma.ticket.create({
                data: {
                    code: await this.newTicketCode('REMOTE'),
                    type: 'REMOTE',
                    status: 'NEW',
                    billingStatus: 'PAID',
                    priority: 'MEDIUM',
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
            const notification = await this.prisma.notification.create({ data: { userId: null, type: 'PAYMENT_SUCCESS', message: `Paid remote ticket ${ticket.code} created` } });
            this.realtime.emitNotification(notification);
        }
        return { ok: true, ticketId: createdTicketId };
    }
    async remoteOrder(req, body) {
        const userId = req.user.sub;
        const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
        const keyId = cfg?.jsonValue?.key || process.env.RAZORPAY_KEY_ID;
        const keySecret = cfg?.jsonValue?.secret || process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret)
            throw new Error('Razorpay not configured');
        const planMap = {
            BASIC: { label: 'Remote Support — Basic (1 hour)', amount: 1499 },
            ADVANCED: { label: 'Remote Support — Advanced (2 hours)', amount: 1799 },
            PREMIUM: { label: 'Remote Support — Premium (3+ hours)', amount: 1999 }
        };
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
    async webhook(signature, body, res) {
        try {
            const cfg = await this.prisma.integrationSetting.findUnique({ where: { key: 'RAZORPAY' } });
            const secret = cfg?.jsonValue?.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
            if (!secret)
                return res.status(200).json({ ok: true });
            const payload = JSON.stringify(body);
            const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
            if (expected !== signature)
                return res.status(400).json({ ok: false });
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
                            const meta = payment.metadata || {};
                            const ticket = await this.prisma.ticket.create({ data: { code: await this.newTicketCode('REMOTE'), type: 'REMOTE', status: 'NEW', billingStatus: 'PAID', priority: 'MEDIUM', title: meta.title || `Remote Support - ${invoice?.number}`, description: meta.details || 'Paid remote support request', customerId: invoice.customerId, invoiceId: invoice.id, paymentId: payment.id } });
                            this.realtime.emitTicketCreated(ticket);
                            await this.prisma.payment.update({ where: { id: payment.id }, data: { createdTicketId: ticket.id } });
                            const notification = await this.prisma.notification.create({ data: { userId: null, type: 'PAYMENT_SUCCESS', message: `Paid remote ticket ${ticket.code} created` } });
                            this.realtime.emitNotification(notification);
                        }
                    }
                }
            }
            return res.json({ ok: true });
        }
        catch (e) {
            return res.status(200).json({ ok: true });
        }
    }
    async newTicketCode(type) {
        const prefix = type === 'ONSITE' ? 'ON' : type === 'WEBDEV' ? 'WD' : 'RT';
        const number = Math.floor(10000 + Math.random() * 90000);
        const code = `${prefix}${new Date().getFullYear()}-${number}`;
        const exists = await this.prisma.ticket.findFirst({ where: { code } });
        if (exists)
            return this.newTicketCode(type);
        return code;
    }
    async newInvoiceNumber() {
        const base = `INV-${new Date().getFullYear()}`;
        const count = await this.prisma.invoice.count();
        return `${base}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "config", null);
__decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard),
    (0, common_1.Post)('razorpay/order'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard),
    (0, common_1.Post)('razorpay/verify'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verify", null);
__decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard),
    (0, common_1.Post)('remote/order'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "remoteOrder", null);
__decorate([
    (0, common_1.Post)('razorpay/webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Headers)('x-razorpay-signature')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "webhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, events_gateway_1.EventsGateway])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map