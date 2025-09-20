import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventsGateway } from '../../realtime/events.gateway';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager', 'technician')
@Controller('admin/appointments')
export class AppointmentsController {
  constructor(private prisma: PrismaService, private realtime: EventsGateway) {}

  @Get()
  async list(@Query('from') from?: string, @Query('to') to?: string, @Query('technicianId') technicianId?: string, @Query('status') status?: string) {
    const where: any = {};
    if (from || to) {
      where.scheduledAt = {};
      if (from) where.scheduledAt.gte = new Date(from);
      if (to) where.scheduledAt.lte = new Date(to);
    }
    if (technicianId) where.technicianId = technicianId;
    if (status) {
      const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
      if (statuses.length > 1) {
        where.status = { in: statuses as any[] };
      } else if (statuses.length === 1) {
        where.status = statuses[0] as any;
      }
    }
    const items = await this.prisma.appointment.findMany({ where, include: { ticket: { include: { customer: true } }, technician: true }, orderBy: { scheduledAt: 'asc' }, take: 200 });
    return { items };
  }

  @Post()
  async create(@Body() body: { ticketId: string; scheduledAt: string; durationMins?: number; address?: string; notes?: string; technicianId?: string }) {
    if (!body?.ticketId) {
      throw new BadRequestException('Ticket is required');
    }

    const scheduledAt = new Date(body.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('Invalid appointment date');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        ticketId: body.ticketId,
        scheduledAt,
        durationMins: body.durationMins || 60,
        address: body.address,
        notes: body.notes,
        technicianId: body.technicianId || null
      },
      include: { ticket: { include: { customer: true } }, technician: true }
    });

    this.realtime.emitAppointmentUpsert(appointment);
    return appointment;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    const allowed = ['scheduledAt', 'durationMins', 'address', 'notes', 'technicianId', 'status'];
    for (const key of allowed) {
      if (!(key in body)) continue;
      if (key === 'scheduledAt') {
        const datetime = new Date(body[key]);
        if (Number.isNaN(datetime.getTime())) {
          throw new BadRequestException('Invalid appointment date');
        }
        data.scheduledAt = datetime;
      } else if (key === 'technicianId') {
        data.technicianId = body[key] || null;
      } else {
        data[key] = body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No changes provided');
    }

    const appointment = await this.prisma.appointment.update({
      where: { id },
      data,
      include: { ticket: { include: { customer: true } }, technician: true }
    });

    this.realtime.emitAppointmentUpsert(appointment);
    return appointment;
  }
}

