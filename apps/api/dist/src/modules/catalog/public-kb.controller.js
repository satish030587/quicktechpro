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
exports.PublicKBController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublicKBController = class PublicKBController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(categoryId, q, skip, take) {
        const where = { status: 'PUBLISHED' };
        if (categoryId)
            where.categoryId = Number(categoryId);
        if (q)
            where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }];
        const [items, total, categories] = await Promise.all([
            this.prisma.knowledgeBaseArticle.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: Number(skip) || 0, take: Number(take) || 10 }),
            this.prisma.knowledgeBaseArticle.count({ where }),
            this.prisma.kBCategory.findMany({ orderBy: { name: 'asc' } })
        ]);
        return { items, total, categories };
    }
    async detail(slug) {
        const a = await this.prisma.knowledgeBaseArticle.findUnique({ where: { slug } });
        if (!a || a.status !== 'PUBLISHED')
            return null;
        return a;
    }
};
exports.PublicKBController = PublicKBController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('q')),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PublicKBController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicKBController.prototype, "detail", null);
exports.PublicKBController = PublicKBController = __decorate([
    (0, common_1.Controller)('kb'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicKBController);
//# sourceMappingURL=public-kb.controller.js.map