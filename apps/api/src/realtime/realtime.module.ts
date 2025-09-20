import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { WsJwtGuard } from '../modules/auth/guards/ws-jwt.guard';

@Module({
  providers: [EventsGateway, WsJwtGuard],
  exports: [EventsGateway]
})
export class RealtimeModule {}
