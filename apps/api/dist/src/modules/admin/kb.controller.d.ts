import { PrismaService } from '../../prisma/prisma.service';
export declare class KBAdminController {
    private prisma;
    constructor(prisma: PrismaService);
    categories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
    }[]>;
    upsertCategory(body: {
        id?: number;
        name: string;
    }): import(".prisma/client").Prisma.Prisma__KBCategoryClient<{
        id: number;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    articles(status?: string, categoryId?: string, q?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        slug: string;
        content: string;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    upsertArticle(body: any): import(".prisma/client").Prisma.Prisma__KnowledgeBaseArticleClient<{
        id: string;
        title: string;
        slug: string;
        content: string;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    setStatus(id: string, body: {
        status: string;
    }): import(".prisma/client").Prisma.Prisma__KnowledgeBaseArticleClient<{
        id: string;
        title: string;
        slug: string;
        content: string;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
