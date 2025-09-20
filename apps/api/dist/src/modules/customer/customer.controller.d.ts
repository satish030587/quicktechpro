import { EventsGateway } from '../../realtime/events.gateway';
import { PrismaService } from '../../prisma/prisma.service';
export declare class CustomerController {
    private prisma;
    private realtime;
    constructor(prisma: PrismaService, realtime: EventsGateway);
    dashboard(req: any): Promise<{
        openTickets: number;
        pendingQuotes: number;
        dueInvoices: number;
        nextAppointment: {
            id: string;
            ticketId: string;
            scheduledAt: Date;
            durationMins: number;
            address: string | null;
            notes: string | null;
            technicianId: string | null;
            status: import(".prisma/client").$Enums.AppointmentStatus;
        } | null;
    }>;
    tickets(req: any, status?: string): Promise<{
        items: ({
            assignedTo: {
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
            } | null;
        } & {
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
        })[];
    }>;
    createTicket(req: any, body: {
        type: string;
        priority?: string;
        title: string;
        description: string;
    }): Promise<{
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
    }>;
    ticket(req: any, id: string): Promise<({
        assignedTo: {
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
        } | null;
        messages: ({
            sender: {
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
        } & {
            id: string;
            ticketId: string;
            senderId: string;
            internal: boolean;
            content: string;
            createdAt: Date;
        })[];
        attachments: {
            id: string;
            ticketId: string;
            url: string;
            filename: string;
            createdAt: Date;
        }[];
    } & {
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
    }) | null>;
    ticketMessage(req: any, id: string, body: {
        content: string;
    }): Promise<any>;
    quotes(req: any, skip?: string, take?: string): Promise<{
        items: ({
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
        total: number;
    }>;
    quoteDetail(req: any, id: string): Promise<({
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
    acceptQuote(req: any, id: string): Promise<any>;
    rejectQuote(req: any, id: string): Promise<any>;
    invoices(req: any): Promise<{
        items: ({
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
    payments(req: any): Promise<{
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
    appointments(req: any): Promise<{
        items: ({
            ticket: {
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
            };
        } & {
            id: string;
            ticketId: string;
            scheduledAt: Date;
            durationMins: number;
            address: string | null;
            notes: string | null;
            technicianId: string | null;
            status: import(".prisma/client").$Enums.AppointmentStatus;
        })[];
    }>;
    requestAppointment(req: any, body: {
        ticketId: string;
        scheduledAt: string;
        address?: string;
        notes?: string;
    }): Promise<{
        ticket: {
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
        } & {
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
        };
        technician: {
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
        } | null;
    } & {
        id: string;
        ticketId: string;
        scheduledAt: Date;
        durationMins: number;
        address: string | null;
        notes: string | null;
        technicianId: string | null;
        status: import(".prisma/client").$Enums.AppointmentStatus;
    }>;
    profile(req: any): Promise<{
        email: string | undefined;
        name: string | null | undefined;
        phone: string | null | undefined;
        marketingEmailOptIn: boolean | undefined;
        marketingSmsOptIn: boolean | undefined;
    }>;
    updateProfile(req: any, body: {
        name?: string;
        phone?: string;
        marketingEmailOptIn?: boolean;
        marketingSmsOptIn?: boolean;
    }): Promise<{
        ok: boolean;
    }>;
    notifications(req: any, skip?: string, take?: string, read?: string): Promise<{
        items: {
            id: string;
            userId: string | null;
            type: string;
            message: string;
            read: boolean;
            createdAt: Date;
        }[];
        total: number;
        unreadCount: number;
    }>;
    markRead(req: any, id: string): Promise<any>;
    markAllRead(req: any): Promise<{
        ok: boolean;
    }>;
    private generateTicketCode;
}
