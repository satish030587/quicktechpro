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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminController = class AdminController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary() {
        const [users, tickets, invoices, payments] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.ticket.count().catch(() => 0),
            this.prisma.invoice.count().catch(() => 0),
            this.prisma.payment.count().catch(() => 0)
        ]);
        return { users, tickets, invoices, payments };
    }
    async listUsers() {
        const items = await this.prisma.user.findMany({
            include: { roles: { include: { role: true } } },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        return { items: items.map(u => ({ id: u.id, email: u.email, roles: u.roles.map(r => r.role.name) })) };
    }
    async promote(body) {
        const user = await this.prisma.user.findUnique({ where: { email: body.email } });
        if (!user)
            return { ok: false, message: 'User not found' };
        const role = await this.prisma.role.upsert({ where: { name: body.role }, update: {}, create: { name: body.role } });
        await this.prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: role.id } }, update: {}, create: { userId: user.id, roleId: role.id } });
        return { ok: true };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Post)('users/promote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "promote", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map