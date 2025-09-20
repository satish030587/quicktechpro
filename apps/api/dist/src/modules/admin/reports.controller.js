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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let ReportsController = class ReportsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async summary(from, to) {
        const range = {};
        if (from || to) {
            range.createdAt = {};
            if (from)
                range.createdAt.gte = new Date(from);
            if (to)
                range.createdAt.lte = new Date(to);
        }
        const [tickets, payments, invoices] = await Promise.all([
            this.prisma.ticket.groupBy({ by: ['status'], _count: true, where: range }),
            this.prisma.payment.groupBy({ by: ['status'], _sum: { amount: true }, where: { ...(range.createdAt ? { createdAt: range.createdAt } : {}), status: 'SUCCESS' } }),
            this.prisma.invoice.groupBy({ by: ['status'], _sum: { total: true }, where: range })
        ]);
        return { tickets, payments, invoices };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "summary", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, common_1.Controller)('admin/reports'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map