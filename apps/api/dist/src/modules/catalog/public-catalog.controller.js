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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicCatalogController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublicCatalogController = class PublicCatalogController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async services() {
        const now = new Date();
        const cats = await this.prisma.serviceCategory.findMany({
            where: { active: true },
            orderBy: { sortOrder: 'asc' },
            include: {
                services: {
                    where: {
                        active: true,
                        OR: [
                            { activeFrom: null },
                            { activeFrom: { lte: now } }
                        ],
                        AND: [
                            { OR: [{ activeTo: null }, { activeTo: { gte: now } }] }
                        ]
                    },
                    orderBy: { sortOrder: 'asc' },
                    include: { prices: { where: { active: true }, orderBy: { createdAt: 'asc' } } }
                }
            }
        });
        return { categories: cats };
    }
};
exports.PublicCatalogController = PublicCatalogController;
__decorate([
    (0, common_1.Get)('services'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicCatalogController.prototype, "services", null);
exports.PublicCatalogController = PublicCatalogController = __decorate([
    (0, common_1.Controller)('catalog'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicCatalogController);
//# sourceMappingURL=public-catalog.controller.js.map