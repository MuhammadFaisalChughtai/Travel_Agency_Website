const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  try {
    const packages = await prisma.package.findMany({ select: { metaKeywords: true } });
    console.log("All metaKeywords in database:");
    console.log(packages.map(p => p.metaKeywords).filter(Boolean));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
