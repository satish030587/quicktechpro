import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
export declare class EventsGateway implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    server: Server;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    private getClientUser;
    private isPrivileged;
    private deny;
    handlePing(client: Socket, data: any): void;
    handleClientTicketCreated(client: Socket, ticket: any): Promise<void>;
    handleTestNotification(client: Socket, data: any): void;
    handleJoinTicket(client: Socket, data: {
        ticketId: string;
    }): Promise<void>;
    handleLeaveTicket(client: Socket, data: {
        ticketId: string;
    }): void;
    handleJoinAdmin(client: Socket): void;
    handleLeaveAdmin(client: Socket): void;
    handleJoinUser(client: Socket, data: {
        userId: string;
    }): void;
    handleLeaveUser(client: Socket, data: {
        userId: string;
    }): void;
    emitTicketMessage(ticketId: string, message: any): void;
    emitTicketUpdate(ticketId: string, payload?: any): void;
    emitTicketSession(ticketId: string, payload?: any): void;
    emitTicketCreated(ticket: {
        id: string;
        customerId?: string | null;
    } | string): void;
    emitTicketDeleted(ticketId: string, payload?: any): void;
    emitAppointmentUpsert(appointment: any): void;
    emitNotification(notification: {
        userId?: string | null;
    }): void;
}
