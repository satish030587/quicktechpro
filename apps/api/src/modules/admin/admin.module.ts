import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { TicketsController } from './tickets.controller';
import { FinanceController } from './finance.controller';
import { ContentController } from './content.controller';
import { AppointmentsController } from './appointments.controller';
import { ReportsController } from './reports.controller';
import { SettingsController } from './settings.controller';
import { RealtimeModule } from '../../realtime/realtime.module';
import { ServicesAdminController } from './services.controller';
import { KBAdminController } from './kb.controller';
import { AdminNotificationsController } from './notifications.controller';
import { QuotesAdminController } from './quotes.controller';
import { AdminCustomersController } from './customers.controller';
import { BlogNotificationService } from './blog-notification.service';
import { MailService } from '../auth/mail.service';

@Module({
  imports: [UsersModule, RealtimeModule],
  controllers: [
    AdminController,
    TicketsController,
    FinanceController,
    ContentController,
    AppointmentsController,
    ReportsController,
    SettingsController,
    ServicesAdminController,
    KBAdminController,
    AdminNotificationsController,
    QuotesAdminController,
    AdminCustomersController
  ],
  providers: [BlogNotificationService, MailService],
  exports: [BlogNotificationService]
})
export class AdminModule {}
