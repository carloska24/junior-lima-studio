const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@juniorlima.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Júnior Lima',
      password: hashedPassword,
    },
  });

  console.log('Admin user created:', user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
