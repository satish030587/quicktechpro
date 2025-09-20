import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('kb')
export class PublicKBController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('categoryId') categoryId?: string, @Query('q') q?: string, @Query('skip') skip?: string, @Query('take') take?: string) {
    const where: any = { status: 'PUBLISHED' };
    if (categoryId) where.categoryId = Number(categoryId);
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }];
    const [items, total, categories] = await Promise.all([
      this.prisma.knowledgeBaseArticle.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: Number(skip)||0, take: Number(take)||10 }),
      this.prisma.knowledgeBaseArticle.count({ where }),
      this.prisma.kBCategory.findMany({ orderBy: { name: 'asc' } })
    ]);
    return { items, total, categories };
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string) {
    const a = await this.prisma.knowledgeBaseArticle.findUnique({ where: { slug } });
    if (!a || a.status !== 'PUBLISHED') return null;
    return a;
  }
}

