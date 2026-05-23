const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const flights = await prisma.flight.findMany({ select: { id: true, destination: true } });
  console.log("Flights:", JSON.stringify(flights, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
