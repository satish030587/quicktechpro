import { Module } from '@nestjs/common';
import { PublicCatalogController } from './public-catalog.controller';
import { PublicKBController } from './public-kb.controller';
import { PublicBlogController } from './public-blog.controller';
import { BlogSubscriptionController } from './blog-subscription.controller';
import { MailService } from '../auth/mail.service';

@Module({
  controllers: [PublicCatalogController, PublicKBController, PublicBlogController, BlogSubscriptionController],
  providers: [MailService]
})
export class PublicCatalogModule {}

