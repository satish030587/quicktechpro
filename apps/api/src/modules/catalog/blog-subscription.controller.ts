import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../auth/mail.service';
import { randomBytes } from 'crypto';

function isValidEmail(value: string | undefined) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

@Controller('blog/newsletter')
export class BlogSubscriptionController {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  private normaliseEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private generateToken() {
    return randomBytes(24).toString('hex');
  }

  async recordWelcomeEmail(email: string, subscriberId: string) {
    try {
      await this.prisma.blogEmailLog.create({
        data: {
          type: 'subscription_welcome',
          recipient: email,
          subject: 'Welcome to QuickTechPro insights',
          body: 'Thank you for subscribing to our blog updates.',
          metadata: { subscriberId }
        }
      });
    } catch {
      // log silently
    }
  }

  @Post()
  async subscribe(@Body() body: { email: string; name?: string }) {
    if (!isValidEmail(body?.email)) {
      throw new BadRequestException('A valid email address is required');
    }

    const email = this.normaliseEmail(body.email);
    const name = body?.name?.trim() || null;

    const existing = await this.prisma.blogSubscriber.findUnique({ where: { email } });
    let subscriber;

    if (existing) {
      subscriber = await this.prisma.blogSubscriber.update({
        where: { email },
        data: {
          name,
          verified: true,
          unsubscribed: false,
          unsubscribedAt: null,
          token: existing.token || this.generateToken(),
          updatedAt: new Date()
        }
      });
    } else {
      subscriber = await this.prisma.blogSubscriber.create({
        data: {
          email,
          name,
          verified: true,
          token: this.generateToken()
        }
      });
    }

    await this.mail.sendBlogSubscriptionWelcome(email, {
      link: (process.env.PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://quicktechpro.com') + '/blog',
      subscriberName: subscriber.name || subscriber.email
    });
    await this.recordWelcomeEmail(email, subscriber.id);

    return {
      success: true,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        verified: subscriber.verified,
        unsubscribed: subscriber.unsubscribed
      }
    };
  }

  @Post('unsubscribe')
  async unsubscribe(@Body() body: { token: string }) {
    const token = body?.token?.trim();
    if (!token) throw new BadRequestException('Missing unsubscribe token');

    const subscriber = await this.prisma.blogSubscriber.findUnique({ where: { token } });
    if (!subscriber) throw new BadRequestException('Subscriber not found');

    await this.prisma.blogSubscriber.update({
      where: { id: subscriber.id },
      data: { unsubscribed: true, unsubscribedAt: new Date() }
    });

    return { success: true };
  }
}

