"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'satish87@live.com';
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error(`User with email ${email} not found`);
    }
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: { name: 'admin' }
    });
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
        update: {},
        create: { userId: user.id, roleId: adminRole.id }
    });
    await prisma.blogPost.updateMany({
        data: { authorId: user.id }
    });
    await prisma.blogCategory.deleteMany({
        where: { name: 'Computer', posts: { none: {} } }
    });
    console.log(`Promoted ${email} to admin and reassigned blog posts.`);
}
main()
    .catch((error) => {
    console.error('Promotion failed:', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=promote-blog-admin.js.map