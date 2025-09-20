const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true }, take: 20 });
  console.log(users);
  await prisma.$disconnect();
})();
