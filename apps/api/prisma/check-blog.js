const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const posts = await prisma.blogPost.findMany({ include: { category: true } });
    console.log('Posts:', posts.map((p) => ({ slug: p.slug, status: p.status, category: p.category?.name })));
    const categories = await prisma.blogCategory.findMany({ include: { _count: { select: { posts: true } } } });
    console.log('Categories:', categories.map((c) => ({ name: c.name, posts: c._count.posts })));
  } catch (error) {
    console.error('Check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
