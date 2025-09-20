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
exports.PublicBlogController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const jwt_access_guard_1 = require("../auth/guards/jwt-access.guard");
const TOXIC_KEYWORDS = [
    'idiot',
    'stupid',
    'hate',
    'trash',
    'useless',
    'scam',
    'fraud',
    'kill',
    'violence',
    'jerk'
];
const SPAM_TRIGGERS = [
    'buy now',
    'call now',
    'limited offer',
    'work from home',
    'earn money fast',
    'visit my site',
    'click here',
    'crypto investment',
    '100% free',
    'guaranteed profit'
];
const REPEATED_CHARACTER_PATTERN = /(.)\1{5,}/;
const MULTIPLE_LINK_PATTERN = /(https?:\/\/|www\.)/i;
function clampScore(value) {
    if (!Number.isFinite(value))
        return 0;
    return Math.max(0, Math.min(1, value));
}
function detectLanguageCode(value) {
    if (!value)
        return 'und';
    if (/[\u0900-\u097F]/.test(value))
        return 'hi';
    if (/[\u0400-\u04FF]/.test(value))
        return 'ru';
    if (/\b(gracias|hola|por favor|buenos dias)\b/i.test(value))
        return 'es';
    if (/\b(danke|hallo|bitte|guten tag)\b/i.test(value))
        return 'de';
    if (/\b(ola|obrigado|por favor|bom dia)\b/i.test(value))
        return 'pt';
    if (/\b(namaste|dhanyavad)\b/i.test(value))
        return 'hi';
    return 'en';
}
function analyzeCommentContent(content) {
    const trimmed = (content || '').trim();
    if (!trimmed) {
        return {
            languageCode: 'und',
            toxicityScore: 0,
            spamScore: 0,
            autoFlagged: false,
            moderationTags: []
        };
    }
    const lower = trimmed.toLowerCase();
    const tags = [];
    let toxicity = 0;
    let spam = 0;
    for (const keyword of TOXIC_KEYWORDS) {
        if (lower.includes(keyword)) {
            toxicity += 0.25;
            tags.push(`keyword:${keyword}`);
        }
    }
    if (/(?:\s|^)[A-Z]{4,}(?:\s|$)/.test(trimmed)) {
        toxicity += 0.1;
        tags.push('style:shouting');
    }
    if (REPEATED_CHARACTER_PATTERN.test(trimmed)) {
        toxicity += 0.1;
        tags.push('style:repetition');
    }
    for (const phrase of SPAM_TRIGGERS) {
        if (lower.includes(phrase)) {
            spam += 0.25;
            tags.push(`phrase:${phrase}`);
        }
    }
    const linkMatches = trimmed.match(/https?:\/\/[^\s]+/gi) || [];
    if (linkMatches.length > 0) {
        spam += Math.min(0.3 + 0.05 * (linkMatches.length - 1), 0.7);
        tags.push('links');
    }
    if (MULTIPLE_LINK_PATTERN.test(trimmed) && linkMatches.length === 0) {
        spam += 0.2;
        tags.push('links:pattern');
    }
    const uppercaseWords = trimmed.split(/\s+/).filter((word) => word.length >= 5 && word === word.toUpperCase() && /[A-Z]/.test(word));
    if (uppercaseWords.length >= 3) {
        toxicity += 0.1;
        tags.push('style:uppercase');
    }
    if (trimmed.length > 800) {
        spam += 0.2;
        tags.push('length:very_long');
    }
    if (/(discount|offer|limited|deal|prize)/.test(lower)) {
        spam += 0.15;
        tags.push('keywords:promotion');
    }
    const autoFlagged = spam >= 0.5 || toxicity >= 0.5 || tags.includes('links');
    return {
        languageCode: detectLanguageCode(trimmed),
        toxicityScore: Number(clampScore(toxicity).toFixed(2)),
        spamScore: Number(clampScore(spam).toFixed(2)),
        autoFlagged,
        moderationTags: Array.from(new Set(tags))
    };
}
const DAY_MS = 24 * 60 * 60 * 1000;
const KNOWN_SOURCE_KEYS = new Set(['direct', 'internal', 'search', 'social', 'referral', 'email', 'campaign']);
function startOfDayUtc(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function clampDurationSeconds(value) {
    const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
    if (!Number.isFinite(numeric) || numeric <= 0)
        return 0;
    return Math.min(Math.round(numeric), 1800);
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
function mergeSourceBreakdownValue(value, source) {
    const record = snapshotSourceBreakdown(value);
    record[source] = (record[source] ?? 0) + 1;
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
function normaliseSourceKey(provided, req) {
    const candidate = typeof provided === 'string' ? provided.trim().toLowerCase() : '';
    if (candidate && KNOWN_SOURCE_KEYS.has(candidate))
        return candidate;
    const refererHeader = req?.headers?.referer || req?.headers?.referrer;
    if (typeof refererHeader === 'string' && refererHeader) {
        try {
            const url = new URL(refererHeader);
            const host = (url.hostname || '').toLowerCase();
            const ownHost = typeof req?.headers?.host === 'string' ? req.headers.host.split(':')[0].toLowerCase() : '';
            if (ownHost && host.includes(ownHost))
                return 'internal';
            if (/google|bing|duckduckgo|yahoo|baidu|yandex/.test(host))
                return 'search';
            if (/facebook|instagram|twitter|linkedin|tiktok|reddit|whatsapp|telegram/.test(host))
                return 'social';
            return 'referral';
        }
        catch {
            return 'referral';
        }
    }
    return candidate || 'direct';
}
function resolveVisitorHash(fingerprint, req) {
    const trimmed = typeof fingerprint === 'string' ? fingerprint.trim() : '';
    const candidate = trimmed ? trimmed.slice(0, 150) : null;
    if (candidate) {
        return (0, crypto_1.createHash)('sha256').update(candidate).digest('hex');
    }
    const forwarded = typeof req?.headers?.['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : '';
    const ip = forwarded || req?.ip || req?.socket?.remoteAddress || '';
    if (!ip)
        return null;
    return (0, crypto_1.createHash)('sha256').update(ip).digest('hex');
}
function normaliseRangeDays(value, fallback = 30) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.min(Math.max(parsed, 1), 180);
}
let PublicBlogController = class PublicBlogController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(take, skip, category, search, featured) {
        const takeNumber = Math.min(Math.max(Number(take) || 12, 1), 50);
        const skipNumber = Math.max(Number(skip) || 0, 0);
        const where = { status: client_1.BlogStatus.PUBLISHED };
        if (category) {
            const parsedId = Number(category);
            if (!Number.isNaN(parsedId)) {
                where.categoryId = parsedId;
            }
            else {
                where.category = { name: { equals: category, mode: 'insensitive' } };
            }
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (featured != null) {
            where.featured = featured === 'true';
        }
        const posts = await this.prisma.blogPost.findMany({
            where,
            orderBy: [
                ...(featured === 'true' || featured === 'false' ? [] : [{ featured: 'desc' }]),
                { publishedAt: 'desc' }
            ],
            include: {
                category: true,
                author: { select: { id: true, name: true, email: true } },
                comments: {
                    where: { status: client_1.BlogCommentStatus.APPROVED },
                    select: { id: true }
                }
            },
            skip: skipNumber,
            take: takeNumber
        });
        const items = posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            status: post.status,
            allowComments: post.allowComments,
            featured: post.featured,
            tags: post.tags,
            readingMinutes: post.readingMinutes,
            publishedAt: post.publishedAt,
            category: post.category,
            author: post.author,
            commentCount: post.comments.length
        }));
        return { items };
    }
    async detail(slug) {
        const post = await this.prisma.blogPost.findFirst({
            where: { slug, status: client_1.BlogStatus.PUBLISHED },
            include: {
                category: true,
                author: { select: { id: true, name: true, email: true } },
                comments: {
                    where: { status: client_1.BlogCommentStatus.APPROVED },
                    orderBy: { createdAt: 'asc' },
                    include: { author: { select: { id: true, name: true, email: true } } }
                }
            }
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        return {
            post: {
                ...post,
                commentCount: post.comments.length
            }
        };
    }
    async recordView(slug, req, body) {
        if (!slug)
            throw new common_1.BadRequestException('Invalid post reference');
        const post = await this.prisma.blogPost.findFirst({
            where: { slug, status: client_1.BlogStatus.PUBLISHED },
            select: { id: true }
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        const now = new Date();
        const metricDate = startOfDayUtc(now);
        const duration = clampDurationSeconds(body?.durationSeconds);
        const sourceKey = normaliseSourceKey(body?.source, req);
        const visitorHash = resolveVisitorHash(body?.fingerprint, req);
        const result = await this.prisma.$transaction(async (tx) => {
            const existingMetric = await tx.blogPostMetric.findFirst({
                where: { postId: post.id, metricDate }
            });
            let viewCount = (existingMetric?.viewCount ?? 0) + 1;
            let totalReadSeconds = (existingMetric?.totalReadSeconds ?? 0) + duration;
            let avgReadSeconds = viewCount > 0 ? totalReadSeconds / viewCount : 0;
            let uniqueVisitors = existingMetric?.uniqueVisitors ?? 0;
            const sourceBreakdown = mergeSourceBreakdownValue(existingMetric?.sourceBreakdown, sourceKey);
            let metricId;
            if (existingMetric) {
                const updated = await tx.blogPostMetric.update({
                    where: { id: existingMetric.id },
                    data: {
                        viewCount,
                        totalReadSeconds,
                        avgReadSeconds,
                        sourceBreakdown
                    }
                });
                metricId = updated.id;
            }
            else {
                const created = await tx.blogPostMetric.create({
                    data: {
                        postId: post.id,
                        metricDate,
                        viewCount,
                        totalReadSeconds,
                        avgReadSeconds,
                        uniqueVisitors,
                        sourceBreakdown
                    }
                });
                metricId = created.id;
            }
            if (visitorHash) {
                const existingVisitor = await tx.blogPostMetricVisitor.findUnique({
                    where: { metricId_visitorHash: { metricId, visitorHash } }
                });
                if (existingVisitor) {
                    await tx.blogPostMetricVisitor.update({
                        where: { id: existingVisitor.id },
                        data: { visitCount: existingVisitor.visitCount + 1, lastSeen: now }
                    });
                }
                else {
                    await tx.blogPostMetricVisitor.create({
                        data: { metricId, visitorHash, visitCount: 1, lastSeen: now }
                    });
                    uniqueVisitors += 1;
                    await tx.blogPostMetric.update({
                        where: { id: metricId },
                        data: { uniqueVisitors }
                    });
                }
            }
            avgReadSeconds = viewCount > 0 ? totalReadSeconds / viewCount : 0;
            return {
                viewCount,
                uniqueVisitors,
                avgReadSeconds,
                sourceBreakdown
            };
        });
        return {
            success: true,
            metrics: {
                views: result.viewCount,
                uniqueVisitors: result.uniqueVisitors,
                avgReadSeconds: Number(result.avgReadSeconds.toFixed(2)),
                sources: result.sourceBreakdown
            }
        };
    }
    async postMetrics(slug, days) {
        if (!slug)
            throw new common_1.BadRequestException('Invalid post reference');
        const post = await this.prisma.blogPost.findFirst({
            where: { slug, status: client_1.BlogStatus.PUBLISHED },
            select: { id: true, title: true, slug: true }
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        const rangeDays = normaliseRangeDays(days, 30);
        const now = new Date();
        const since = startOfDayUtc(new Date(now.getTime() - (rangeDays - 1) * DAY_MS));
        const metrics = await this.prisma.blogPostMetric.findMany({
            where: { postId: post.id, metricDate: { gte: since } },
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
    async comment(slug, req, body) {
        if (!body?.content?.trim())
            throw new common_1.BadRequestException('Comment cannot be empty');
        const post = await this.prisma.blogPost.findFirst({
            where: { slug, status: client_1.BlogStatus.PUBLISHED },
            select: { id: true, allowComments: true }
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (!post.allowComments)
            throw new common_1.BadRequestException('Comments are disabled for this post');
        const trimmedContent = body.content.trim();
        const analysis = analyzeCommentContent(trimmedContent);
        const comment = await this.prisma.blogComment.create({
            data: {
                postId: post.id,
                content: trimmedContent,
                status: client_1.BlogCommentStatus.PENDING,
                authorId: req.user?.id ?? null,
                authorName: req.user?.name ?? null,
                authorEmail: req.user?.email ?? null,
                languageCode: analysis.languageCode,
                toxicityScore: analysis.toxicityScore,
                spamScore: analysis.spamScore,
                autoFlagged: analysis.autoFlagged,
                moderationTags: analysis.moderationTags,
                analyzedAt: new Date()
            }
        });
        return {
            comment,
            message: 'Comment submitted for review'
        };
    }
};
exports.PublicBlogController = PublicBlogController;
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, common_1.Query)('take')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('category')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PublicBlogController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('posts/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicBlogController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('posts/:slug/view'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PublicBlogController.prototype, "recordView", null);
__decorate([
    (0, common_1.Get)('posts/:slug/metrics'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicBlogController.prototype, "postMetrics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_access_guard_1.JwtAccessGuard),
    (0, common_1.Post)('posts/:slug/comments'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PublicBlogController.prototype, "comment", null);
exports.PublicBlogController = PublicBlogController = __decorate([
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicBlogController);
//# sourceMappingURL=public-blog.controller.js.map