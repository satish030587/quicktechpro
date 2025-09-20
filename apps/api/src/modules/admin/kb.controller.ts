import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin', 'manager', 'content_moderator')
@Controller('admin/kb')
export class KBAdminController {
  constructor(private prisma: PrismaService) {}

  @Get('categories')
  categories() {
    return this.prisma.kBCategory.findMany({ orderBy: { name: 'asc' } });
  }

  @Post('category')
  upsertCategory(@Body() body: { id?: number; name: string }) {
    if (body.id) return this.prisma.kBCategory.update({ where: { id: body.id }, data: { name: body.name } });
    return this.prisma.kBCategory.create({ data: { name: body.name } });
  }

  @Get('articles')
  articles(
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string
  ) {
    const where: any = {};
    if (status) where.status = status as any;
    if (categoryId) where.categoryId = Number(categoryId);
    if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { content: { contains: q, mode: 'insensitive' } }];
    return this.prisma.knowledgeBaseArticle.findMany({ where, orderBy: { updatedAt: 'desc' }, take: 200 });
  }

  @Post('article')
  upsertArticle(@Body() body: any) {
    const { id, ...data } = body;
    if (data.categoryId) data.categoryId = Number(data.categoryId);
    if (id) return this.prisma.knowledgeBaseArticle.update({ where: { id }, data });
    return this.prisma.knowledgeBaseArticle.create({ data });
  }

  @Patch('articles/:id/status')
  setStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.prisma.knowledgeBaseArticle.update({ where: { id }, data: { status: body.status as any } });
  }
}
