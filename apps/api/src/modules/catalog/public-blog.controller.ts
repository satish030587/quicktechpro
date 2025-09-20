import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHash } from 'crypto';
import { BlogCommentStatus, BlogStatus, Prisma } from '@prisma/client';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';

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

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function detectLanguageCode(value: string): string {
  if (!value) return 'und';
  if (/[\u0900-\u097F]/.test(value)) return 'hi';
  if (/[\u0400-\u04FF]/.test(value)) return 'ru';
  if (/\b(gracias|hola|por favor|buenos dias)\b/i.test(value)) return 'es';
  if (/\b(danke|hallo|bitte|guten tag)\b/i.test(value)) return 'de';
  if (/\b(ola|obrigado|por favor|bom dia)\b/i.test(value)) return 'pt';
  if (/\b(namaste|dhanyavad)\b/i.test(value)) return 'hi';
  return 'en';
}

function analyzeCommentContent(content: string) {
  const trimmed = (content || '').trim();
  if (!trimmed) {
    return {
      languageCode: 'und',
      toxicityScore: 0,
      spamScore: 0,
      autoFlagged: false,
      moderationTags: [] as string[]
    };
  }

  const lower = trimmed.toLowerCase();
  const tags: string[] = [];
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

function startOfDayUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function clampDurationSeconds(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.min(Math.round(numeric), 1800);
}

function snapshotSourceBreakdown(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {} as Record<string, number>;
  }
  const record: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const numeric = typeof raw === 'number' ? raw : Number.parseFloat(String(raw ?? ''));
    if (Number.isFinite(numeric) && numeric > 0) {
      record[key] = numeric;
    }
  }
  return record;
}

function mergeSourceBreakdownValue(value: Prisma.JsonValue | null | undefined, source: string) {
  const record = snapshotSourceBreakdown(value);
  record[source] = (record[source] ?? 0) + 1;
  return record;
}

function aggregateSourceTotals(values: Array<Prisma.JsonValue | null | undefined>) {
  const totals: Record<string, number> = {};
  values.forEach((value) => {
    const record = snapshotSourceBreakdown(value);
    for (const [key, amount] of Object.entries(record)) {
      totals[key] = (totals[key] ?? 0) + amount;
    }
  });
  return totals;
}

function normaliseSourceKey(provided: string | undefined, req: any) {
  const candidate = typeof provided === 'string' ? provided.trim().toLowerCase() : '';
  if (candidate && KNOWN_SOURCE_KEYS.has(candidate)) return candidate;

  const refererHeader = req?.headers?.referer || req?.headers?.referrer;
  if (typeof refererHeader === 'string' && refererHeader) {
    try {
      const url = new URL(refererHeader);
      const host = (url.hostname || '').toLowerCase();
      const ownHost = typeof req?.headers?.host === 'string' ? req.headers.host.split(':')[0].toLowerCase() : '';
      if (ownHost && host.includes(ownHost)) return 'internal';
      if (/google|bing|duckduckgo|yahoo|baidu|yandex/.test(host)) return 'search';
      if (/facebook|instagram|twitter|linkedin|tiktok|reddit|whatsapp|telegram/.test(host)) return 'social';
      return 'referral';
    } catch {
      return 'referral';
    }
  }

  return candidate || 'direct';
}

function resolveVisitorHash(fingerprint: string | undefined, req: any) {
  const trimmed = typeof fingerprint === 'string' ? fingerprint.trim() : '';
  const candidate = trimmed ? trimmed.slice(0, 150) : null;
  if (candidate) {
    return createHash('sha256').update(candidate).digest('hex');
  }
  const forwarded = typeof req?.headers?.['x-forwarded-for'] === 'string'
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : '';
  const ip = forwarded || req?.ip || req?.socket?.remoteAddress || '';
  if (!ip) return null;
  return createHash('sha256').update(ip).digest('hex');
}

function mapAvailableLanguages(translations: any[] | undefined) {
  return Array.isArray(translations)
    ? translations
        .map((translation) => translation?.language)
        .filter((language) => typeof language === 'string' && language.trim().length > 0)
        .map((language) => language.trim().toLowerCase())
    : [];
}

function shapePublicComment(comment: any): any {
  if (!comment) return null;
  const replies = Array.isArray(comment.replies)
    ? comment.replies.map((entry: any) => shapePublicComment(entry)).filter((entry: any) => Boolean(entry))
    : [];
  return {
    id: comment.id,
    parentId: comment.parentId ?? null,
    content: comment.content ?? '',
    status: comment.status ?? null,
    languageCode: comment.languageCode ?? null,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt ?? null,
    author: comment.author
      ? { id: comment.author.id, name: comment.author.name, email: comment.author.email }
      : null,
    authorName: comment.author?.name ?? comment.authorName ?? null,
    authorEmail: comment.author?.email ?? comment.authorEmail ?? null,
    moderationTags: Array.isArray(comment.moderationTags) ? comment.moderationTags : [],
    autoFlagged: Boolean(comment.autoFlagged),
    toxicityScore: comment.toxicityScore ?? null,
    spamScore: comment.spamScore ?? null,
    replies
  };
}

function buildCommentTree(comments: any[]): any[] {
  if (!Array.isArray(comments) || comments.length === 0) {
    return [];
  }

  const byId = new Map<string, any>();

  comments.forEach((comment) => {
    if (!comment || !comment.id) return;
    const node = {
      ...comment,
      replies: [] as any[],
    };
    byId.set(String(comment.id), node);
  });

  const roots: any[] = [];

  byId.forEach((node) => {
    const parentId = node.parentId ? String(node.parentId) : null;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes: any[]) => {
    nodes.sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });
    nodes.forEach((node) => {
      if (Array.isArray(node.replies) && node.replies.length > 0) {
        sortNodes(node.replies);
      }
    });
  };

  sortNodes(roots);

  return roots.map((node) => shapePublicComment(node)).filter(Boolean);
}

function transformPublicPostForResponse(post: any, language?: string) {
  const availableLanguages = mapAvailableLanguages(post?.translations);
  const normalizedLanguage = typeof language === 'string' ? language.trim().toLowerCase() : '';
  const translation = normalizedLanguage
    ? post?.translations?.find((entry: any) => entry?.language?.toLowerCase() === normalizedLanguage)
    : null;

  const summary = translation?.aiSummary || translation?.excerpt || post?.aiSummary || post?.summary || post?.excerpt || null;
  const activeLanguage = translation ? normalizedLanguage : 'default';

  const normalizedTranslations = availableLanguages.map((languageCode) => {
    const translationEntry = post?.translations?.find((entry: any) => entry?.language?.toLowerCase() === languageCode);
    return {
      language: languageCode,
      title: translationEntry?.title ?? null,
      excerpt: translationEntry?.excerpt ?? null,
      aiSummary: translationEntry?.aiSummary ?? null
    };
  });

  const flatComments = Array.isArray(post?.comments) ? post.comments : [];
  const shapedComments = buildCommentTree(flatComments);

  const commentCount =
    typeof post?._count?.comments === 'number'
      ? post._count.comments
      : flatComments.length;

  return {
    id: post?.id,
    title: translation?.title || post?.title,
    slug: post?.slug,
    excerpt: translation?.excerpt || post?.excerpt,
    summary,
    content: translation?.content || post?.content,
    coverImage: post?.coverImage,
    status: post?.status,
    allowComments: post?.allowComments,
    featured: post?.featured,
    tags: post?.tags,
    readingMinutes: post?.readingMinutes,
    publishedAt: post?.publishedAt,
    category: post?.category,
    author: post?.author,
    comments: shapedComments,
    commentCount,
    availableLanguages,
    translations: normalizedTranslations,
    activeLanguage,
    aiSummary: summary
  };
}

function normaliseRangeDays(value: string | undefined, fallback = 30) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 180);
}


@Controller('blog')
export class PublicBlogController {
  constructor(private prisma: PrismaService) {}

  @Get('posts')
  async list(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: string,
    @Query('lang') language?: string
  ) {
    const takeNumber = Math.min(Math.max(Number(take) || 12, 1), 50);
    const skipNumber = Math.max(Number(skip) || 0, 0);
    const normalizedLanguage = typeof language === 'string' ? language.trim().toLowerCase() : '';

    const where: any = { status: BlogStatus.PUBLISHED };
    if (category) {
      const parsedId = Number(category);
      if (!Number.isNaN(parsedId)) {
        where.categoryId = parsedId;
      } else {
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
        ...(featured === 'true' || featured === 'false' ? [] : [{ featured: 'desc' as const }]),
        { publishedAt: 'desc' }
      ],
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
        comments: {
          where: { status: BlogCommentStatus.APPROVED },
          select: { id: true }
        },
        translations: { orderBy: { language: 'asc' } }
      },
      skip: skipNumber,
      take: takeNumber
    });

    const items = posts.map((post) => {
      const shaped = transformPublicPostForResponse(post, normalizedLanguage);
      return {
        id: shaped.id,
        title: shaped.title,
        slug: shaped.slug,
        excerpt: shaped.excerpt,
        summary: shaped.summary,
        coverImage: shaped.coverImage,
        status: shaped.status,
        allowComments: shaped.allowComments,
        featured: shaped.featured,
        tags: shaped.tags,
        readingMinutes: shaped.readingMinutes,
        publishedAt: shaped.publishedAt,
        category: shaped.category,
        author: shaped.author,
        commentCount: shaped.commentCount,
        availableLanguages: shaped.availableLanguages
      };
    });

    return { items, language: normalizedLanguage || undefined };
  }

  @Get('posts/:slug')
  async detail(@Param('slug') slug: string, @Query('lang') language?: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: BlogStatus.PUBLISHED },
      include: {
        category: true,
        author: { select: { id: true, name: true, email: true } },
        comments: {
          where: { status: BlogCommentStatus.APPROVED },
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true, email: true } } }
        },
        translations: { orderBy: { language: 'asc' } }
      }
    });

    if (!post) throw new NotFoundException('Post not found');

    return {
      post: transformPublicPostForResponse(post, language)
    };
  }


  @Post('posts/:slug/view')
  async recordView(
    @Param('slug') slug: string,
    @Req() req: any,
    @Body() body: { durationSeconds?: number; source?: string; fingerprint?: string }
  ) {
    if (!slug) throw new BadRequestException('Invalid post reference');

    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: BlogStatus.PUBLISHED },
      select: { id: true }
    });
    if (!post) throw new NotFoundException('Post not found');

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
      let metricId: string;

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
      } else {
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
        } else {
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

  @Get('posts/:slug/metrics')
  async postMetrics(
    @Param('slug') slug: string,
    @Query('days') days?: string
  ) {
    if (!slug) throw new BadRequestException('Invalid post reference');

    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: BlogStatus.PUBLISHED },
      select: { id: true, title: true, slug: true }
    });
    if (!post) throw new NotFoundException('Post not found');

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

  @UseGuards(JwtAccessGuard)
  @Post('posts/:slug/comments')
  async comment(
    @Param('slug') slug: string,
    @Req() req: any,
    @Body() body: { content: string }
  ) {
    if (!body?.content?.trim()) throw new BadRequestException('Comment cannot be empty');

    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: BlogStatus.PUBLISHED },
      select: { id: true, allowComments: true }
    });
    if (!post) throw new NotFoundException('Post not found');
    if (!post.allowComments) throw new BadRequestException('Comments are disabled for this post');

    const trimmedContent = body.content.trim();
    const analysis = analyzeCommentContent(trimmedContent);

    const comment = await this.prisma.blogComment.create({
      data: {
        postId: post.id,
        content: trimmedContent,
        status: BlogCommentStatus.PENDING,
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
}


