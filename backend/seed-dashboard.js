require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    // Get a client and service
    const clientRes = await client.query('SELECT id FROM clients LIMIT 1');
    const serviceRes = await client.query('SELECT id, price, "durationMin" FROM services LIMIT 1');

    if (clientRes.rows.length === 0) return;

    const clientId = clientRes.rows[0].id;
    const service = serviceRes.rows[0];

    // Create a COMPLETED appointment (Revenue)
    // Date: Yesterday 14:00
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(14, 0, 0, 0);

    const q1 = `
      INSERT INTO appointments (id, date, "endDate", status, "totalPrice", "clientId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $1, 'COMPLETED', $2, $3, NOW(), NOW())
    `;
    await client.query(q1, [yesterday, service.price, clientId]);
    console.log('✅ Agendamento CONCLUÍDO criado (Gera Receita)');

    // Create a PENDING appointment for TODAY (Shows in "Today" count but no Revenue yet)
    const today = new Date();
    today.setHours(10, 0, 0, 0);

    const q2 = `
      INSERT INTO appointments (id, date, "endDate", status, "totalPrice", "clientId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $1, 'PENDING', $2, $3, NOW(), NOW())
    `;
    await client.query(q2, [today, service.price, clientId]);
    console.log('✅ Agendamento PENDENTE criado para HOJE');
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await client.end();
  }
}

main();
