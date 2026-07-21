require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

// Prisma 7 has no built-in connection engine — we hand it
// a driver adapter (wrapping the standard `pg` package) so
// it knows how to actually talk to Postgres.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;