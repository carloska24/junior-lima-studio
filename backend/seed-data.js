require('dotenv').config();
const { Client: PgClient } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL must be set in .env');
    process.exit(1);
  }

  const client = new PgClient({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to database...');

    // 1. Insert Services
    const services = [
      {
        name: 'Corte Signature',
        description: 'Corte personalizado e consultoria de visagismo',
        price: 120.0,
        durationMin: 60,
        active: true,
      },
      {
        name: 'Barba & Terapia',
        description: 'Modelagem de barba com toalha quente e massagem',
        price: 80.0,
        durationMin: 45,
        active: true,
      },
      {
        name: 'Coloração Premium',
        description: 'Cobertura de brancos ou mudança de visual',
        price: 180.0,
        durationMin: 90,
        active: true,
      },
    ];

    for (const s of services) {
      // Check if exists
      const res = await client.query('SELECT id FROM services WHERE name = $1', [s.name]);
      if (res.rows.length === 0) {
        const query = `
          INSERT INTO services (id, name, description, price, "durationMin", active, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
        `;
        await client.query(query, [s.name, s.description, s.price, s.durationMin, s.active]);
      }
    }
    console.log('✅ Serviços criados!');

    // 2. Insert Clients
    const costumers = [
      { name: 'Carlos Silva', phone: '19999990001', email: 'carlos@email.com' },
      { name: 'Roberto Miranda', phone: '19999990002', email: 'roberto@email.com' },
      { name: 'André Souza', phone: '19999990003', email: 'andre@email.com' },
    ];

    for (const c of costumers) {
      const res = await client.query('SELECT id FROM clients WHERE email = $1', [c.email]);
      if (res.rows.length === 0) {
        const query = `
          INSERT INTO clients (id, name, phone, email, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        `;
        await client.query(query, [c.name, c.phone, c.email]);
      }
    }
    console.log('✅ Clientes criados!');
  } catch (err) {
    console.error('Erro ao seedar banco:', err);
  } finally {
    await client.end();
  }
}

main();
