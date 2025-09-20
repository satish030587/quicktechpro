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
var BlogNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../auth/mail.service");
const client_1 = require("@prisma/client");
const PUBLIC_WEB_URL = process.env.PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://quicktechpro.com';
function resolvePostLink(slug) {
    if (!slug)
        return PUBLIC_WEB_URL;
    return `${PUBLIC_WEB_URL.replace(/\/$/, '')}/blog/${slug}`;
}
let BlogNotificationService = BlogNotificationService_1 = class BlogNotificationService {
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
        this.logger = new common_1.Logger(BlogNotificationService_1.name);
    }
    async logEmail(params) {
        try {
            await this.prisma.blogEmailLog.create({
                data: {
                    type: params.type,
                    recipient: params.recipient,
                    subject: params.subject,
                    body: params.body,
                    metadata: (params.metadata ?? {})
                }
            });
        }
        catch (error) {
            this.logger.warn(`Failed to log blog email for ${params.recipient}`, error);
        }
    }
    async notifyPostPublished(postId) {
        try {
            const post = await this.prisma.blogPost.findUnique({
                where: { id: postId },
                include: { author: { select: { id: true, name: true, email: true } } }
            });
            if (!post || post.status !== client_1.BlogStatus.PUBLISHED) {
                return;
            }
            const subscribers = await this.prisma.blogSubscriber.findMany({
                where: { unsubscribed: false, verified: true },
                orderBy: { createdAt: 'asc' },
                take: 1000
            });
            if (subscribers.length === 0) {
                return;
            }
            const subject = `New on QuickTechPro: ${post.title}`;
            const snippet = post.excerpt || (post.content ? post.content.slice(0, 140) : 'Take a look at the latest article.');
            const link = resolvePostLink(post.slug);
            for (const subscriber of subscribers) {
                try {
                    await this.mail.sendBlogNewPostEmail(subscriber.email, {
                        subject,
                        previewText: snippet,
                        link,
                        subscriberName: subscriber.name || subscriber.email
                    });
                    await this.logEmail({
                        type: 'blog_post_published',
                        recipient: subscriber.email,
                        subject,
                        body: snippet,
                        metadata: {
                            postId,
                            subscriberId: subscriber.id
                        }
                    });
                    await this.prisma.blogSubscriber.update({
                        where: { id: subscriber.id },
                        data: { lastNotifiedAt: new Date() }
                    });
                }
                catch (error) {
                    this.logger.warn(`Unable to queue blog newsletter email for ${subscriber.email}`, error);
                }
            }
        }
        catch (error) {
            this.logger.error(`Blog publish notification failed for post ${postId}`, error);
        }
    }
    async sendSubscriptionTest(subscriber) {
        try {
            await this.mail.sendBlogSubscriptionWelcome(subscriber.email, {
                link: PUBLIC_WEB_URL,
                subscriberName: subscriber.name ?? subscriber.email
            });
            await this.logEmail({
                type: 'newsletter_test',
                recipient: subscriber.email,
                subject: 'QuickTechPro newsletter test email',
                body: 'This is a test email triggered from the admin portal.',
                metadata: { subscriberId: subscriber.id }
            });
        }
        catch (error) {
            this.logger.warn(`Unable to send subscription test email to ${subscriber.email}`, error);
            throw error;
        }
    }
    async notifyCommentApproved(commentId) {
        try {
            const comment = await this.prisma.blogComment.findUnique({
                where: { id: commentId },
                include: {
                    post: {
                        select: {
                            id: true,
                            slug: true,
                            title: true,
                            author: { select: { id: true, email: true, name: true } }
                        }
                    }
                }
            });
            if (!comment || comment.status !== client_1.BlogCommentStatus.APPROVED) {
                return;
            }
            const recipients = new Map();
            if (comment.authorEmail) {
                recipients.set(comment.authorEmail.toLowerCase(), {
                    name: comment.authorName ?? undefined,
                    type: 'comment_author'
                });
            }
            if (comment.post?.author?.email) {
                recipients.set(comment.post.author.email.toLowerCase(), {
                    name: comment.post.author.name ?? undefined,
                    type: 'post_author'
                });
            }
            if (recipients.size === 0) {
                return;
            }
            const link = resolvePostLink(comment.post?.slug ?? '');
            const snippet = comment.content?.slice(0, 160) ?? 'Your comment has been approved.';
            for (const [email, meta] of recipients.entries()) {
                try {
                    await this.mail.sendCommentApprovedEmail(email, {
                        postTitle: comment.post?.title ?? 'QuickTechPro Blog',
                        link,
                        recipientName: meta.name ?? email,
                        commentSnippet: snippet
                    });
                    await this.logEmail({
                        type: `comment_${meta.type}`,
                        recipient: email,
                        subject: `Your comment is live on ${comment.post?.title ?? 'our blog'}`,
                        body: snippet,
                        metadata: {
                            commentId,
                            postId: comment.post?.id ?? null,
                            recipientType: meta.type
                        }
                    });
                }
                catch (error) {
                    this.logger.warn(`Unable to queue comment notification for ${email}`, error);
                }
            }
        }
        catch (error) {
            this.logger.error(`Blog comment approval notification failed for ${commentId}`, error);
        }
    }
};
exports.BlogNotificationService = BlogNotificationService;
exports.BlogNotificationService = BlogNotificationService = BlogNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], BlogNotificationService);
//# sourceMappingURL=blog-notification.service.js.map