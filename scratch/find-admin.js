const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  console.log("Admin user found:");
  console.log(admin);
}

main().then(() => prisma.$disconnect());
