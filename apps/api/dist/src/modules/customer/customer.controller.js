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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const events_gateway_1 = require("../../realtime/events.gateway");
const prisma_service_1 = require("../../prisma/prisma.service");
let CustomerController = class CustomerController {
    constructor(prisma, realtime) {
        this.prisma = prisma;
        this.realtime = realtime;
    }
    async dashboard(req) {
        const userId = req.user.sub;
        const [openTickets, pendingQuotes, dueInvoices, nextAppt] = await Promise.all([
            this.prisma.ticket.count({ where: { customerId: userId, NOT: { status: 'CLOSED' } } }),
            this.prisma.quote.count({ where: { customerId: userId, status: 'SENT' } }).catch(() => 0),
            this.prisma.invoice.count({ where: { customerId: userId, status: { in: ['PENDING', 'OVERDUE'] } } }).catch(() => 0),
            this.prisma.appointment.findFirst({ where: { ticket: { customerId: userId } }, orderBy: { scheduledAt: 'asc' } }).catch(() => null)
        ]);
        return { openTickets, pendingQuotes, dueInvoices, nextAppointment: nextAppt };
    }
    async tickets(req, status) {
        const userId = req.user.sub;
        const where = { customerId: userId };
        if (status)
            where.status = status;
        const items = await this.prisma.ticket.findMany({ where, orderBy: { createdAt: 'desc' }, include: { assignedTo: true } });
        return { items };
    }
    async createTicket(req, body) {
        const userId = req.user.sub;
        const code = await this.generateTicketCode(body.type || 'REMOTE');
        const t = await this.prisma.ticket.create({ data: { code, type: body.type, priority: (body.priority || 'MEDIUM'), title: body.title, description: body.description, customerId: userId } });
        this.realtime.emitTicketCreated(t);
        const notification = await this.prisma.notification.create({ data: { userId: null, type: 'ticket', message: `New ${(body.type || 'REMOTE')} ticket ${code} from ${req.user.email}` } });
        this.realtime.emitNotification(notification);
        return t;
    }
    async ticket(req, id) {
        const userId = req.user.sub;
        const t = await this.prisma.ticket.findFirst({ where: { id, customerId: userId }, include: { messages: { include: { sender: true } }, attachments: true, assignedTo: true } });
        return t;
    }
    async ticketMessage(req, id, body) {
        const userId = req.user.sub;
        const owns = await this.prisma.ticket.findFirst({ where: { id, customerId: userId }, select: { id: true } });
        if (!owns)
            return { ok: false };
        const m = await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: userId, content: body.content || '' } });
        this.realtime.emitTicketMessage(id, { ...m, internal: false });
        return m;
    }
    async quotes(req, skip, take) {
        const userId = req.user.sub;
        const where = { customerId: userId };
        const [items, total] = await Promise.all([
            this.prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' }, include: { items: true }, skip: Number(skip) || 0, take: Number(take) || 10 }),
            this.prisma.quote.count({ where })
        ]);
        return { items, total };
    }
    async quoteDetail(req, id) {
        const userId = req.user.sub;
        const q = await this.prisma.quote.findFirst({ where: { id, customerId: userId }, include: { items: true } });
        return q;
    }
    async acceptQuote(req, id) {
        const userId = req.user.sub;
        const q = await this.prisma.quote.update({ where: { id }, data: { status: 'ACCEPTED' } });
        if (q.customerId !== userId)
            return { ok: false };
        return { ok: true };
    }
    async rejectQuote(req, id) {
        const userId = req.user.sub;
        const q = await this.prisma.quote.update({ where: { id }, data: { status: 'REJECTED' } });
        if (q.customerId !== userId)
            return { ok: false };
        return { ok: true };
    }
    async invoices(req) {
        const userId = req.user.sub;
        const items = await this.prisma.invoice.findMany({ where: { customerId: userId }, include: { items: true, payments: true }, orderBy: { createdAt: 'desc' } });
        return { items };
    }
    async payments(req) {
        const userId = req.user.sub;
        const items = await this.prisma.payment.findMany({ where: { invoice: { customerId: userId } }, include: { invoice: true }, orderBy: { createdAt: 'desc' } });
        return { items };
    }
    async appointments(req) {
        const userId = req.user.sub;
        const items = await this.prisma.appointment.findMany({ where: { ticket: { customerId: userId } }, include: { ticket: true }, orderBy: { scheduledAt: 'asc' } });
        return { items };
    }
    async requestAppointment(req, body) {
        const userId = req.user.sub;
        const owns = await this.prisma.ticket.findFirst({ where: { id: body.ticketId, customerId: userId }, select: { id: true, code: true, title: true, customerId: true } });
        if (!owns) {
            throw new common_1.BadRequestException('Ticket not found');
        }
        const scheduledAt = new Date(body.scheduledAt);
        if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
            throw new common_1.BadRequestException('Appointment time must be in the future');
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
    async profile(req) {
        const userId = req.user.sub;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        return { email: user?.email, name: user?.name, phone: user?.phone, marketingEmailOptIn: user?.marketingEmailOptIn, marketingSmsOptIn: user?.marketingSmsOptIn };
    }
    async updateProfile(req, body) {
        const userId = req.user.sub;
        const u = await this.prisma.user.update({ where: { id: userId }, data: { name: body.name, phone: body.phone, marketingEmailOptIn: body.marketingEmailOptIn, marketingSmsOptIn: body.marketingSmsOptIn } });
        return { ok: true };
    }
    async notifications(req, skip, take, read) {
        const userId = req.user.sub;
        const where = { userId };
        if (read != null)
            where.read = read === 'true';
        const [items, total] = await Promise.all([
            this.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip) || 0, take: Number(take) || 10 }),
            this.prisma.notification.count({ where })
        ]);
        const unreadCount = await this.prisma.notification.count({ where: { userId, read: false } });
        return { items, total, unreadCount };
    }
    async markRead(req, id) {
        const userId = req.user.sub;
        const n = await this.prisma.notification.update({ where: { id }, data: { read: true } });
        if (n.userId !== userId)
            return { ok: false };
        return { ok: true };
    }
    async markAllRead(req) {
        const userId = req.user.sub;
        await this.prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
        return { ok: true };
    }
    async generateTicketCode(type) {
        const prefix = type === 'ONSITE' ? 'ON' : type === 'WEBDEV' ? 'WD' : 'RT';
        const number = Math.floor(10000 + Math.random() * 90000);
        const code = `${prefix}${new Date().getFullYear()}-${number}`;
        const exists = await this.prisma.ticket.findFirst({ where: { code } });
        if (exists)
            return this.generateTicketCode(type);
        return code;
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('tickets'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "tickets", null);
__decorate([
    (0, common_1.Post)('tickets'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "ticket", null);
__decorate([
    (0, common_1.Post)('tickets/:id/messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "ticketMessage", null);
__decorate([
    (0, common_1.Get)('quotes'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "quotes", null);
__decorate([
    (0, common_1.Get)('quotes/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "quoteDetail", null);
__decorate([
    (0, common_1.Post)('quotes/:id/accept'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "acceptQuote", null);
__decorate([
    (0, common_1.Post)('quotes/:id/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "rejectQuote", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "invoices", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "payments", null);
__decorate([
    (0, common_1.Get)('appointments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "appointments", null);
__decorate([
    (0, common_1.Post)('appointments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "requestAppointment", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "profile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('notifications'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __param(3, (0, common_1.Query)('read')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "notifications", null);
__decorate([
    (0, common_1.Post)('notifications/:id/read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "markRead", null);
__decorate([
    (0, common_1.Post)('notifications/mark-all-read'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "markAllRead", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard),
    (0, common_1.Controller)('customer'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, events_gateway_1.EventsGateway])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map