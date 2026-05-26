import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

async function main() {
  const visas = await prisma.visaService.findMany();
  for (const visa of visas) {
    if (!visa.slug) {
      let slug = generateSlug(`${visa.country}-${visa.visaType}`);
      
      // Ensure unique
      let uniqueSlug = slug;
      let counter = 1;
      while (true) {
        const existing = await prisma.visaService.findUnique({ where: { slug: uniqueSlug } });
        if (!existing || existing.id === visa.id) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      await prisma.visaService.update({
        where: { id: visa.id },
        data: { slug: uniqueSlug }
      });
      console.log(`Updated visa ${visa.id} with slug: ${uniqueSlug}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
