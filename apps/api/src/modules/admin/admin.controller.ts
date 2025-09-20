import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PrismaService } from '../../prisma/prisma.service';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async summary() {
    const [users, tickets, invoices, payments] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.ticket.count().catch(()=>0 as any),
      this.prisma.invoice.count().catch(()=>0 as any),
      this.prisma.payment.count().catch(()=>0 as any)
    ]);
    return { users, tickets, invoices, payments };
  }

  @Get('users')
  async listUsers() {
    const items = await this.prisma.user.findMany({
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    return { items: items.map(u => ({ id: u.id, email: u.email, roles: u.roles.map(r => r.role.name) })) };
  }

  @Post('users/promote')
  async promote(@Body() body: { email: string; role: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return { ok: false, message: 'User not found' };
    const role = await this.prisma.role.upsert({ where: { name: body.role }, update: {}, create: { name: body.role } });
    await this.prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: role.id } }, update: {}, create: { userId: user.id, roleId: role.id } });
    return { ok: true };
  }
}

