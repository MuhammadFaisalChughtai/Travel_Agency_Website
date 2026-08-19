const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany();
  console.log("Found packages:", packages.length);
  for (const p of packages) {
    console.log(`ID: ${p.id} | Type: ${p.type} | Title: ${p.title} | Images: ${p.images}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
