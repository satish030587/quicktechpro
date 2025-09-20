import { PrismaService } from '../../prisma/prisma.service';
export declare class ServicesAdminController {
    private prisma;
    constructor(prisma: PrismaService);
    catalog(): Promise<({
        services: ({
            prices: {
                id: string;
                serviceId: string;
                label: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                currency: string;
                active: boolean;
                createdAt: Date;
                features: import(".prisma/client").Prisma.JsonValue;
                compareAt: import("@prisma/client/runtime/library").Decimal | null;
                badge: string | null;
            }[];
        } & {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            longDescription: string | null;
            heroImage: string | null;
            seoTitle: string | null;
            seoDescription: string | null;
            isRemote: boolean;
            isOnsite: boolean;
            isWeb: boolean;
            payFirst: boolean;
            requiresLogin: boolean;
            allowUnpaidForB2B: boolean;
            appointmentRequired: boolean;
            quoteRequired: boolean;
            defaultDurationMins: number | null;
            cityConstraint: string | null;
            areaCoverage: import(".prisma/client").Prisma.JsonValue;
            activeFrom: Date | null;
            activeTo: Date | null;
            active: boolean;
            sortOrder: number;
            categoryId: number | null;
        })[];
    } & {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        sortOrder: number;
        active: boolean;
    })[]>;
    upsertCategory(body: any): Promise<{
        id: number;
        name: string;
        slug: string;
        description: string | null;
        sortOrder: number;
        active: boolean;
    }>;
    upsertService(body: any): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        longDescription: string | null;
        heroImage: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        isRemote: boolean;
        isOnsite: boolean;
        isWeb: boolean;
        payFirst: boolean;
        requiresLogin: boolean;
        allowUnpaidForB2B: boolean;
        appointmentRequired: boolean;
        quoteRequired: boolean;
        defaultDurationMins: number | null;
        cityConstraint: string | null;
        areaCoverage: import(".prisma/client").Prisma.JsonValue;
        activeFrom: Date | null;
        activeTo: Date | null;
        active: boolean;
        sortOrder: number;
        categoryId: number | null;
    }>;
    upsertPrice(body: any): Promise<{
        id: string;
        serviceId: string;
        label: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        active: boolean;
        createdAt: Date;
        features: import(".prisma/client").Prisma.JsonValue;
        compareAt: import("@prisma/client/runtime/library").Decimal | null;
        badge: string | null;
    }>;
    reorder(body: {
        categories?: {
            id: number;
            sortOrder: number;
        }[];
        services?: {
            id: string;
            sortOrder: number;
        }[];
    }): Promise<{
        ok: boolean;
    }>;
}
