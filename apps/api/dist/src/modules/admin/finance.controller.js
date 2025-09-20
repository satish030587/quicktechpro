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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let FinanceController = class FinanceController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async invoices(status) {
        const where = {};
        if (status)
            where.status = status;
        const items = await this.prisma.invoice.findMany({ where, include: { items: true, payments: true, customer: true }, orderBy: { createdAt: 'desc' }, take: 100 });
        return { items };
    }
    async createInvoice(body) {
        const number = await this.newInvoiceNumber();
        const subtotal = body.items.reduce((sum, i) => sum + Number(i.price) * (i.qty || 1), 0);
        const tax = (Number(body.taxPct || 0) / 100) * subtotal;
        const total = subtotal + tax;
        const invoice = await this.prisma.invoice.create({
            data: {
                number,
                customerId: body.customerId,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                items: { create: body.items.map(i => ({ name: i.name, qty: i.qty || 1, price: i.price, total: (Number(i.price) * (i.qty || 1)).toFixed(2) })) }
            },
            include: { items: true }
        });
        return invoice;
    }
    async invoiceStatus(id, body) {
        return this.prisma.invoice.update({ where: { id }, data: { status: body.status } });
    }
    async payments(status) {
        const where = {};
        if (status)
            where.status = status;
        const items = await this.prisma.payment.findMany({ where, include: { invoice: true }, orderBy: { createdAt: 'desc' }, take: 100 });
        return { items };
    }
    async reconcile(id, body) {
        return this.prisma.payment.update({ where: { id }, data: { status: body.status } });
    }
    async newInvoiceNumber() {
        const base = `INV-${new Date().getFullYear()}`;
        const count = await this.prisma.invoice.count({});
        return `${base}-${String(count + 1).padStart(4, '0')}`;
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('invoices'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "invoices", null);
__decorate([
    (0, common_1.Post)('invoices'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Patch)('invoices/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "invoiceStatus", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "payments", null);
__decorate([
    (0, common_1.Patch)('payments/:id/reconcile'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "reconcile", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map