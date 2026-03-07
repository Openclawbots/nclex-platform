require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function main() {
  await pool.query(`ALTER TABLE nclex_sample_users ADD COLUMN IF NOT EXISTS discount_sent_at TIMESTAMP`);
  await pool.query(`ALTER TABLE nclex_sample_users ADD COLUMN IF NOT EXISTS discount_expires_at TIMESTAMP`);
  console.log('✅ DB migrated for discount tracking');
  await pool.end();
}
main().catch(console.error);
