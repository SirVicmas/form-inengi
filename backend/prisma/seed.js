require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'victor@forminengi.com'; // change to whatever email you want to log in with
    const plainPassword = 'ChangeMe123!';   // change this too — you'll use it to log in once, then it's yours to remember

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {},
        create: { email, passwordHash },
    });

    console.log('Admin ready:', admin.email);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());