import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRawUnsafe(`SELECT slug FROM VisaService`);
    console.log("Success:", result);
  } catch (err) {
    console.error("Error:", err);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
