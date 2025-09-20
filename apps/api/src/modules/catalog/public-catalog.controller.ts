import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('catalog')
export class PublicCatalogController {
  constructor(private prisma: PrismaService) {}

  @Get('services')
  async services() {
    const now = new Date();
    const cats = await this.prisma.serviceCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        services: {
          where: {
            active: true,
            OR: [
              { activeFrom: null },
              { activeFrom: { lte: now } }
            ],
            AND: [
              { OR: [{ activeTo: null }, { activeTo: { gte: now } }] }
            ]
          },
          orderBy: { sortOrder: 'asc' },
          include: { prices: { where: { active: true }, orderBy: { createdAt: 'asc' } } }
        }
      }
    });
    return { categories: cats };
  }
}

