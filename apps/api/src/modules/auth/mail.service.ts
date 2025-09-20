import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendVerificationEmail(_email: string, _link: string) {
    // TODO: integrate provider (SendGrid/etc)
    return { queued: true };
  }
  async sendPasswordResetEmail(_email: string, _link: string) {
    return { queued: true };
  }
  async sendBlogNewPostEmail(_email: string, _payload: { subject: string; previewText?: string; link: string; subscriberName?: string }) {
    return { queued: true };
  }
  async sendCommentApprovedEmail(_email: string, _payload: { postTitle: string; link: string; recipientName?: string; commentSnippet?: string }) {
    return { queued: true };
  }
  async sendCommentReplyEmail(_email: string, _payload: { postTitle: string; link: string; recipientName?: string; responderName?: string; replyContent: string; originalSnippet?: string }) {
    return { queued: true };
  }
  async sendBlogSubscriptionWelcome(_email: string, _payload: { link: string; subscriberName?: string }) {
    return { queued: true };
  }
}

