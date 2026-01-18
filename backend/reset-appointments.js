require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();

    // 1. List existing appointments
    console.log('🔍 Buscando agendamentos existentes...');
    const res = await client.query(`
      SELECT a.id, a.date, c.name as client_name 
      FROM appointments a
      JOIN clients c ON a."clientId" = c.id
      ORDER BY a.date ASC
    `);

    if (res.rows.length === 0) {
      console.log('--- Nenhum agendamento encontrado para limpar. ---');
    } else {
      console.log(`--- Encontrados ${res.rows.length} agendamentos: ---`);
      res.rows.forEach(row => {
        console.log(`[${row.id}] Data: ${row.date.toLocaleString()} - Cliente: ${row.client_name}`);
      });

      // 2. Delete all appointments
      // First delete relation manually if needed or just delete items.
      // Since implicit m-n, we might need to rely on cascade or clean join table first if FK violation occurs.
      // But typically Prisma sets up Cascade. Let's try simple DELETE.

      // Note: We need to be careful about "_AppointmentToService" table.
      // However, Prisma schema defines relations. If using raw SQL, we must rely on DB constraints.
      // If ON DELETE BO CASCADE is set, it works. If not, error.
      // Let's try deleting from appointments.

      await client.query('DELETE FROM appointments');
      console.log('🗑️  TODOS os agendamentos foram removidos com sucesso!');
    }
  } catch (err) {
    if (err.code === '23503') {
      // Foreign key violation
      console.error('Erro de chave estrangeira. Tentando limpar tabela de junção primeiro...');
      try {
        // Try to find the join table name dynamically or guess standard Abstract_AppointmentToService
        await client.query('DELETE FROM "_AppointmentToService"'); // Prism standard
        await client.query('DELETE FROM appointments');
        console.log('🗑️  Agendamentos removidos (após limpar vínculos)!');
      } catch (e2) {
        console.error('Erro fatal ao limpar:', e2);
      }
    } else {
      console.error('Erro:', err);
    }
  } finally {
    await client.end();
  }
}

main();
