const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Use the same adapter pattern as src/lib/prisma.ts for Prisma 7 compatibility
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  // Backfill Categories from PortfolioItems
  // Define priority order for main categories
  const priorityList = ['Visagismo', 'Corte', 'Barba', 'Loiro', 'Mechas', 'Coloração'];

  const allItems = await prisma.portfolioItem.findMany({
    select: { category: true },
  });

  const uniqueCategories = [...new Set(allItems.map(item => item.category).filter(Boolean))];

  console.log(`Found ${uniqueCategories.length} unique categories to sync.`);

  // Sort uniqueCategories: Priority items first, then others alphabetically
  uniqueCategories.sort((a, b) => {
    const idxA = priorityList.indexOf(a);
    const idxB = priorityList.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  let orderCounter = 1;

  for (const catName of uniqueCategories) {
    // Upsert ensures we correct the order even if category exists
    await prisma.category.upsert({
      where: { name: catName },
      update: {
        // Only update order if it's currently the default "migrated" value (99) to avoid overwriting user manual changes?
        // User requested explicit fix, so we force order reset for now to clean up the "99" mess.
        order: orderCounter,
      },
      create: {
        name: catName,
        order: orderCounter,
        active: true,
      },
    });
    console.log(`Synced category: ${catName} (Order: ${orderCounter})`);
    orderCounter++;
  }
  console.log('Categories synced and reordered');
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
