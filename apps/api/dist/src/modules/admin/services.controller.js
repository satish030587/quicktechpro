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
exports.ServicesAdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let ServicesAdminController = class ServicesAdminController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async catalog() {
        return this.prisma.serviceCategory.findMany({
            orderBy: { sortOrder: 'asc' },
            include: { services: { include: { prices: true }, orderBy: { sortOrder: 'asc' } } }
        });
    }
    async upsertCategory(body) {
        const { id, ...data } = body;
        if (id)
            return this.prisma.serviceCategory.update({ where: { id }, data });
        return this.prisma.serviceCategory.create({ data });
    }
    async upsertService(body) {
        const { id, ...data } = body;
        if (id)
            return this.prisma.service.update({ where: { id }, data });
        return this.prisma.service.create({ data });
    }
    async upsertPrice(body) {
        const { id, ...data } = body;
        if (id)
            return this.prisma.servicePrice.update({ where: { id }, data });
        return this.prisma.servicePrice.create({ data });
    }
    async reorder(body) {
        const tx = [];
        if (body.categories)
            for (const c of body.categories)
                tx.push(this.prisma.serviceCategory.update({ where: { id: c.id }, data: { sortOrder: c.sortOrder } }));
        if (body.services)
            for (const s of body.services)
                tx.push(this.prisma.service.update({ where: { id: s.id }, data: { sortOrder: s.sortOrder } }));
        await this.prisma.$transaction(tx);
        return { ok: true };
    }
};
exports.ServicesAdminController = ServicesAdminController;
__decorate([
    (0, common_1.Get)('catalog'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServicesAdminController.prototype, "catalog", null);
__decorate([
    (0, common_1.Post)('category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesAdminController.prototype, "upsertCategory", null);
__decorate([
    (0, common_1.Post)('service'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesAdminController.prototype, "upsertService", null);
__decorate([
    (0, common_1.Post)('price'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesAdminController.prototype, "upsertPrice", null);
__decorate([
    (0, common_1.Post)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServicesAdminController.prototype, "reorder", null);
exports.ServicesAdminController = ServicesAdminController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, common_1.Controller)('admin/services'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesAdminController);
//# sourceMappingURL=services.controller.js.map