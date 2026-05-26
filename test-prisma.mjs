import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  console.log("Running transport findMany...");
  const ts = await prisma.transportService.findMany();
  console.log("Found", ts.length, "transports");
}
main().catch(console.error).finally(() => prisma.$disconnect());
