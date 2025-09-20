import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../auth/mail.service';
export declare class BlogSubscriptionController {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
    private normaliseEmail;
    private generateToken;
    recordWelcomeEmail(email: string, subscriberId: string): Promise<void>;
    subscribe(body: {
        email: string;
        name?: string;
    }): Promise<{
        success: boolean;
        subscriber: {
            id: string;
            email: string;
            name: string | null;
            verified: boolean;
            unsubscribed: boolean;
        };
    }>;
    unsubscribe(body: {
        token: string;
    }): Promise<{
        success: boolean;
    }>;
}
