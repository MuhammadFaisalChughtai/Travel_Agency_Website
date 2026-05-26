import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE VisaService ADD COLUMN slug VARCHAR(191) UNIQUE;`,
    );
    console.log("Column added successfully!");
  } catch (e) {
    console.error("Failed to add column:", e);
  }
  const result = await prisma.$queryRawUnsafe(`DESCRIBE VisaService`);
  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
