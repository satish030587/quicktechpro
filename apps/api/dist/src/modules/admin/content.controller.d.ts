import { PrismaService } from '../../prisma/prisma.service';
import { BlogCommentStatus, BlogStatus, Prisma } from '@prisma/client';
import { BlogNotificationService } from './blog-notification.service';
export declare class ContentController {
    private prisma;
    private blogNotifications;
    constructor(prisma: PrismaService, blogNotifications: BlogNotificationService);
    private slugify;
    private estimateReadingMinutes;
    private generateSummary;
    private ensureUniqueSlug;
    private basePostInclude;
    posts(status?: string, search?: string, featured?: string): Promise<{
        items: ({
            author: {
                name: string | null;
                id: string;
                email: string;
            };
            category: {
                id: number;
                name: string;
            } | null;
            _count: {
                comments: number;
            };
        } & {
            id: string;
            title: string;
            slug: string;
            excerpt: string | null;
            aiSummary: string | null;
            content: string;
            coverImage: string | null;
            status: import(".prisma/client").$Enums.BlogStatus;
            allowComments: boolean;
            featured: boolean;
            tags: string[];
            readingMinutes: number | null;
            authorId: string;
            categoryId: number | null;
            publishedAt: Date | null;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    post(id: string): Promise<{
        author: {
            name: string | null;
            id: string;
            email: string;
        };
        category: {
            id: number;
            name: string;
        } | null;
        comments: ({
            author: {
                name: string | null;
                id: string;
                email: string;
            } | null;
        } & {
            id: string;
            postId: string;
            authorId: string | null;
            authorName: string | null;
            authorEmail: string | null;
            content: string;
            status: import(".prisma/client").$Enums.BlogCommentStatus;
            languageCode: string | null;
            toxicityScore: number | null;
            spamScore: number | null;
            autoFlagged: boolean;
            moderationTags: string[];
            analyzedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        _count: {
            comments: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        aiSummary: string | null;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        allowComments: boolean;
        featured: boolean;
        tags: string[];
        readingMinutes: number | null;
        authorId: string;
        categoryId: number | null;
        publishedAt: Date | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createPost(req: any, body: {
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
    }): Promise<{
        author: {
            name: string | null;
            id: string;
            email: string;
        };
        category: {
            id: number;
            name: string;
        } | null;
        _count: {
            comments: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        aiSummary: string | null;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        allowComments: boolean;
        featured: boolean;
        tags: string[];
        readingMinutes: number | null;
        authorId: string;
        categoryId: number | null;
        publishedAt: Date | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePost(id: string, body: {
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
    }): Promise<{
        author: {
            name: string | null;
            id: string;
            email: string;
        };
        category: {
            id: number;
            name: string;
        } | null;
        _count: {
            comments: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        aiSummary: string | null;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        allowComments: boolean;
        featured: boolean;
        tags: string[];
        readingMinutes: number | null;
        authorId: string;
        categoryId: number | null;
        publishedAt: Date | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    postStatus(id: string, body: {
        status: BlogStatus;
    }): Promise<{
        author: {
            name: string | null;
            id: string;
            email: string;
        };
        category: {
            id: number;
            name: string;
        } | null;
        _count: {
            comments: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        aiSummary: string | null;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        allowComments: boolean;
        featured: boolean;
        tags: string[];
        readingMinutes: number | null;
        authorId: string;
        categoryId: number | null;
        publishedAt: Date | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    regenerateSummary(id: string): Promise<{
        author: {
            name: string | null;
            id: string;
            email: string;
        };
        category: {
            id: number;
            name: string;
        } | null;
        _count: {
            comments: number;
        };
    } & {
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        aiSummary: string | null;
        content: string;
        coverImage: string | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        allowComments: boolean;
        featured: boolean;
        tags: string[];
        readingMinutes: number | null;
        authorId: string;
        categoryId: number | null;
        publishedAt: Date | null;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePost(id: string): Promise<{
        success: boolean;
    }>;
    analyticsOverview(days?: string): Promise<{
        rangeDays: number;
        totalPostsTracked: number;
        summary: {
            totalViews: number;
            uniqueVisitors: number;
            avgReadSeconds: number;
            averageViewsPerPost: number;
            sources: {
                source: string;
                count: number;
            }[];
        };
        topPosts: {
            postId: string;
            title: string | null;
            slug: string;
            status: import(".prisma/client").$Enums.BlogStatus;
            viewCount: number;
            uniqueVisitors: number;
            avgReadSeconds: number;
            lastActivityAt: string;
        }[];
        trend: {
            date: string;
            viewCount: number;
            uniqueVisitors: number;
        }[];
    }>;
    adminPostMetrics(id: string, days?: string): Promise<{
        post: {
            id: string;
            status: import(".prisma/client").$Enums.BlogStatus;
            title: string;
            slug: string;
        };
        rangeDays: number;
        totals: {
            views: number;
            uniqueVisitors: number;
            avgReadSeconds: number;
            sources: Record<string, number>;
        };
        trend: {
            date: string;
            viewCount: number;
            uniqueVisitors: number;
            avgReadSeconds: number;
        }[];
    }>;
    subscribers(status?: string, search?: string): Promise<{
        items: {
            id: string;
            email: string;
            name: string | null;
            verified: boolean;
            token: string;
            unsubscribed: boolean;
            unsubscribedAt: Date | null;
            preferences: Prisma.JsonValue;
            lastNotifiedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    updateSubscriber(id: string, body: {
        name?: string | null;
        unsubscribed?: boolean;
        verified?: boolean;
    }): Promise<{
        id: string;
        email: string;
        name: string | null;
        verified: boolean;
        token: string;
        unsubscribed: boolean;
        unsubscribedAt: Date | null;
        preferences: Prisma.JsonValue;
        lastNotifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteSubscriber(id: string): Promise<{
        success: boolean;
    }>;
    testSubscriber(id: string): Promise<{
        queued: boolean;
    }>;
    categories(): Promise<{
        items: ({
            _count: {
                posts: number;
            };
        } & {
            id: number;
            name: string;
        })[];
    }>;
    createCategory(body: {
        name: string;
    }): Promise<{
        id: number;
        name: string;
    }>;
    comments(status?: string, postId?: string): Promise<{
        items: ({
            author: {
                name: string | null;
                id: string;
                email: string;
            } | null;
            post: {
                id: string;
                title: string;
                slug: string;
            };
        } & {
            id: string;
            postId: string;
            authorId: string | null;
            authorName: string | null;
            authorEmail: string | null;
            content: string;
            status: import(".prisma/client").$Enums.BlogCommentStatus;
            languageCode: string | null;
            toxicityScore: number | null;
            spamScore: number | null;
            autoFlagged: boolean;
            moderationTags: string[];
            analyzedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    updateCommentStatus(id: string, body: {
        status: BlogCommentStatus;
    }): Promise<{
        id: string;
        postId: string;
        authorId: string | null;
        authorName: string | null;
        authorEmail: string | null;
        content: string;
        status: import(".prisma/client").$Enums.BlogCommentStatus;
        languageCode: string | null;
        toxicityScore: number | null;
        spamScore: number | null;
        autoFlagged: boolean;
        moderationTags: string[];
        analyzedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteComment(id: string): Promise<{
        success: boolean;
    }>;
    testimonials(approved?: string): Promise<{
        items: {
            id: string;
            author: string;
            content: string;
            rating: number;
            service: string | null;
            area: string | null;
            approved: boolean;
            createdAt: Date;
        }[];
    }>;
    testimonialApprove(id: string, body: {
        approved: boolean;
    }): Promise<{
        id: string;
        author: string;
        content: string;
        rating: number;
        service: string | null;
        area: string | null;
        approved: boolean;
        createdAt: Date;
    }>;
}
