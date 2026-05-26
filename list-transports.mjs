import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.transportService.findMany();
  console.log('Total records:', all.length);
  for (const t of all) {
    console.log(`  id=${t.id} | vehicleType="${t.vehicleType}" | type="${t.type}" | slug="${t.slug}"`);
  }
  await prisma.$disconnect();
}
main().catch(console.error);
