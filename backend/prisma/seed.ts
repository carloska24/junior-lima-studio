import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
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
    console.log('Studio Settings seeded');
  } else {
    console.log('Studio Settings already exists');
  }

  // Seed Services
  const servicesCount = await prisma.service.count();
  if (servicesCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          name: 'Corte de Cabelo',
          description: 'Corte personalizado com visagismo e finalização.',
          price: 90.0,
          durationMin: 45,
          active: true,
          imageUrl:
            'https://images.unsplash.com/photo-1585747833206-75b15637f768?auto=format&fit=crop&q=80&w=800',
        },
        {
          name: 'Barba Terapia',
          description: 'Modelagem de barba com toalha quente e hidratação.',
          price: 60.0,
          durationMin: 30,
          active: true,
          imageUrl:
            'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
        },
        {
          name: 'Combo Júnior Lima',
          description: 'Experiência completa: Corte + Barba + Sobrancelha.',
          price: 140.0,
          durationMin: 90,
          active: true,
          imageUrl:
            'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
        },
      ],
    });
    console.log('Services seeded');
  }

  // Seed Portfolio
  const portfolioCount = await prisma.portfolioItem.count();
  if (portfolioCount === 0) {
    await prisma.portfolioItem.createMany({
      data: [
        {
          title: 'Corte Degradê Moderno',
          category: 'Corte',
          imageUrl:
            'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
          order: 1,
          active: true,
        },
        {
          title: 'Barba Modelada',
          category: 'Barba',
          imageUrl:
            'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800',
          order: 2,
          active: true,
        },
        {
          title: 'Visagismo Completo',
          category: 'Visagismo',
          imageUrl:
            'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=800',
          order: 3,
          active: true,
        },
      ],
    });
    console.log('Portfolio seeded');
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
