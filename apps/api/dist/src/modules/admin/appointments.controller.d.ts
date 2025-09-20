import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../realtime/events.gateway';
export declare class AppointmentsController {
    private prisma;
    private realtime;
    constructor(prisma: PrismaService, realtime: EventsGateway);
    list(from?: string, to?: string, technicianId?: string, status?: string): Promise<{
        items: ({
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
        })[];
    }>;
    create(body: {
        ticketId: string;
        scheduledAt: string;
        durationMins?: number;
        address?: string;
        notes?: string;
        technicianId?: string;
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
    update(id: string, body: any): Promise<{
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
}
