const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Studio Settings...');

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
    console.log('✅ Studio Settings seeded successfully');
  } else {
    console.log('ℹ️  Studio Settings already exists');
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
