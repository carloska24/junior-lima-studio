require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to database via pg');

    const email = 'admin@juniorlima.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 8);

    // Generate UUID for ID since we use UUIDs in schema
    // Polyfill for random UUID if crypto is not available (Node 14-) but we are on Node 22
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();

    const query = `
      INSERT INTO users (id, name, email, password, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email;
    `;

    const res = await client.query(query, [id, 'Júnior Lima', email, hashedPassword, now, now]);

    if (res.rows.length > 0) {
      console.log('User created:', res.rows[0]);
    } else {
      console.log('User already exists');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

main();
