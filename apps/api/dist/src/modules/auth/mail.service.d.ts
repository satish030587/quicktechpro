export declare class MailService {
    sendVerificationEmail(_email: string, _link: string): Promise<{
        queued: boolean;
    }>;
    sendPasswordResetEmail(_email: string, _link: string): Promise<{
        queued: boolean;
    }>;
    sendBlogNewPostEmail(_email: string, _payload: {
        subject: string;
        previewText?: string;
        link: string;
        subscriberName?: string;
    }): Promise<{
        queued: boolean;
    }>;
    sendCommentApprovedEmail(_email: string, _payload: {
        postTitle: string;
        link: string;
        recipientName?: string;
        commentSnippet?: string;
    }): Promise<{
        queued: boolean;
    }>;
    sendBlogSubscriptionWelcome(_email: string, _payload: {
        link: string;
        subscriberName?: string;
    }): Promise<{
        queued: boolean;
    }>;
}
