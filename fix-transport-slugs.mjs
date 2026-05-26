import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function generateSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const transports = await prisma.transportService.findMany();
  console.log(`Found ${transports.length} transport record(s).`);

  let fixed = 0;
  for (const t of transports) {
    if (!t.slug) {
      let base = generateSlug(`${t.vehicleType}-${t.type}`);
      let slug = base;

      // Ensure uniqueness
      let attempt = 0;
      while (true) {
        const conflict = await prisma.transportService.findUnique({ where: { slug } });
        if (!conflict || conflict.id === t.id) break;
        attempt++;
        slug = `${base}-${attempt}`;
      }

      await prisma.transportService.update({ where: { id: t.id }, data: { slug } });
      console.log(`  ✅ Fixed "${t.vehicleType} / ${t.type}" → slug: "${slug}"`);
      fixed++;
    } else {
      console.log(`  ✓  "${t.vehicleType} / ${t.type}" already has slug: "${t.slug}"`);
    }
  }

  console.log(`\nDone. Fixed ${fixed} record(s).`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
