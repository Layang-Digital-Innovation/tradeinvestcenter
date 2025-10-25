"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@example.com' },
        update: {},
        create: {
            email: 'superadmin@example.com',
            password: hashedPassword,
            role: client_1.Role.SUPER_ADMIN,
        },
    });
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: hashedPassword,
            role: client_1.Role.ADMIN,
        },
    });
    const investor = await prisma.user.upsert({
        where: { email: 'investor@example.com' },
        update: {},
        create: {
            email: 'investor@example.com',
            password: hashedPassword,
            role: client_1.Role.INVESTOR,
        },
    });
    const projectOwner = await prisma.user.upsert({
        where: { email: 'projectowner@example.com' },
        update: {},
        create: {
            email: 'projectowner@example.com',
            password: hashedPassword,
            role: client_1.Role.PROJECT_OWNER,
        },
    });
    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@example.com' },
        update: {},
        create: {
            email: 'buyer@example.com',
            password: hashedPassword,
            role: client_1.Role.BUYER,
        },
    });
    const seller = await prisma.user.upsert({
        where: { email: 'seller@example.com' },
        update: {},
        create: {
            email: 'seller@example.com',
            password: hashedPassword,
            role: client_1.Role.SELLER,
        },
    });
    console.log('✅ Seeding completed!');
    console.log('Test users created:');
    console.log('- SUPER_ADMIN: superadmin@example.com / password123');
    console.log('- ADMIN: admin@example.com / password123');
    console.log('- INVESTOR: investor@example.com / password123');
    console.log('- PROJECT_OWNER: projectowner@example.com / password123');
    console.log('- BUYER: buyer@example.com / password123');
    console.log('- SELLER: seller@example.com / password123');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map