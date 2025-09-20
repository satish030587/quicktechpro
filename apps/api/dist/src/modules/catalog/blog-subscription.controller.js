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
exports.BlogSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../auth/mail.service");
const crypto_1 = require("crypto");
function isValidEmail(value) {
    if (!value)
        return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
let BlogSubscriptionController = class BlogSubscriptionController {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    normaliseEmail(email) {
        return email.trim().toLowerCase();
    }
    generateToken() {
        return (0, crypto_1.randomBytes)(24).toString('hex');
    }
    async recordWelcomeEmail(email, subscriberId) {
        try {
            await this.prisma.blogEmailLog.create({
                data: {
                    type: 'subscription_welcome',
                    recipient: email,
                    subject: 'Welcome to QuickTechPro insights',
                    body: 'Thank you for subscribing to our blog updates.',
                    metadata: { subscriberId }
                }
            });
        }
        catch {
        }
    }
    async subscribe(body) {
        if (!isValidEmail(body?.email)) {
            throw new common_1.BadRequestException('A valid email address is required');
        }
        const email = this.normaliseEmail(body.email);
        const name = body?.name?.trim() || null;
        const existing = await this.prisma.blogSubscriber.findUnique({ where: { email } });
        let subscriber;
        if (existing) {
            subscriber = await this.prisma.blogSubscriber.update({
                where: { email },
                data: {
                    name,
                    verified: true,
                    unsubscribed: false,
                    unsubscribedAt: null,
                    token: existing.token || this.generateToken(),
                    updatedAt: new Date()
                }
            });
        }
        else {
            subscriber = await this.prisma.blogSubscriber.create({
                data: {
                    email,
                    name,
                    verified: true,
                    token: this.generateToken()
                }
            });
        }
        await this.mail.sendBlogSubscriptionWelcome(email, {
            link: (process.env.PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://quicktechpro.com') + '/blog',
            subscriberName: subscriber.name || subscriber.email
        });
        await this.recordWelcomeEmail(email, subscriber.id);
        return {
            success: true,
            subscriber: {
                id: subscriber.id,
                email: subscriber.email,
                name: subscriber.name,
                verified: subscriber.verified,
                unsubscribed: subscriber.unsubscribed
            }
        };
    }
    async unsubscribe(body) {
        const token = body?.token?.trim();
        if (!token)
            throw new common_1.BadRequestException('Missing unsubscribe token');
        const subscriber = await this.prisma.blogSubscriber.findUnique({ where: { token } });
        if (!subscriber)
            throw new common_1.BadRequestException('Subscriber not found');
        await this.prisma.blogSubscriber.update({
            where: { id: subscriber.id },
            data: { unsubscribed: true, unsubscribedAt: new Date() }
        });
        return { success: true };
    }
};
exports.BlogSubscriptionController = BlogSubscriptionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogSubscriptionController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)('unsubscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogSubscriptionController.prototype, "unsubscribe", null);
exports.BlogSubscriptionController = BlogSubscriptionController = __decorate([
    (0, common_1.Controller)('blog/newsletter'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], BlogSubscriptionController);
//# sourceMappingURL=blog-subscription.controller.js.map