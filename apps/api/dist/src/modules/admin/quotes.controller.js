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
exports.QuotesAdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let QuotesAdminController = class QuotesAdminController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(status, customerEmail, q) {
        const where = {};
        if (status)
            where.status = status;
        if (customerEmail)
            where.customer = { email: customerEmail };
        if (q)
            where.title = { contains: q, mode: 'insensitive' };
        const items = await this.prisma.quote.findMany({ where, orderBy: { updatedAt: 'desc' }, include: { items: true, customer: true }, take: 100 });
        return { items };
    }
    get(id) {
        return this.prisma.quote.findUnique({ where: { id }, include: { items: true, customer: true } });
    }
    async upsert(req, body) {
        let customerId = body.customerId;
        if (!customerId && body.customerEmail) {
            const u = await this.prisma.user.findUnique({ where: { email: body.customerEmail } });
            if (!u)
                throw new Error('Customer not found');
            customerId = u.id;
        }
        if (!customerId)
            throw new Error('customerId or customerEmail required');
        const computeTotal = (items) => items.reduce((sum, it) => sum + Number(it.price) * (it.qty || 1), 0);
        if (body.id) {
            const update = { title: body.title };
            if (body.status)
                update.status = body.status;
            if (customerId)
                update.customerId = customerId;
            const q = await this.prisma.quote.update({ where: { id: body.id }, data: update });
            if (body.items) {
                await this.prisma.quoteItem.deleteMany({ where: { quoteId: q.id } });
                await this.prisma.quoteItem.createMany({ data: body.items.map(it => ({ quoteId: q.id, name: it.name, qty: it.qty || 1, price: it.price, total: (Number(it.price) * (it.qty || 1)).toFixed(2) })) });
                const total = computeTotal(body.items);
                await this.prisma.quote.update({ where: { id: q.id }, data: { total: total.toFixed(2) } });
            }
            return this.get(q.id);
        }
        else {
            const items = body.items || [];
            const total = computeTotal(items);
            const q = await this.prisma.quote.create({
                data: {
                    customerId,
                    title: body.title,
                    status: body.status || 'DRAFT',
                    total: total.toFixed(2),
                    items: { create: items.map(it => ({ name: it.name, qty: it.qty || 1, price: it.price, total: (Number(it.price) * (it.qty || 1)).toFixed(2) })) }
                }
            });
            return this.get(q.id);
        }
    }
    async setStatus(id, body) {
        return this.prisma.quote.update({ where: { id }, data: { status: body.status } });
    }
    async recalc(id) {
        const items = await this.prisma.quoteItem.findMany({ where: { quoteId: id } });
        const total = items.reduce((sum, it) => sum + Number(it.total), 0);
        return this.prisma.quote.update({ where: { id }, data: { total: total.toFixed(2) } });
    }
    async convert(id) {
        const q = await this.prisma.quote.findUnique({ where: { id }, include: { items: true } });
        if (!q)
            throw new Error('Quote not found');
        const baseNumber = `INV-${new Date().getFullYear()}`;
        const count = await this.prisma.invoice.count();
        const number = `${baseNumber}-${String(count + 1).padStart(4, '0')}`;
        const subtotal = q.items.reduce((sum, it) => sum + Number(it.price) * it.qty, 0);
        const tax = 0;
        const invoice = await this.prisma.invoice.create({
            data: {
                number,
                customerId: q.customerId,
                status: 'PENDING',
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: (subtotal + tax).toFixed(2),
                items: { create: q.items.map(it => ({ name: it.name, qty: it.qty, price: it.price, total: (Number(it.price) * it.qty).toFixed(2) })) }
            },
            include: { items: true }
        });
        return invoice;
    }
};
exports.QuotesAdminController = QuotesAdminController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('customerEmail')),
    __param(2, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], QuotesAdminController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotesAdminController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuotesAdminController.prototype, "upsert", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotesAdminController.prototype, "setStatus", null);
__decorate([
    (0, common_1.Post)(':id/recalculate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotesAdminController.prototype, "recalc", null);
__decorate([
    (0, common_1.Post)(':id/convert-to-invoice'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuotesAdminController.prototype, "convert", null);
exports.QuotesAdminController = QuotesAdminController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager'),
    (0, common_1.Controller)('admin/quotations'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesAdminController);
//# sourceMappingURL=quotes.controller.js.map