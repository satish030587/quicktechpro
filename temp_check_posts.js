const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  const posts = await prisma.blogPost.findMany({ select: { id: true, title: true, authorId: true }, take: 5 });
  console.log(posts);
  await prisma.$disconnect();
})();
