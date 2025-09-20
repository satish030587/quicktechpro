import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = ['customer', 'admin', 'manager', 'technician', 'content_moderator'];
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Seeded roles:', roles.join(', '));
}

main().finally(async () => prisma.$disconnect());

