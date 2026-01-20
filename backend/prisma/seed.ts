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

  // Seed Studio Settings
  const settings = await prisma.studioSettings.findFirst();
  if (!settings) {
    await prisma.studioSettings.create({
      data: {
        name: 'Júnior Lima Hair Artist',
        email: 'juniorlimahair@gmail.com',
        phone: '19 99268-7759',
        whatsapp: '19 99268-7759',
        address: 'Rua Lotário Novaes, 273 – Taquaral',
        city: 'Campinas – SP, 13076-150',
        openingHours: `Segunda-feira: Fechado
Terça-feira: 12:00–18:00
Quarta-feira: 12:00–18:00
Quinta-feira: 10:00–18:00
Sexta-feira: 10:00–18:00
Sábado: 10:00–18:00
Domingo: Fechado`,
        instagramUrl: 'https://www.instagram.com/juniorlimah',
      },
    });
    console.log('Studio Settings seeded');
  } else {
    console.log('Studio Settings already exists');
  }
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
