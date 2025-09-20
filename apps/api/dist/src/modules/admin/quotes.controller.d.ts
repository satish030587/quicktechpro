import { PrismaService } from '../../prisma/prisma.service';
export declare class QuotesAdminController {
    private prisma;
    constructor(prisma: PrismaService);
    list(status?: string, customerEmail?: string, q?: string): Promise<{
        items: ({
            customer: {
                id: string;
                email: string;
                emailVerified: Date | null;
                phone: string | null;
                name: string | null;
                passwordHash: string;
                isActive: boolean;
                marketingEmailOptIn: boolean;
                marketingSmsOptIn: boolean;
                privacyAcceptedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
            items: {
                id: string;
                quoteId: string;
                name: string;
                qty: number;
                price: import("@prisma/client/runtime/library").Decimal;
                total: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            id: string;
            customerId: string;
            title: string;
            status: import(".prisma/client").$Enums.QuoteStatus;
            total: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    get(id: string): import(".prisma/client").Prisma.Prisma__QuoteClient<({
        customer: {
            id: string;
            email: string;
            emailVerified: Date | null;
            phone: string | null;
            name: string | null;
            passwordHash: string;
            isActive: boolean;
            marketingEmailOptIn: boolean;
            marketingSmsOptIn: boolean;
            privacyAcceptedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        items: {
            id: string;
            quoteId: string;
            name: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        customerId: string;
        title: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    upsert(req: any, body: {
        id?: string;
        customerId?: string;
        customerEmail?: string;
        title: string;
        status?: string;
        items?: {
            id?: string;
            name: string;
            qty: number;
            price: string;
        }[];
    }): Promise<({
        customer: {
            id: string;
            email: string;
            emailVerified: Date | null;
            phone: string | null;
            name: string | null;
            passwordHash: string;
            isActive: boolean;
            marketingEmailOptIn: boolean;
            marketingSmsOptIn: boolean;
            privacyAcceptedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        items: {
            id: string;
            quoteId: string;
            name: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        customerId: string;
        title: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    setStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        customerId: string;
        title: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }>;
    recalc(id: string): Promise<{
        id: string;
        customerId: string;
        title: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        total: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
    }>;
    convert(id: string): Promise<{
        items: {
            id: string;
            invoiceId: string;
            name: string;
            qty: number;
            price: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        number: string;
        customerId: string;
        status: import(".prisma/client").$Enums.InvoiceStatus;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        total: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
