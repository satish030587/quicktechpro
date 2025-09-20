import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminCustomersController {
    private prisma;
    constructor(prisma: PrismaService);
    list(q?: string, take?: string): Promise<{
        items: {
            name: string | null;
            phone: string | null;
            id: string;
            createdAt: Date;
            email: string;
            isActive: boolean;
            _count: {
                ticketsAsCustomer: number;
                invoices: number;
                quotes: number;
            };
        }[];
    }>;
    detail(id: string): Promise<{
        user: {
            name: string | null;
            phone: string | null;
            id: string;
            createdAt: Date;
            email: string;
            isActive: boolean;
        };
        tickets: {
            id: string;
            code: string;
            type: import(".prisma/client").$Enums.TicketType;
            status: import(".prisma/client").$Enums.TicketStatus;
            billingStatus: import(".prisma/client").$Enums.BillingStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            description: string;
            customerId: string;
            assignedToId: string | null;
            invoiceId: string | null;
            paymentId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        invoices: {
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
        }[];
        quotes: {
            id: string;
            customerId: string;
            title: string;
            status: import(".prisma/client").$Enums.QuoteStatus;
            total: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        }[];
        payments: {
            id: string;
            invoiceId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            provider: string | null;
            providerTxnId: string | null;
            providerOrderId: string | null;
            metadata: import(".prisma/client").Prisma.JsonValue;
            createdTicketId: string | null;
            createdAt: Date;
        }[];
    } | null>;
    update(id: string, body: {
        name?: string;
        phone?: string;
        isActive?: boolean;
    }): Promise<{
        user: {
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
    }>;
    tickets(id: string, skip?: string, take?: string): Promise<{
        items: {
            id: string;
            code: string;
            type: import(".prisma/client").$Enums.TicketType;
            status: import(".prisma/client").$Enums.TicketStatus;
            billingStatus: import(".prisma/client").$Enums.BillingStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            description: string;
            customerId: string;
            assignedToId: string | null;
            invoiceId: string | null;
            paymentId: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    invoices(id: string, skip?: string, take?: string): Promise<{
        items: {
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
        }[];
        total: number;
    }>;
    quotes(id: string, skip?: string, take?: string): Promise<{
        items: {
            id: string;
            customerId: string;
            title: string;
            status: import(".prisma/client").$Enums.QuoteStatus;
            total: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    payments(id: string, skip?: string, take?: string): Promise<{
        items: ({
            invoice: {
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
            };
        } & {
            id: string;
            invoiceId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            method: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            provider: string | null;
            providerTxnId: string | null;
            providerOrderId: string | null;
            metadata: import(".prisma/client").Prisma.JsonValue;
            createdTicketId: string | null;
            createdAt: Date;
        })[];
        total: number;
    }>;
}
