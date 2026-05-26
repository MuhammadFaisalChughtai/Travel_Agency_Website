import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.visaService.findMany();
  console.log("Found visas:", result.length);
  if (result.length > 0) console.log("First visa slug:", result[0].slug);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
