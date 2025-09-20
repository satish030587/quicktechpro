import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BlogCommentStatus, BlogStatus, Prisma } from '@prisma/client';
import { BlogNotificationService } from './blog-notification.service';

const ADMIN_ANALYTICS_DAY_MS = 24 * 60 * 60 * 1000;

function startOfDayUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function clampAnalyticsRangeDays(value: string | undefined, fallback = 30) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 365);
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

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'content_moderator')
@Controller('admin/content')
export class ContentController {
  constructor(private prisma: PrismaService, private blogNotifications: BlogNotificationService) {}

  private slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private estimateReadingMinutes(content: string | undefined, fallback?: number | null) {
    if (!content) return fallback ?? null;
    const words = content.split(/\s+/).filter(Boolean).length;
    if (!words) return fallback ?? null;
    return Math.max(1, Math.round(words / 200));
  }

  private generateSummary(content: string | null | undefined) {
    if (!content) return null;
    const plain = content.replace(/\s+/g, ' ').trim();
    if (!plain) return null;
    const sentences = plain.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length === 0) return plain.slice(0, 280);
    let summary = sentences.slice(0, 2).join(' ');
    if (summary.length < 160 && sentences.length > 2) {
      summary = sentences.slice(0, 3).join(' ');
    }
    if (summary.length > 380) {
      summary = `${summary.slice(0, 377).trimEnd()}...`;
    }
    return summary;
  }

  private normaliseTranslations(input: any) {
    if (!Array.isArray(input)) return [];
    const seen = new Set<string>();
    const items: Array<{ language: string; title: string; excerpt: string | null; content: string; aiSummary: string | null }> = [];
    input.forEach((entry) => {
      if (!entry) return;
      const language = typeof entry.language === 'string' ? entry.language.trim().toLowerCase() : '';
      const title = typeof entry.title === 'string' ? entry.title.trim() : '';
      const content = typeof entry.content === 'string' ? entry.content.trim() : '';
      const excerpt = typeof entry.excerpt === 'string' ? entry.excerpt.trim() : '';
      const aiSummaryInput = typeof entry.aiSummary === 'string' ? entry.aiSummary.trim() : '';
      if (!language || !title || !content) return;
      if (seen.has(language)) return;
      seen.add(language);
      const aiSummary = aiSummaryInput || this.generateSummary(content);
      items.push({
        language,
        title,
        content,
        excerpt: excerpt || null,
        aiSummary: aiSummary || null
      });
    });
    return items;
  }

  private async ensureUniqueSlug(baseSlug: string, excludeId?: string) {
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
      if (!existing) return slug;
      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }
  }

  private basePostInclude = {
    category: true,
    author: { select: { id: true, name: true, email: true } },
    _count: { select: { comments: true } }
  } as const;

  private postDetailInclude = {
    ...this.basePostInclude,
    comments: {
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true, email: true } } }
    },
    translations: { orderBy: { language: 'asc' } }
  } as const;

  @Get('posts')
  async posts(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('featured') featured?: string
  ) {
    const where: any = {};
    if (status) {
      const normalized = status.split(',').map((value) => value.toUpperCase()) as BlogStatus[];
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
      include: {
        ...this.basePostInclude,
        translations: { orderBy: { language: 'asc' } }
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    });

    return { items: items.map((post) => ({
      ...post,
      availableLanguages: Array.isArray(post.translations) ? post.translations.map((translation) => translation.language) : []
    })) };
  }

  @Get('posts/:id')
  async post(@Param('id') id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: this.postDetailInclude
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  @Post('posts')
  async createPost(
    @Req() req: any,
    @Body()
    body: {
      title: string;
      slug?: string;
      excerpt?: string;
      content: string;
      coverImage?: string;
      status?: BlogStatus;
      allowComments?: boolean;
      featured?: boolean;
      tags?: string[] | string;
      readingMinutes?: number;
      categoryId?: number | null;
      publishedAt?: string | null;
      aiSummary?: string | null;
      authorId?: string | null;
      translations?: Array<{ language: string; title: string; excerpt?: string | null; content: string; aiSummary?: string | null }>;
    }
  ) {
    if (!body?.title?.trim()) throw new BadRequestException('Title is required');
    if (!body?.content?.trim()) throw new BadRequestException('Content is required');

    const requestAuthor = req?.user?.id ?? req?.user?.sub;
    const payloadAuthor = body?.authorId != null ? String(body.authorId).trim() : '';
    const authorId = requestAuthor ?? (payloadAuthor ? payloadAuthor : null);
    if (!authorId) throw new BadRequestException('Missing author context for blog post');

    const desiredSlug = body.slug?.trim() || this.slugify(body.title);
    if (!desiredSlug) throw new BadRequestException('Unable to derive slug from title');
    const slug = await this.ensureUniqueSlug(desiredSlug);

    const status = (body.status ?? BlogStatus.DRAFT) as BlogStatus;
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
      publishedAt:
        status === BlogStatus.PUBLISHED
          ? body.publishedAt
            ? new Date(body.publishedAt)
            : new Date()
          : null
    };

    const translations = this.normaliseTranslations(body.translations);

    const post = await this.prisma.$transaction(async (tx) => {
      const created = await tx.blogPost.create({
        data,
        include: this.basePostInclude
      });

      if (translations.length > 0) {
        await Promise.all(
          translations.map((translation) =>
            tx.blogPostTranslation.create({
              data: {
                postId: created.id,
                language: translation.language,
                title: translation.title,
                excerpt: translation.excerpt,
                content: translation.content,
                aiSummary: translation.aiSummary
              }
            })
          )
        );
      }

      if (created.status === BlogStatus.PUBLISHED) {
        await this.blogNotifications.notifyPostPublished(created.id);
      }

      return tx.blogPost.findUnique({
        where: { id: created.id },
        include: this.postDetailInclude
      });
    });

    return post;
  }

  @Patch('posts/:id')
  async updatePost(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      content?: string;
      coverImage?: string | null;
      status?: BlogStatus;
      allowComments?: boolean;
      featured?: boolean;
      tags?: string[] | string;
      readingMinutes?: number | null;
      categoryId?: number | null;
      publishedAt?: string | null;
      aiSummary?: string | null;
      translations?: Array<{ language: string; title: string; excerpt?: string | null; content: string; aiSummary?: string | null }>;
    }
  ) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id }, include: { translations: true } });
    if (!existing) throw new NotFoundException('Blog post not found');

    let slug = existing.slug;
    if (body.slug && body.slug !== existing.slug) {
      const normalized = this.slugify(body.slug);
      if (!normalized) throw new BadRequestException('Invalid slug');
      slug = await this.ensureUniqueSlug(normalized, existing.id);
    } else if (body.title && !body.slug) {
      // Regenerate slug only if it was auto-generated (matches title slug)
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
    const translationsProvided = body.translations !== undefined;
    const existingTranslations = existing.translations?.map((translation) => ({
      language: translation.language,
      title: translation.title,
      excerpt: translation.excerpt ?? undefined,
      content: translation.content,
      aiSummary: translation.aiSummary ?? undefined
    })) ?? [];
    const translations = this.normaliseTranslations(
      translationsProvided ? body.translations : existingTranslations
    );
    const tags = Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === 'string'
      ? body.tags.split(',').map((token) => token.trim()).filter(Boolean)
      : existing.tags;

    const publishedAt = (() => {
      if (status === BlogStatus.PUBLISHED) {
        if (existing.status !== BlogStatus.PUBLISHED) {
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

    const post = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.blogPost.update({
        where: { id },
        data,
        include: this.basePostInclude
      });

      if (translationsProvided) {
        const languagesToDelete = existingTranslations
          .map((translation) => translation.language)
          .filter((language) => !translations.some((item) => item.language === language));
        if (languagesToDelete.length > 0) {
          await tx.blogPostTranslation.deleteMany({
            where: { postId: id, language: { in: languagesToDelete } }
          });
        }
        await Promise.all(
          translations.map((translation) =>
            tx.blogPostTranslation.upsert({
              where: { postId_language: { postId: id, language: translation.language } },
              update: {
                title: translation.title,
                excerpt: translation.excerpt,
                content: translation.content,
                aiSummary: translation.aiSummary
              },
              create: {
                postId: id,
                language: translation.language,
                title: translation.title,
                excerpt: translation.excerpt,
                content: translation.content,
                aiSummary: translation.aiSummary
              }
            })
          )
        );
      }

      return tx.blogPost.findUnique({ where: { id }, include: this.postDetailInclude });
    });

    if (existing.status !== BlogStatus.PUBLISHED && post.status === BlogStatus.PUBLISHED) {
      await this.blogNotifications.notifyPostPublished(post.id);
    }

    return post;
  }

  @Patch('posts/:id/status')
  async postStatus(@Param('id') id: string, @Body() body: { status: BlogStatus }) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog post not found');

    const status = body.status as BlogStatus;
    const publishedAt = status === BlogStatus.PUBLISHED
      ? existing.publishedAt ?? new Date()
      : existing.publishedAt;

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: { status, publishedAt },
      include: this.basePostInclude
    });

    if (existing.status !== BlogStatus.PUBLISHED && post.status === BlogStatus.PUBLISHED) {
      await this.blogNotifications.notifyPostPublished(post.id);
    }

    return post;
  }

  @Post('posts/:id/summary')
  async regenerateSummary(@Param('id') id: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog post not found');

    const aiSummary = this.generateSummary(existing.content);
    const post = await this.prisma.blogPost.update({
      where: { id },
      data: { aiSummary },
      include: this.postDetailInclude
    });

    return post;
  }

  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog post not found');

    await this.prisma.blogComment.deleteMany({ where: { postId: id } });
    await this.prisma.blogPost.delete({ where: { id } });
    return { success: true };
  }

  @Get('analytics/overview')
  async analyticsOverview(@Query('days') days?: string) {
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
      sources: {} as Record<string, number>
    };

    const postMap = new Map<string, {
      postId: string;
      title: string | null;
      slug: string;
      status: BlogStatus;
      viewCount: number;
      uniqueVisitors: number;
      totalReadSeconds: number;
      lastActivityAt: Date;
    }>();
    const trendMap = new Map<string, { date: string; viewCount: number; uniqueVisitors: number }>();

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
        status: metric.post?.status ?? BlogStatus.DRAFT,
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

  @Get('posts/:id/metrics')
  async adminPostMetrics(
    @Param('id') id: string,
    @Query('days') days?: string
  ) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true, status: true }
    });
    if (!post) throw new NotFoundException('Blog post not found');

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

  @Get('subscribers')
  async subscribers(@Query('status') status?: string, @Query('search') search?: string) {
    const where: any = {};
    if (status === 'active') where.unsubscribed = false;
    if (status === 'unsubscribed') where.unsubscribed = true;
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

  @Patch('subscribers/:id')
  async updateSubscriber(@Param('id') id: string, @Body() body: { name?: string | null; unsubscribed?: boolean; verified?: boolean }) {
    const data: any = {};
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

  @Delete('subscribers/:id')
  async deleteSubscriber(@Param('id') id: string) {
    await this.prisma.blogSubscriber.delete({ where: { id } });
    return { success: true };
  }

  @Post('subscribers/:id/test')
  async testSubscriber(@Param('id') id: string) {
    const subscriber = await this.prisma.blogSubscriber.findUnique({ where: { id } });
    if (!subscriber) throw new NotFoundException('Subscriber not found');
    await this.blogNotifications.sendSubscriptionTest(subscriber);
    return { queued: true };
  }

  @Get('categories')
  async categories() {
    const items = await this.prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } }
    });
    return { items };
  }

  @Post('categories')
  async createCategory(@Body() body: { name: string }) {
    if (!body?.name?.trim()) throw new BadRequestException('Category name is required');
    return this.prisma.blogCategory.create({ data: { name: body.name.trim() } });
  }

  @Get('comments')
  async comments(@Query('status') status?: string, @Query('postId') postId?: string) {
    const where: Prisma.BlogCommentWhereInput = { parentId: null };

    if (status) {
      where.status = status as BlogCommentStatus;
    }

    if (postId) {
      where.postId = postId;
    }

    const items = await this.prisma.blogComment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        post: { select: { id: true, title: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true, email: true } }
          }
        }
      },
      take: 200
    });

    return { items };
  }

  @Patch('comments/:id/status')
  async updateCommentStatus(@Param('id') id: string, @Body() body: { status: BlogCommentStatus }) {
    const existing = await this.prisma.blogComment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Comment not found');

    const nextStatus = body.status as BlogCommentStatus;
    const data: any = { status: nextStatus };
    if (nextStatus === BlogCommentStatus.APPROVED) {
      data.autoFlagged = false;
    }

    const updated = await this.prisma.blogComment.update({
      where: { id },
      data
    });

    if (existing.status !== BlogCommentStatus.APPROVED && updated.status === BlogCommentStatus.APPROVED) {
      await this.blogNotifications.notifyCommentApproved(updated.id);
    }

    return updated;
  }

  @Delete('comments/:id')
  async deleteComment(@Param('id') id: string) {
    await this.prisma.blogComment.delete({ where: { id } });
    return { success: true };
  }

  @Post('comments/:id/replies')
  async replyToComment(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: { content: string; notifyAuthor?: boolean }
  ) {
    const parent = await this.prisma.blogComment.findUnique({
      where: { id },
      include: {
        post: { select: { id: true, slug: true, title: true, allowComments: true } }
      }
    });
    if (!parent) throw new NotFoundException('Comment not found');

    if (!parent.post?.allowComments) {
      throw new BadRequestException('Comments are disabled for this post');
    }

    const content = body?.content?.trim();
    if (!content) {
      throw new BadRequestException('Reply content is required');
    }

    const authorId = req?.user?.id ?? req?.user?.sub;
    if (!authorId) {
      throw new BadRequestException('Missing author context for reply');
    }

    const authorName =
      typeof req?.user?.name === 'string'
        ? req.user.name
        : typeof req?.user?.email === 'string'
        ? req.user.email
        : 'QuickTechPro Team';

    const authorEmail = typeof req?.user?.email === 'string' ? req.user.email : null;
    const notifyAuthor = body?.notifyAuthor !== false;

    const reply = await this.prisma.blogComment.create({
      data: {
        postId: parent.postId,
        parentId: parent.id,
        authorId,
        authorName,
        authorEmail,
        content,
        status: BlogCommentStatus.APPROVED,
        autoFlagged: false,
        languageCode: parent.languageCode ?? null
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        post: { select: { id: true, slug: true, title: true } }
      }
    });

    if (parent.status === BlogCommentStatus.PENDING) {
      await this.prisma.blogComment.update({
        where: { id: parent.id },
        data: { status: BlogCommentStatus.APPROVED, autoFlagged: false }
      });
    }

    if (notifyAuthor && parent.authorEmail) {
      await this.blogNotifications.notifyCommentReply(parent.id, reply.id);
    }

    return reply;
  }


  @Get('testimonials')
  async testimonials(@Query('approved') approved?: string) {
    const where: any = {};
    if (approved != null) where.approved = approved === 'true';
    const items = await this.prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return { items };
  }

  @Patch('testimonials/:id/approve')
  async testimonialApprove(@Param('id') id: string, @Body() body: { approved: boolean }) {
    return this.prisma.testimonial.update({ where: { id }, data: { approved: Boolean(body.approved) } });
  }
}
