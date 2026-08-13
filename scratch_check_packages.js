const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  try {
    const pkgs = await prisma.package.findMany({
      where: {
        slug: { in: ['10-day-private-4-star-umrah', '10-day-private-4-star-umrah-dec'] }
      },
      select: { slug: true, title: true, metaTitle: true, travelDates: true, duration: true }
    });
    console.log("Package Details:");
    console.log(pkgs);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
