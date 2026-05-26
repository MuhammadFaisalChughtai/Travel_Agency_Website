import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function generateSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function main() {
  const transports = await prisma.transportService.findMany();
  console.log('Total transport services:', transports.length);
  
  for (const t of transports) {
    if (!t.slug) {
      let slug = generateSlug(`${t.vehicleType}-${t.type}`);
      const existing = await prisma.transportService.findUnique({ where: { slug } });
      if (existing && existing.id !== t.id) {
        slug = `${slug}-${t.id.slice(-4)}`;
      }
      await prisma.transportService.update({ where: { id: t.id }, data: { slug } });
      console.log(`Fixed: "${t.vehicleType}" -> slug: "${slug}"`);
    } else {
      console.log(`OK: "${t.vehicleType}" -> slug: "${t.slug}"`);
    }
  }
  await prisma.$disconnect();
  console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
