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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const blog_notification_service_1 = require("./blog-notification.service");
const ADMIN_ANALYTICS_DAY_MS = 24 * 60 * 60 * 1000;
function startOfDayUtc(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function clampAnalyticsRangeDays(value, fallback = 30) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.min(Math.max(parsed, 1), 365);
}
function snapshotSourceBreakdown(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }
    const record = {};
    for (const [key, raw] of Object.entries(value)) {
        const numeric = typeof raw === 'number' ? raw : Number.parseFloat(String(raw ?? ''));
        if (Number.isFinite(numeric) && numeric > 0) {
            record[key] = numeric;
        }
    }
    return record;
}
function aggregateSourceTotals(values) {
    const totals = {};
    values.forEach((value) => {
        const record = snapshotSourceBreakdown(value);
        for (const [key, amount] of Object.entries(record)) {
            totals[key] = (totals[key] ?? 0) + amount;
        }
    });
    return totals;
}
let ContentController = class ContentController {
    constructor(prisma, blogNotifications) {
        this.prisma = prisma;
        this.blogNotifications = blogNotifications;
        this.basePostInclude = {
            category: true,
            author: { select: { id: true, name: true, email: true } },
            _count: { select: { comments: true } }
        };
    }
    slugify(input) {
        return input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    estimateReadingMinutes(content, fallback) {
        if (!content)
            return fallback ?? null;
        const words = content.split(/\s+/).filter(Boolean).length;
        if (!words)
            return fallback ?? null;
        return Math.max(1, Math.round(words / 200));
    }
    generateSummary(content) {
        if (!content)
            return null;
        const plain = content.replace(/\s+/g, ' ').trim();
        if (!plain)
            return null;
        const sentences = plain.split(/(?<=[.!?])\s+/).filter(Boolean);
        if (sentences.length === 0)
            return plain.slice(0, 280);
        let summary = sentences.slice(0, 2).join(' ');
        if (summary.length < 160 && sentences.length > 2) {
            summary = sentences.slice(0, 3).join(' ');
        }
        if (summary.length > 380) {
            summary = `${summary.slice(0, 377).trimEnd()}...`;
        }
        return summary;
    }
    async ensureUniqueSlug(baseSlug, excludeId) {
        let slug = baseSlug;
        let counter = 1;
        while (true) {
            const existing = await this.prisma.blogPost.findFirst({
                where: {
                    slug,
                    ...(excludeId ? { NOT: { id: excludeId } } : {})
                },
                select: { id: true }
            });
            if (!existing)
                return slug;
            counter += 1;
            slug = `${baseSlug}-${counter}`;
        }
    }
    async posts(status, search, featured) {
        const where = {};
        if (status) {
            const normalized = status.split(',').map((value) => value.toUpperCase());
            where.status = normalized.length > 1 ? { in: normalized } : normalized[0];
        }
        if (featured != null) {
            where.featured = featured === 'true';
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        const items = await this.prisma.blogPost.findMany({
            where,
            include: this.basePostInclude,
            orderBy: { createdAt: 'desc' },
            take: 200
        });
        return { items };
    }
    async post(id) {
        const post = await this.prisma.blogPost.findUnique({
            where: { id },
            include: {
                ...this.basePostInclude,
                comments: {
                    orderBy: { createdAt: 'desc' },
                    include: { author: { select: { id: true, name: true, email: true } } }
                }
            }
        });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        return post;
    }
    async createPost(req, body) {
        if (!body?.title?.trim())
            throw new common_1.BadRequestException('Title is required');
        if (!body?.content?.trim())
            throw new common_1.BadRequestException('Content is required');
        const authorId = req?.user?.id ?? req?.user?.sub;
        if (!authorId)
            throw new common_1.BadRequestException('Missing author context for blog post');
        const desiredSlug = body.slug?.trim() || this.slugify(body.title);
        if (!desiredSlug)
            throw new common_1.BadRequestException('Unable to derive slug from title');
        const slug = await this.ensureUniqueSlug(desiredSlug);
        const status = (body.status ?? client_1.BlogStatus.DRAFT);
        const tags = Array.isArray(body.tags)
            ? body.tags
            : typeof body.tags === 'string' && body.tags.trim().length
                ? body.tags.split(',').map((token) => token.trim()).filter(Boolean)
                : [];
        const aiSummary = body.aiSummary?.trim() || this.generateSummary(body.content);
        const data = {
            title: body.title.trim(),
            slug,
            excerpt: body.excerpt?.trim() || null,
            content: body.content,
            coverImage: body.coverImage?.trim() || null,
            status,
            aiSummary,
            allowComments: body.allowComments ?? true,
            featured: body.featured ?? false,
            tags,
            readingMinutes: this.estimateReadingMinutes(body.content, body.readingMinutes),
            authorId,
            categoryId: body.categoryId ?? null,
            publishedAt: status === client_1.BlogStatus.PUBLISHED
                ? body.publishedAt
                    ? new Date(body.publishedAt)
                    : new Date()
                : null
        };
        const post = await this.prisma.blogPost.create({
            data,
            include: this.basePostInclude
        });
        if (post.status === client_1.BlogStatus.PUBLISHED) {
            await this.blogNotifications.notifyPostPublished(post.id);
        }
        return post;
    }
    async updatePost(id, body) {
        const existing = await this.prisma.blogPost.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Blog post not found');
        let slug = existing.slug;
        if (body.slug && body.slug !== existing.slug) {
            const normalized = this.slugify(body.slug);
            if (!normalized)
                throw new common_1.BadRequestException('Invalid slug');
            slug = await this.ensureUniqueSlug(normalized, existing.id);
        }
        else if (body.title && !body.slug) {
            const autoSlug = this.slugify(existing.title);
            if (existing.slug === autoSlug) {
                const newSlug = this.slugify(body.title);
                if (newSlug) {
                    slug = await this.ensureUniqueSlug(newSlug, existing.id);
                }
            }
        }
        const status = body.status ?? existing.status;
        const content = body.content ?? existing.content;
        const aiSummary = body.aiSummary !== undefined
            ? (body.aiSummary?.trim() || null)
            : (body.content !== undefined ? this.generateSummary(content) : existing.aiSummary);
        const tags = Array.isArray(body.tags)
            ? body.tags
            : typeof body.tags === 'string'
                ? body.tags.split(',').map((token) => token.trim()).filter(Boolean)
                : existing.tags;
        const publishedAt = (() => {
            if (status === client_1.BlogStatus.PUBLISHED) {
                if (existing.status !== client_1.BlogStatus.PUBLISHED) {
                    return body.publishedAt ? new Date(body.publishedAt) : new Date();
                }
                return body.publishedAt ? new Date(body.publishedAt) : existing.publishedAt;
            }
            return existing.publishedAt;
        })();
        const data = {
            title: body.title?.trim() ?? existing.title,
            slug,
            excerpt: body.excerpt === undefined ? existing.excerpt : body.excerpt?.trim() || null,
            content,
            coverImage: body.coverImage === undefined ? existing.coverImage : body.coverImage?.trim() || null,
            status,
            aiSummary,
            allowComments: body.allowComments ?? existing.allowComments,
            featured: body.featured ?? existing.featured,
            tags,
            readingMinutes: this.estimateReadingMinutes(content, body.readingMinutes ?? existing.readingMinutes),
            categoryId: body.categoryId === undefined ? existing.categoryId : body.categoryId ?? null,
            publishedAt
        };
        const post = await this.prisma.blogPost.update({
            where: { id },
            data,
            include: this.basePostInclude
        });
        if (existing.status !== client_1.BlogStatus.PUBLISHED && post.status === client_1.BlogStatus.PUBLISHED) {
            await this.blogNotifications.notifyPostPublished(post.id);
        }
        return post;
    }
    async postStatus(id, body) {
        const existing = await this.prisma.blogPost.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Blog post not found');
        const status = body.status;
        const publishedAt = status === client_1.BlogStatus.PUBLISHED
            ? existing.publishedAt ?? new Date()
            : existing.publishedAt;
        const post = await this.prisma.blogPost.update({
            where: { id },
            data: { status, publishedAt },
            include: this.basePostInclude
        });
        if (existing.status !== client_1.BlogStatus.PUBLISHED && post.status === client_1.BlogStatus.PUBLISHED) {
            await this.blogNotifications.notifyPostPublished(post.id);
        }
        return post;
    }
    async regenerateSummary(id) {
        const existing = await this.prisma.blogPost.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Blog post not found');
        const aiSummary = this.generateSummary(existing.content);
        const post = await this.prisma.blogPost.update({
            where: { id },
            data: { aiSummary },
            include: this.basePostInclude
        });
        return post;
    }
    async deletePost(id) {
        const existing = await this.prisma.blogPost.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Blog post not found');
        await this.prisma.blogComment.deleteMany({ where: { postId: id } });
        await this.prisma.blogPost.delete({ where: { id } });
        return { success: true };
    }
    async analyticsOverview(days) {
        const rangeDays = clampAnalyticsRangeDays(days, 30);
        const now = new Date();
        const since = startOfDayUtc(new Date(now.getTime() - (rangeDays - 1) * ADMIN_ANALYTICS_DAY_MS));
        const metrics = await this.prisma.blogPostMetric.findMany({
            where: { metricDate: { gte: since } },
            include: {
                post: { select: { id: true, title: true, slug: true, status: true } }
            },
            orderBy: { metricDate: 'asc' }
        });
        const summary = {
            totalViews: 0,
            uniqueVisitors: 0,
            totalReadSeconds: 0,
            sources: {}
        };
        const postMap = new Map();
        const trendMap = new Map();
        metrics.forEach((metric) => {
            summary.totalViews += metric.viewCount;
            summary.uniqueVisitors += metric.uniqueVisitors;
            summary.totalReadSeconds += metric.totalReadSeconds;
            const dateKey = startOfDayUtc(metric.metricDate).toISOString().slice(0, 10);
            const trendEntry = trendMap.get(dateKey) ?? { date: dateKey, viewCount: 0, uniqueVisitors: 0 };
            trendEntry.viewCount += metric.viewCount;
            trendEntry.uniqueVisitors += metric.uniqueVisitors;
            trendMap.set(dateKey, trendEntry);
            const postId = metric.postId;
            const existingPost = postMap.get(postId) ?? {
                postId,
                title: metric.post?.title ?? 'Untitled',
                slug: metric.post?.slug ?? '',
                status: metric.post?.status ?? client_1.BlogStatus.DRAFT,
                viewCount: 0,
                uniqueVisitors: 0,
                totalReadSeconds: 0,
                lastActivityAt: metric.metricDate
            };
            existingPost.viewCount += metric.viewCount;
            existingPost.uniqueVisitors += metric.uniqueVisitors;
            existingPost.totalReadSeconds += metric.totalReadSeconds;
            if (metric.metricDate > existingPost.lastActivityAt) {
                existingPost.lastActivityAt = metric.metricDate;
            }
            postMap.set(postId, existingPost);
            const recordSources = snapshotSourceBreakdown(metric.sourceBreakdown);
            for (const [key, count] of Object.entries(recordSources)) {
                summary.sources[key] = (summary.sources[key] ?? 0) + count;
            }
        });
        const totalPostsTracked = postMap.size;
        const topPosts = Array.from(postMap.values())
            .map((post) => ({
            postId: post.postId,
            title: post.title,
            slug: post.slug,
            status: post.status,
            viewCount: post.viewCount,
            uniqueVisitors: post.uniqueVisitors,
            avgReadSeconds: post.viewCount > 0 ? post.totalReadSeconds / post.viewCount : 0,
            lastActivityAt: post.lastActivityAt.toISOString()
        }))
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 10);
        const trend = Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
        const sourceEntries = Object.entries(summary.sources)
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count);
        return {
            rangeDays,
            totalPostsTracked,
            summary: {
                totalViews: summary.totalViews,
                uniqueVisitors: summary.uniqueVisitors,
                avgReadSeconds: summary.totalViews > 0 ? summary.totalReadSeconds / summary.totalViews : 0,
                averageViewsPerPost: totalPostsTracked > 0 ? summary.totalViews / totalPostsTracked : 0,
                sources: sourceEntries
            },
            topPosts,
            trend
        };
    }
    async adminPostMetrics(id, days) {
        const post = await this.prisma.blogPost.findUnique({
            where: { id },
            select: { id: true, title: true, slug: true, status: true }
        });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        const rangeDays = clampAnalyticsRangeDays(days, 30);
        const now = new Date();
        const since = startOfDayUtc(new Date(now.getTime() - (rangeDays - 1) * ADMIN_ANALYTICS_DAY_MS));
        const metrics = await this.prisma.blogPostMetric.findMany({
            where: { postId: id, metricDate: { gte: since } },
            orderBy: { metricDate: 'asc' }
        });
        const totalViews = metrics.reduce((sum, metric) => sum + metric.viewCount, 0);
        const totalUnique = metrics.reduce((sum, metric) => sum + metric.uniqueVisitors, 0);
        const totalReadSeconds = metrics.reduce((sum, metric) => sum + metric.totalReadSeconds, 0);
        const sourceTotals = aggregateSourceTotals(metrics.map((metric) => metric.sourceBreakdown));
        const trend = metrics.map((metric) => ({
            date: startOfDayUtc(metric.metricDate).toISOString().slice(0, 10),
            viewCount: metric.viewCount,
            uniqueVisitors: metric.uniqueVisitors,
            avgReadSeconds: Number((metric.avgReadSeconds ?? 0).toFixed(2))
        }));
        return {
            post,
            rangeDays,
            totals: {
                views: totalViews,
                uniqueVisitors: totalUnique,
                avgReadSeconds: totalViews > 0 ? Number((totalReadSeconds / totalViews).toFixed(2)) : 0,
                sources: sourceTotals
            },
            trend
        };
    }
    async subscribers(status, search) {
        const where = {};
        if (status === 'active')
            where.unsubscribed = false;
        if (status === 'unsubscribed')
            where.unsubscribed = true;
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }
            ];
        }
        const items = await this.prisma.blogSubscriber.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 500
        });
        return { items };
    }
    async updateSubscriber(id, body) {
        const data = {};
        if (body.name !== undefined) {
            data.name = body.name?.trim() || null;
        }
        if (body.unsubscribed !== undefined) {
            data.unsubscribed = Boolean(body.unsubscribed);
            data.unsubscribedAt = body.unsubscribed ? new Date() : null;
        }
        if (body.verified !== undefined) {
            data.verified = Boolean(body.verified);
        }
        const subscriber = await this.prisma.blogSubscriber.update({
            where: { id },
            data
        });
        return subscriber;
    }
    async deleteSubscriber(id) {
        await this.prisma.blogSubscriber.delete({ where: { id } });
        return { success: true };
    }
    async testSubscriber(id) {
        const subscriber = await this.prisma.blogSubscriber.findUnique({ where: { id } });
        if (!subscriber)
            throw new common_1.NotFoundException('Subscriber not found');
        await this.blogNotifications.sendSubscriptionTest(subscriber);
        return { queued: true };
    }
    async categories() {
        const items = await this.prisma.blogCategory.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { posts: true } } }
        });
        return { items };
    }
    async createCategory(body) {
        if (!body?.name?.trim())
            throw new common_1.BadRequestException('Category name is required');
        return this.prisma.blogCategory.create({ data: { name: body.name.trim() } });
    }
    async comments(status, postId) {
        const where = {};
        if (status)
            where.status = status;
        if (postId)
            where.postId = postId;
        const items = await this.prisma.blogComment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                post: { select: { id: true, title: true, slug: true } },
                author: { select: { id: true, name: true, email: true } }
            },
            take: 200
        });
        return { items };
    }
    async updateCommentStatus(id, body) {
        const existing = await this.prisma.blogComment.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Comment not found');
        const nextStatus = body.status;
        const data = { status: nextStatus };
        if (nextStatus === client_1.BlogCommentStatus.APPROVED) {
            data.autoFlagged = false;
        }
        const updated = await this.prisma.blogComment.update({
            where: { id },
            data
        });
        if (existing.status !== client_1.BlogCommentStatus.APPROVED && updated.status === client_1.BlogCommentStatus.APPROVED) {
            await this.blogNotifications.notifyCommentApproved(updated.id);
        }
        return updated;
    }
    async deleteComment(id) {
        await this.prisma.blogComment.delete({ where: { id } });
        return { success: true };
    }
    async testimonials(approved) {
        const where = {};
        if (approved != null)
            where.approved = approved === 'true';
        const items = await this.prisma.testimonial.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        return { items };
    }
    async testimonialApprove(id, body) {
        return this.prisma.testimonial.update({ where: { id }, data: { approved: Boolean(body.approved) } });
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "posts", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "post", null);
__decorate([
    (0, common_1.Post)('posts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "createPost", null);
__decorate([
    (0, common_1.Patch)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Patch)('posts/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "postStatus", null);
__decorate([
    (0, common_1.Post)('posts/:id/summary'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "regenerateSummary", null);
__decorate([
    (0, common_1.Delete)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "analyticsOverview", null);
__decorate([
    (0, common_1.Get)('posts/:id/metrics'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "adminPostMetrics", null);
__decorate([
    (0, common_1.Get)('subscribers'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "subscribers", null);
__decorate([
    (0, common_1.Patch)('subscribers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updateSubscriber", null);
__decorate([
    (0, common_1.Delete)('subscribers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "deleteSubscriber", null);
__decorate([
    (0, common_1.Post)('subscribers/:id/test'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "testSubscriber", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "categories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('comments'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "comments", null);
__decorate([
    (0, common_1.Patch)('comments/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updateCommentStatus", null);
__decorate([
    (0, common_1.Delete)('comments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)('testimonials'),
    __param(0, (0, common_1.Query)('approved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "testimonials", null);
__decorate([
    (0, common_1.Patch)('testimonials/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "testimonialApprove", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'content_moderator'),
    (0, common_1.Controller)('admin/content'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, blog_notification_service_1.BlogNotificationService])
], ContentController);
//# sourceMappingURL=content.controller.js.map