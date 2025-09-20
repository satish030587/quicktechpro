"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const roles = ['customer', 'admin', 'manager', 'technician', 'content_moderator'];
    for (const name of roles) {
        await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
    }
    console.log('Seeded roles:', roles.join(', '));
}
main().finally(async () => prisma.$disconnect());
//# sourceMappingURL=seed.js.map