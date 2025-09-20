import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { RealtimeModule } from '../../realtime/realtime.module';

@Module({
  imports: [RealtimeModule],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
