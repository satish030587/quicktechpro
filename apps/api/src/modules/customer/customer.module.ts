import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { RealtimeModule } from '../../realtime/realtime.module';

@Module({
  imports: [RealtimeModule],
  controllers: [CustomerController]
})
export class CustomerModule {}
