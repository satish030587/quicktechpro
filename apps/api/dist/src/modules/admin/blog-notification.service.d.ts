import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../auth/mail.service';
export declare class BlogNotificationService {
    private prisma;
    private mail;
    private readonly logger;
    constructor(prisma: PrismaService, mail: MailService);
    private logEmail;
    notifyPostPublished(postId: string): Promise<void>;
    sendSubscriptionTest(subscriber: {
        id: string;
        email: string;
        name?: string | null;
    }): Promise<void>;
    notifyCommentApproved(commentId: string): Promise<void>;
}
