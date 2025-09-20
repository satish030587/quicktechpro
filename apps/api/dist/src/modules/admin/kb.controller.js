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
exports.KBAdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let KBAdminController = class KBAdminController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    categories() {
        return this.prisma.kBCategory.findMany({ orderBy: { name: 'asc' } });
    }
    upsertCategory(body) {
        if (body.id)
            return this.prisma.kBCategory.update({ where: { id: body.id }, data: { name: body.name } });
        return this.prisma.kBCategory.create({ data: { name: body.name } });
    }
    articles(status, categoryId, q) {
        const where = {};
        if (status)
            where.status = status;
        if (categoryId)
            where.categoryId = Number(categoryId);
        if (q)
            where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }];
        return this.prisma.knowledgeBaseArticle.findMany({ where, orderBy: { updatedAt: 'desc' }, take: 200 });
    }
    upsertArticle(body) {
        const { id, ...data } = body;
        if (data.categoryId)
            data.categoryId = Number(data.categoryId);
        if (id)
            return this.prisma.knowledgeBaseArticle.update({ where: { id }, data });
        return this.prisma.knowledgeBaseArticle.create({ data });
    }
    setStatus(id, body) {
        return this.prisma.knowledgeBaseArticle.update({ where: { id }, data: { status: body.status } });
    }
};
exports.KBAdminController = KBAdminController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KBAdminController.prototype, "categories", null);
__decorate([
    (0, common_1.Post)('category'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KBAdminController.prototype, "upsertCategory", null);
__decorate([
    (0, common_1.Get)('articles'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], KBAdminController.prototype, "articles", null);
__decorate([
    (0, common_1.Post)('article'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KBAdminController.prototype, "upsertArticle", null);
__decorate([
    (0, common_1.Patch)('articles/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], KBAdminController.prototype, "setStatus", null);
exports.KBAdminController = KBAdminController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'manager', 'content_moderator'),
    (0, common_1.Controller)('admin/kb'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KBAdminController);
//# sourceMappingURL=kb.controller.js.map