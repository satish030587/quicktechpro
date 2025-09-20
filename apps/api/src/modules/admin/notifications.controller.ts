import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../realtime/events.gateway';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager', 'technician', 'content_moderator')
@Controller('admin/notifications')
export class AdminNotificationsController {
  constructor(private prisma: PrismaService, private realtime: EventsGateway) {}

  @Get()
  async list(@Query('read') read?: string, @Query('type') type?: string) {
    const where: any = {};
    if (read != null) where.read = read === 'true';
    if (type) where.type = type;
    const items = await this.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
    return { items };
  }

  @Post(':id/read')
  async markRead(@Param('id') id: string) {
    await this.prisma.notification.update({ where: { id }, data: { read: true } });
    return { ok: true };
  }

  @Post('broadcast')
  async broadcast(@Body() body: { type: string; message: string }) {
    const notification = await this.prisma.notification.create({ data: { userId: null, type: body.type, message: body.message, read: false } });
    this.realtime.emitNotification(notification);
    return { ok: true };
  }
}



