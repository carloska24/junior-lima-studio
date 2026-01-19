const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const connectionString =
  'postgresql://postgres:91f253b03a44a8a9ba80934e@34.39.196.40:5432/junior-lima-studio?schema=public';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database.');

    const email = 'admin@juniorlima.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 8);
    const id = uuidv4();

    // Check if user exists (Table: users)
    const checkRes = await client.query('SELECT * FROM "users" WHERE email = $1', [email]);
    if (checkRes.rows.length > 0) {
      console.log('User already exists:', checkRes.rows[0].email);
    } else {
      const res = await client.query(
        `
        INSERT INTO "users" (id, email, name, password, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *
      `,
        [id, email, 'Júnior Lima', hashedPassword]
      );
      console.log('User created:', res.rows[0]);
    }
  } catch (err) {
    console.error('Error creating user:', err);
  } finally {
    await client.end();
  }
}

main();
