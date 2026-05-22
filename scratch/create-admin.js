const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@terrifictravel.co.uk";
  const plainPassword = "password123";
  
  // Check if it exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists:", existing.email);
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("Successfully created admin user!");
  console.log("Email:", admin.email);
  console.log("Password:", plainPassword);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
