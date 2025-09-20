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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const events_gateway_1 = require("../../realtime/events.gateway");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let AppointmentsController = class AppointmentsController {
    constructor(prisma, realtime) {
        this.prisma = prisma;
        this.realtime = realtime;
    }
    async list(from, to, technicianId, status) {
        const where = {};
        if (from || to) {
            where.scheduledAt = {};
            if (from)
                where.scheduledAt.gte = new Date(from);
            if (to)
                where.scheduledAt.lte = new Date(to);
        }
        if (technicianId)
            where.technicianId = technicianId;
        if (status) {
            const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
            if (statuses.length > 1) {
                where.status = { in: statuses };
            }
            else if (statuses.length === 1) {
                where.status = statuses[0];
            }
        }
        const items = await this.prisma.appointment.findMany({ where, include: { ticket: { include: { customer: true } }, technician: true }, orderBy: { scheduledAt: 'asc' }, take: 200 });
        return { items };
    }
    async create(body) {
        if (!body?.ticketId) {
            throw new common_1.BadRequestException('Ticket is required');
        }
        const scheduledAt = new Date(body.scheduledAt);
        if (Number.isNaN(scheduledAt.getTime())) {
            throw new common_1.BadRequestException('Invalid appointment date');
        }
        const appointment = await this.prisma.appointment.create({
            data: {
                ticketId: body.ticketId,
                scheduledAt,
                durationMins: body.durationMins || 60,
                address: body.address,
                notes: body.notes,
                technicianId: body.technicianId || null
            },
            include: { ticket: { include: { customer: true } }, technician: true }
        });
        this.realtime.emitAppointmentUpsert(appointment);
        return appointment;
    }
    async update(id, body) {
        const data = {};
        const allowed = ['scheduledAt', 'durationMins', 'address', 'notes', 'technicianId', 'status'];
        for (const key of allowed) {
            if (!(key in body))
                continue;
            if (key === 'scheduledAt') {
                const datetime = new Date(body[key]);
                if (Number.isNaN(datetime.getTime())) {
                    throw new common_1.BadRequestException('Invalid appointment date');
                }
                data.scheduledAt = datetime;
            }
            else if (key === 'technicianId') {
                data.technicianId = body[key] || null;
            }
            else {
                data[key] = body[key];
            }
        }
        if (Object.keys(data).length === 0) {
            throw new common_1.BadRequestException('No changes provided');
        }
        const appointment = await this.prisma.appointment.update({
            where: { id },
            data,
            include: { ticket: { include: { customer: true } }, technician: true }
        });
        this.realtime.emitAppointmentUpsert(appointment);
        return appointment;
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __param(2, (0, common_1.Query)('technicianId')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "update", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'technician'),
    (0, common_1.Controller)('admin/appointments'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, events_gateway_1.EventsGateway])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map