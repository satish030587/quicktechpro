"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function upsertCategory(name, slug, description, sortOrder) {
    return prisma.serviceCategory.upsert({
        where: { slug },
        update: { name, description, sortOrder, active: true },
        create: { name, slug, description, sortOrder, active: true }
    });
}
async function upsertService(input) {
    const { name, slug, description, categoryId, isRemote, isOnsite, isWeb, payFirst, appointmentRequired, quoteRequired, sortOrder } = input;
    return prisma.service.upsert({
        where: { slug },
        update: { name, description, categoryId, isRemote, isOnsite, isWeb, payFirst, appointmentRequired, quoteRequired, active: true, sortOrder: sortOrder ?? 0 },
        create: { name, slug, description, categoryId, isRemote: !!isRemote, isOnsite: !!isOnsite, isWeb: !!isWeb, payFirst: !!payFirst, appointmentRequired: !!appointmentRequired, quoteRequired: !!quoteRequired, active: true, sortOrder: sortOrder ?? 0 }
    });
}
async function seed() {
    const it = await upsertCategory('IT Support', 'it-support', 'Computer repair & IT services', 1);
    const web = await upsertCategory('Web Development', 'web-dev', 'Websites & applications', 2);
    const remote = await upsertService({
        name: 'Remote Support',
        slug: 'remote-support',
        description: 'Fast remote fixes. Pay‑first checkout.',
        categoryId: it.id,
        isRemote: true,
        payFirst: true,
        sortOrder: 1
    });
    await prisma.servicePrice.createMany({
        data: [
            { serviceId: remote.id, label: 'Basic (1 hour)', amount: '1499', currency: 'INR', active: true, badge: 'Popular' },
            { serviceId: remote.id, label: 'Advanced (2 hours)', amount: '1799', currency: 'INR', active: true },
            { serviceId: remote.id, label: 'Premium (3+ hours)', amount: '1999', currency: 'INR', active: true }
        ],
        skipDuplicates: true
    });
    const onsite = await upsertService({
        name: 'Onsite IT Support (Bangalore)',
        slug: 'onsite-it-support',
        description: 'Technician visits in Bangalore (appointment required).',
        categoryId: it.id,
        isOnsite: true,
        appointmentRequired: true,
        sortOrder: 2
    });
    await prisma.servicePrice.createMany({
        data: [
            { serviceId: onsite.id, label: 'Consultation Visit', amount: '1200', currency: 'INR', active: true },
            { serviceId: onsite.id, label: 'Home Service (per hour)', amount: '1400', currency: 'INR', active: true },
            { serviceId: onsite.id, label: 'Business Support (per hour)', amount: '1600', currency: 'INR', active: true, badge: 'B2B' }
        ],
        skipDuplicates: true
    });
    await upsertService({
        name: 'Web Development',
        slug: 'web-development',
        description: 'Sites, e‑commerce, and web apps. Custom quotes.',
        categoryId: web.id,
        isWeb: true,
        quoteRequired: true,
        sortOrder: 1
    });
}
seed()
    .then(async () => {
    console.log('Catalog seeded');
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed-catalog.js.map