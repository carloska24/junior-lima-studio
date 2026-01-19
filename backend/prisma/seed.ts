import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

console.log('SEEDING WITH DB URL:', process.env.DATABASE_URL ? 'DEFINED' : 'UNDEFINED');

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

  console.log({ user });
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
