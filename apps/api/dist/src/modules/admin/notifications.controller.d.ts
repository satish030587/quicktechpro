import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../realtime/events.gateway';
export declare class AdminNotificationsController {
    private prisma;
    private realtime;
    constructor(prisma: PrismaService, realtime: EventsGateway);
    list(read?: string, type?: string): Promise<{
        items: {
            id: string;
            userId: string | null;
            type: string;
            message: string;
            read: boolean;
            createdAt: Date;
        }[];
    }>;
    markRead(id: string): Promise<{
        ok: boolean;
    }>;
    broadcast(body: {
        type: string;
        message: string;
    }): Promise<{
        ok: boolean;
    }>;
}
