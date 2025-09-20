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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const events_gateway_1 = require("../../realtime/events.gateway");
let TicketsController = class TicketsController {
    constructor(prisma, realtime) {
        this.prisma = prisma;
        this.realtime = realtime;
    }
    async list(status, type, priority, assignedToId, customerEmail, q, billingStatus, skip, take) {
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (priority)
            where.priority = priority;
        if (assignedToId)
            where.assignedToId = assignedToId;
        if (customerEmail)
            where.customer = { email: customerEmail };
        if (billingStatus)
            where.billingStatus = billingStatus;
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
    async create(body) {
        const code = await this.generateTicketCode(body.type || 'REMOTE');
        const ticket = await this.prisma.ticket.create({
            data: {
                code,
                type: body.type,
                priority: (body.priority || 'MEDIUM'),
                title: body.title,
                description: body.description,
                customerId: body.customerId
            }
        });
        this.realtime.emitTicketCreated(ticket);
        return ticket;
    }
    get(id) {
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
    async update(id, body) {
        const data = {};
        const fields = ['status', 'priority', 'title', 'description', 'assignedToId'];
        for (const f of fields)
            if (f in body)
                data[f] = body[f];
        const t = await this.prisma.ticket.update({ where: { id }, data });
        this.realtime.emitTicketUpdate(id, {
            fields: Object.keys(data),
            customerId: t.customerId,
            status: t.status,
        });
        return t;
    }
    async remove(id) {
        const existing = await this.prisma.ticket.findUnique({
            where: { id },
            select: { id: true, customerId: true },
        });
        await this.prisma.ticket.delete({ where: { id } });
        this.realtime.emitTicketDeleted(id, { customerId: existing?.customerId });
        return { ok: true };
    }
    async addMessage(id, body) {
        const m = await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.senderId, content: body.content, internal: Boolean(body.internal) } });
        if (!m.internal)
            this.realtime.emitTicketMessage(id, m);
        return m;
    }
    async addNote(id, body) {
        return this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.senderId, content: body.content, internal: true } });
    }
    async startSession(id, body) {
        const t = await this.prisma.ticket.findUnique({ where: { id } });
        if (!t)
            throw new Error('Ticket not found');
        if (t.billingStatus !== 'PAID')
            throw new Error('Payment not confirmed');
        const session = await this.prisma.remoteSession.create({ data: { ticketId: id, tool: body.tool, joinLink: body.joinLink, code: body.code, technicianId: body.technicianId } });
        await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.technicianId, content: `Remote session started via ${body.tool}. ${body.joinLink ? 'Link: ' + body.joinLink : ''} ${body.code ? 'Code: ' + body.code : ''}`, internal: false } });
        this.realtime.emitTicketSession(id, { action: 'start', session });
        return session;
    }
    async endSession(id, body) {
        const session = await this.prisma.remoteSession.update({ where: { id: body.sessionId }, data: { endedAt: new Date(), notes: body.notes } });
        await this.prisma.ticketMessage.create({ data: { ticketId: id, senderId: body.technicianId, content: `Remote session ended. ${body.notes || ''}`, internal: false } });
        this.realtime.emitTicketSession(id, { action: 'end', session });
        return session;
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
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('priority')),
    __param(3, (0, common_1.Query)('assignedToId')),
    __param(4, (0, common_1.Query)('customerEmail')),
    __param(5, (0, common_1.Query)('q')),
    __param(6, (0, common_1.Query)('billingStatus')),
    __param(7, (0, common_1.Query)('skip')),
    __param(8, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addNote", null);
__decorate([
    (0, common_1.Post)(':id/remote-session/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)(':id/remote-session/end'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "endSession", null);
exports.TicketsController = TicketsController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'technician'),
    (0, common_1.Controller)('admin/tickets'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, events_gateway_1.EventsGateway])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map