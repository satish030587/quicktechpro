import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../realtime/events.gateway';
export declare class TicketsController {
    private prisma;
    private realtime;
    constructor(prisma: PrismaService, realtime: EventsGateway);
    list(status?: string, type?: string, priority?: string, assignedToId?: string, customerEmail?: string, q?: string, billingStatus?: string, skip?: string, take?: string): Promise<{
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
        total: number;
    }>;
    create(body: {
        type: string;
        priority?: string;
        title: string;
        description: string;
        customerId: string;
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
    get(id: string): import(".prisma/client").Prisma.Prisma__TicketClient<({
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
        audits: {
            id: string;
            ticketId: string;
            actorId: string | null;
            action: string;
            details: import(".prisma/client").Prisma.JsonValue;
            createdAt: Date;
        }[];
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
        } | null;
        payment: {
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
        } | null;
        remoteSessions: {
            id: string;
            ticketId: string;
            tool: string;
            joinLink: string | null;
            code: string | null;
            technicianId: string | null;
            startedAt: Date;
            endedAt: Date | null;
            notes: string | null;
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: any): Promise<{
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
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    addMessage(id: string, body: {
        senderId: string;
        content: string;
        internal?: boolean;
    }): Promise<{
        id: string;
        ticketId: string;
        senderId: string;
        internal: boolean;
        content: string;
        createdAt: Date;
    }>;
    addNote(id: string, body: {
        senderId: string;
        content: string;
    }): Promise<{
        id: string;
        ticketId: string;
        senderId: string;
        internal: boolean;
        content: string;
        createdAt: Date;
    }>;
    startSession(id: string, body: {
        tool: string;
        joinLink?: string;
        code?: string;
        technicianId: string;
    }): Promise<{
        id: string;
        ticketId: string;
        tool: string;
        joinLink: string | null;
        code: string | null;
        technicianId: string | null;
        startedAt: Date;
        endedAt: Date | null;
        notes: string | null;
    }>;
    endSession(id: string, body: {
        sessionId: string;
        notes?: string;
        technicianId: string;
    }): Promise<{
        id: string;
        ticketId: string;
        tool: string;
        joinLink: string | null;
        code: string | null;
        technicianId: string | null;
        startedAt: Date;
        endedAt: Date | null;
        notes: string | null;
    }>;
    private generateTicketCode;
}
