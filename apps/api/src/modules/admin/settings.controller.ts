import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin')
@Controller('admin/settings')
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    const [settings, integrations] = await Promise.all([
      this.prisma.setting.findMany(),
      this.prisma.integrationSetting.findMany()
    ]);
    return { settings, integrations };
  }

  @Post()
  async upsert(@Body() body: { settings?: { key: string; value: string }[]; integrations?: { key: string; jsonValue: any }[] }) {
    if (body.settings) {
      for (const s of body.settings) {
        await this.prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: { key: s.key, value: s.value } });
      }
    }
    if (body.integrations) {
      for (const i of body.integrations) {
        await this.prisma.integrationSetting.upsert({ where: { key: i.key }, update: { jsonValue: i.jsonValue }, create: { key: i.key, jsonValue: i.jsonValue } });
      }
    }
    return { ok: true };
  }
}

