import { PrismaService } from '../../prisma/prisma.service';
export declare class PublicBlogController {
    private prisma;
    constructor(prisma: PrismaService);
    list(take?: string, skip?: string, category?: string, search?: string, featured?: string): Promise<{
        items: {
            id: string;
            title: string;
            slug: string;
            excerpt: string | null;
            coverImage: string | null;
            status: import(".prisma/client").$Enums.BlogStatus;
            allowComments: boolean;
            featured: boolean;
            tags: string[];
            readingMinutes: number | null;
            publishedAt: Date | null;
            category: {
                id: number;
                name: string;
            } | null;
            author: {
                name: string | null;
                id: string;
                email: string;
            };
            commentCount: number;
        }[];
    }>;
    detail(slug: string): Promise<{
        post: {
            commentCount: number;
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
        };
    }>;
    recordView(slug: string, req: any, body: {
        durationSeconds?: number;
        source?: string;
        fingerprint?: string;
    }): Promise<{
        success: boolean;
        metrics: {
            views: number;
            uniqueVisitors: number;
            avgReadSeconds: number;
            sources: Record<string, number>;
        };
    }>;
    postMetrics(slug: string, days?: string): Promise<{
        post: {
            id: string;
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
    comment(slug: string, req: any, body: {
        content: string;
    }): Promise<{
        comment: {
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
        };
        message: string;
    }>;
}
