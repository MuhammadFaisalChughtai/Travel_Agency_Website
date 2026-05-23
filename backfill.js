const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function main() {
  const packages = await prisma.package.findMany();
  for (const pkg of packages) {
    let slug = generateSlug(pkg.title);
    
    // Ensure uniqueness
    let isUnique = false;
    let counter = 1;
    let finalSlug = slug;
    
    while (!isUnique) {
      const existing = await prisma.package.findFirst({
        where: {
          slug: finalSlug,
          id: { not: pkg.id }
        }
      });
      if (existing) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      } else {
        isUnique = true;
      }
    }

    await prisma.package.update({
      where: { id: pkg.id },
      data: { slug: finalSlug }
    });
    console.log(`Updated package ${pkg.id} with slug: ${finalSlug}`);
  }
  
  console.log("Slugs backfilled successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
