import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager')
@Controller('admin/services')
export class ServicesAdminController {
  constructor(private prisma: PrismaService) {}

  @Get('catalog')
  async catalog() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { services: { include: { prices: true }, orderBy: { sortOrder: 'asc' } } }
    });
  }

  @Post('category')
  async upsertCategory(@Body() body: any) {
    const { id, ...data } = body;
    if (id) return this.prisma.serviceCategory.update({ where: { id }, data });
    return this.prisma.serviceCategory.create({ data });
  }

  @Post('service')
  async upsertService(@Body() body: any) {
    const { id, ...data } = body;
    if (id) return this.prisma.service.update({ where: { id }, data });
    return this.prisma.service.create({ data });
  }

  @Post('price')
  async upsertPrice(@Body() body: any) {
    const { id, ...data } = body;
    if (id) return this.prisma.servicePrice.update({ where: { id }, data });
    return this.prisma.servicePrice.create({ data });
  }

  @Post('reorder')
  async reorder(@Body() body: { categories?: { id: number; sortOrder: number }[], services?: { id: string; sortOrder: number }[] }) {
    const tx: any[] = [];
    if (body.categories) for (const c of body.categories) tx.push(this.prisma.serviceCategory.update({ where: { id: c.id }, data: { sortOrder: c.sortOrder } }));
    if (body.services) for (const s of body.services) tx.push(this.prisma.service.update({ where: { id: s.id }, data: { sortOrder: s.sortOrder } }));
    await this.prisma.$transaction(tx);
    return { ok: true };
  }
}

