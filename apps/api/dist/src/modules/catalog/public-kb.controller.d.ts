import { PrismaService } from '../../prisma/prisma.service';
export declare class PublicKBController {
    private prisma;
    constructor(prisma: PrismaService);
    list(categoryId?: string, q?: string, skip?: string, take?: string): Promise<{
        items: {
            id: string;
            title: string;
            slug: string;
            content: string;
            categoryId: number | null;
            status: import(".prisma/client").$Enums.BlogStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        categories: {
            id: number;
            name: string;
        }[];
    }>;
    detail(slug: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string;
        categoryId: number | null;
        status: import(".prisma/client").$Enums.BlogStatus;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
