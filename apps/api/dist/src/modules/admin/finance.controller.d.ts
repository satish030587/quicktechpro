import { PrismaService } from '../../prisma/prisma.service';
export declare class FinanceController {
    private prisma;
    constructor(prisma: PrismaService);
    invoices(status?: string): Promise<{
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
                invoiceId: string;
                name: string;
                qty: number;
                price: import("@prisma/client/runtime/library").Decimal;
                total: import("@prisma/client/runtime/library").Decimal;
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
        })[];
    }>;
    createInvoice(body: {
        customerId: string;
        items: {
            name: string;
            qty: number;
            price: string;
        }[];
        taxPct?: number;
    }): Promise<{
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
    invoiceStatus(id: string, body: {
        status: string;
    }): Promise<{
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
    payments(status?: string): Promise<{
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
    }>;
    reconcile(id: string, body: {
        status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
    }): Promise<{
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
    }>;
    private newInvoiceNumber;
}
