import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.package.findMany();
  console.log("Package OK");
  await prisma.blog.findMany();
  console.log("Blog OK");
  await prisma.visaService.findMany();
  console.log("VisaService OK");
  await prisma.transportService.findMany();
  console.log("TransportService OK");
}
main().catch(console.error).finally(() => prisma.$disconnect());
