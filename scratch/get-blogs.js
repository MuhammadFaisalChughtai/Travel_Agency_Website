const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const blogs = await prisma.blog.findMany();
  console.log(JSON.stringify(blogs.map(b => b.slug), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
