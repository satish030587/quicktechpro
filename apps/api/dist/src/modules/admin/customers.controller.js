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
exports.AdminCustomersController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let AdminCustomersController = class AdminCustomersController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(q, take) {
        const where = {
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
    async detail(id) {
        const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, phone: true, isActive: true, createdAt: true } });
        if (!user)
            return null;
        const [tickets, invoices, quotes, payments] = await Promise.all([
            this.prisma.ticket.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 5 }),
            this.prisma.invoice.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 5 }),
            this.prisma.quote.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 5 }),
            this.prisma.payment.findMany({ where: { invoice: { customerId: id } }, orderBy: { createdAt: 'desc' }, take: 5 })
        ]);
        return { user, tickets, invoices, quotes, payments };
    }
    async update(id, body) {
        const data = {};
        if (body.name !== undefined)
            data.name = body.name;
        if (body.phone !== undefined)
            data.phone = body.phone;
        if (body.isActive !== undefined)
            data.isActive = body.isActive;
        const user = await this.prisma.user.update({ where: { id }, data });
        return { user };
    }
    async tickets(id, skip, take) {
        const where = { customerId: id };
        const [items, total] = await Promise.all([
            this.prisma.ticket.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip) || 0, take: Number(take) || 10 }),
            this.prisma.ticket.count({ where })
        ]);
        return { items, total };
    }
    async invoices(id, skip, take) {
        const where = { customerId: id };
        const [items, total] = await Promise.all([
            this.prisma.invoice.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip) || 0, take: Number(take) || 10 }),
            this.prisma.invoice.count({ where })
        ]);
        return { items, total };
    }
    async quotes(id, skip, take) {
        const where = { customerId: id };
        const [items, total] = await Promise.all([
            this.prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' }, skip: Number(skip) || 0, take: Number(take) || 10 }),
            this.prisma.quote.count({ where })
        ]);
        return { items, total };
    }
    async payments(id, skip, take) {
        const where = { invoice: { customerId: id } };
        const [items, total] = await Promise.all([
            this.prisma.payment.findMany({ where, include: { invoice: true }, orderBy: { createdAt: 'desc' }, skip: Number(skip) || 0, take: Number(take) || 10 }),
            this.prisma.payment.count({ where })
        ]);
        return { items, total };
    }
};
exports.AdminCustomersController = AdminCustomersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminCustomersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCustomersController.prototype, "detail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminCustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/tickets'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminCustomersController.prototype, "tickets", null);
__decorate([
    (0, common_1.Get)(':id/invoices'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminCustomersController.prototype, "invoices", null);
__decorate([
    (0, common_1.Get)(':id/quotes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminCustomersController.prototype, "quotes", null);
__decorate([
    (0, common_1.Get)(':id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminCustomersController.prototype, "payments", null);
exports.AdminCustomersController = AdminCustomersController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, common_1.Controller)('admin/customers'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminCustomersController);
//# sourceMappingURL=customers.controller.js.map