require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    // Get a client and a service
    const clientRes = await client.query('SELECT id FROM clients LIMIT 1');
    const serviceRes = await client.query('SELECT id, price, "durationMin" FROM services LIMIT 1');

    if (clientRes.rows.length === 0 || serviceRes.rows.length === 0) {
      console.log('⚠️ Need clients and services first!');
      return;
    }

    const clientId = clientRes.rows[0].id;
    const service = serviceRes.rows[0];

    // Create appointment for Saturday Jan 17th at 15:00 (Visible in current week view)
    // Month is 0-indexed (0 = Jan)
    const date = new Date(2026, 0, 17, 15, 0, 0); // Jan 17, 2026 15:00
    const endDate = new Date(date.getTime() + service.durationMin * 60000);

    const query = `
      INSERT INTO appointments (id, date, "endDate", status, "totalPrice", "clientId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, 'PENDING', $3, $4, NOW(), NOW())
      RETURNING id
    `;

    const res = await client.query(query, [date, endDate, service.price, clientId]);
    console.log('✅ Agendamento de teste criado:', res.rows[0].id);

    // Link service (implicit many-to-many in prisma is usually in a join table "_AppointmentToService")
    // Wait, Prisma implicit m-n uses a specific table name.
    // Let's check how Prisma names it. Usually "_AppointmentToService" with "A" (appointmentId) and "B" (serviceId).
    // To be safe/easy via SQL without knowing exact prism internals (hashes),
    // it handles hidden tables.
    // ALTERNATIVE: Just use the API to create it? No, script is faster.
    // Let's check table names.
    const tables = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    const joinTable = tables.rows.find(r => r.table_name.includes('_AppointmentToService'));

    if (joinTable) {
      await client.query(`INSERT INTO "${joinTable.table_name}" ("A", "B") VALUES ($1, $2)`, [
        res.rows[0].id,
        service.id,
      ]);
      console.log('✅ Serviço vinculado!');
    } else {
      console.log('⚠️ Tabela de junção não encontrada. O agendamento pode aparecer sem serviço.');
    }
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await client.end();
  }
}

main();
