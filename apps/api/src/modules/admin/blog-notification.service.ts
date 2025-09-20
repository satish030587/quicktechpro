import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../auth/mail.service';
import { BlogCommentStatus, BlogStatus, Prisma } from '@prisma/client';

const PUBLIC_WEB_URL = process.env.PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://quicktechpro.com';

function resolvePostLink(slug: string) {
  if (!slug) return PUBLIC_WEB_URL;
  return `${PUBLIC_WEB_URL.replace(/\/$/, '')}/blog/${slug}`;
}

@Injectable()
export class BlogNotificationService {
  private readonly logger = new Logger(BlogNotificationService.name);

  constructor(private prisma: PrismaService, private mail: MailService) {}

  private async logEmail(params: { type: string; recipient: string; subject: string; body: string; metadata?: Record<string, unknown> }) {
    try {
      await this.prisma.blogEmailLog.create({
        data: {
          type: params.type,
          recipient: params.recipient,
          subject: params.subject,
          body: params.body,
          metadata: (params.metadata ?? {}) as Prisma.InputJsonValue
        }
      });
    } catch (error) {
      this.logger.warn(`Failed to log blog email for ${params.recipient}`, error as Error);
    }
  }

  async notifyPostPublished(postId: string) {
    try {
      const post = await this.prisma.blogPost.findUnique({
        where: { id: postId },
        include: { author: { select: { id: true, name: true, email: true } } }
      });
      if (!post || post.status !== BlogStatus.PUBLISHED) {
        return;
      }

      const subscribers = await this.prisma.blogSubscriber.findMany({
        where: { unsubscribed: false, verified: true },
        orderBy: { createdAt: 'asc' },
        take: 1000
      });

      if (subscribers.length === 0) {
        return;
      }

      const subject = `New on QuickTechPro: ${post.title}`;
      const snippet = post.excerpt || (post.content ? post.content.slice(0, 140) : 'Take a look at the latest article.');
      const link = resolvePostLink(post.slug);

      for (const subscriber of subscribers) {
        try {
          await this.mail.sendBlogNewPostEmail(subscriber.email, {
            subject,
            previewText: snippet,
            link,
            subscriberName: subscriber.name || subscriber.email
          });
          await this.logEmail({
            type: 'blog_post_published',
            recipient: subscriber.email,
            subject,
            body: snippet,
            metadata: {
              postId,
              subscriberId: subscriber.id
            }
          });
          await this.prisma.blogSubscriber.update({
            where: { id: subscriber.id },
            data: { lastNotifiedAt: new Date() }
          });
        } catch (error) {
          this.logger.warn(`Unable to queue blog newsletter email for ${subscriber.email}`, error as Error);
        }
      }
    } catch (error) {
      this.logger.error(`Blog publish notification failed for post ${postId}`, error as Error);
    }
  }

  async sendSubscriptionTest(subscriber: { id: string; email: string; name?: string | null }) {
    try {
      await this.mail.sendBlogSubscriptionWelcome(subscriber.email, {
        link: PUBLIC_WEB_URL,
        subscriberName: subscriber.name ?? subscriber.email
      });
      await this.logEmail({
        type: 'newsletter_test',
        recipient: subscriber.email,
        subject: 'QuickTechPro newsletter test email',
        body: 'This is a test email triggered from the admin portal.',
        metadata: { subscriberId: subscriber.id }
      });
    } catch (error) {
      this.logger.warn(`Unable to send subscription test email to ${subscriber.email}`, error as Error);
      throw error;
    }
  }

  async notifyCommentApproved(commentId: string) {
    try {
      const comment = await this.prisma.blogComment.findUnique({
        where: { id: commentId },
        include: {
          post: {
            select: {
              id: true,
              slug: true,
              title: true,
              author: { select: { id: true, email: true, name: true } }
            }
          }
        }
      });
      if (!comment || comment.status !== BlogCommentStatus.APPROVED) {
        return;
      }

      const recipients = new Map<string, { name?: string; type: string }>();
      if (comment.authorEmail) {
        recipients.set(comment.authorEmail.toLowerCase(), {
          name: comment.authorName ?? undefined,
          type: 'comment_author'
        });
      }
      if (comment.post?.author?.email) {
        recipients.set(comment.post.author.email.toLowerCase(), {
          name: comment.post.author.name ?? undefined,
          type: 'post_author'
        });
      }

      if (recipients.size === 0) {
        return;
      }

      const link = resolvePostLink(comment.post?.slug ?? '');
      const snippet = comment.content?.slice(0, 160) ?? 'Your comment has been approved.';

      for (const [email, meta] of recipients.entries()) {
        try {
          await this.mail.sendCommentApprovedEmail(email, {
            postTitle: comment.post?.title ?? 'QuickTechPro Blog',
            link,
            recipientName: meta.name ?? email,
            commentSnippet: snippet
          });
          await this.logEmail({
            type: `comment_${meta.type}`,
            recipient: email,
            subject: `Your comment is live on ${comment.post?.title ?? 'our blog'}`,
            body: snippet,
            metadata: {
              commentId,
              postId: comment.post?.id ?? null,
              recipientType: meta.type
            }
          });
        } catch (error) {
          this.logger.warn(`Unable to queue comment notification for ${email}`, error as Error);
        }
      }
    } catch (error) {
      this.logger.error(`Blog comment approval notification failed for ${commentId}`, error as Error);
    }
  }

  async notifyCommentReply(parentCommentId: string, replyCommentId: string) {
    try {
      const [parent, reply] = await Promise.all([
        this.prisma.blogComment.findUnique({
          where: { id: parentCommentId },
          include: {
            post: {
              select: {
                id: true,
                slug: true,
                title: true
              }
            }
          }
        }),
        this.prisma.blogComment.findUnique({
          where: { id: replyCommentId },
          include: {
            author: { select: { id: true, name: true, email: true } }
          }
        })
      ]);

      if (!parent || !reply) {
        return;
      }

      if (!parent.authorEmail) {
        return;
      }

      const responderName =
        reply.author?.name ||
        reply.authorName ||
        reply.author?.email ||
        'QuickTechPro Team';

      const link = resolvePostLink(parent.post?.slug ?? '');
      const replyContent = reply.content ?? '';
      const originalSnippet = parent.content?.slice(0, 160) ?? undefined;
      const replySnippet = replyContent.slice(0, 180);

      await this.mail.sendCommentReplyEmail(parent.authorEmail, {
        postTitle: parent.post?.title ?? 'QuickTechPro Blog',
        link,
        recipientName: parent.authorName ?? parent.authorEmail,
        responderName,
        replyContent,
        originalSnippet
      });

      await this.logEmail({
        type: 'comment_reply',
        recipient: parent.authorEmail,
        subject: `QuickTechPro replied to your comment on ${parent.post?.title ?? 'our blog'}`,
        body: replySnippet,
        metadata: {
          parentCommentId,
          replyCommentId,
          postId: parent.post?.id ?? null
        }
      });
    } catch (error) {
      this.logger.warn(`Unable to queue comment reply notification for ${parentCommentId}`, error as Error);
    }
  }

}
