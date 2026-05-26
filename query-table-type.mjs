import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe(`SHOW FULL TABLES LIKE 'VisaService'`);
  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
