import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';
import { PaymentsModule } from './payments/payments.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PublicCatalogModule } from './catalog/public-catalog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AdminModule,
    CustomerModule,
    PaymentsModule,
    RealtimeModule,
    PublicCatalogModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
