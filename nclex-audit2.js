require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function run() {
  const su = (await pool.query('SELECT COUNT(*)::int cnt FROM nclex_sample_users')).rows[0].cnt;
  const cols = (await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='nclex_sample_users' ORDER BY ordinal_position")).rows;
  console.log('=== NCLEX SAMPLE USERS ===');
  console.log('  Total:', su);
  console.log('  Columns:', cols.map(c => c.column_name).join(', '));
  if (su > 0) {
    const recent = (await pool.query('SELECT * FROM nclex_sample_users ORDER BY id DESC LIMIT 5')).rows;
    recent.forEach(r => console.log('  →', JSON.stringify(r).slice(0, 250)));
  }

  const att = (await pool.query('SELECT COUNT(*)::int cnt FROM nclex_attempts')).rows[0].cnt;
  console.log('\n=== NCLEX ATTEMPTS ===');
  console.log('  Total:', att);

  const fb = (await pool.query('SELECT COUNT(*)::int cnt FROM nclex_feedback')).rows[0].cnt;
  console.log('\n=== FEEDBACK ===');
  console.log('  Total:', fb);

  // Paid users
  const paid = (await pool.query("SELECT COUNT(*)::int cnt FROM nclex_users WHERE type='paid'")).rows[0].cnt;
  const testers = (await pool.query("SELECT COUNT(*)::int cnt FROM nclex_users WHERE type='tester'")).rows[0].cnt;
  console.log('\n=== NCLEX USERS ===');
  console.log('  Paid:', paid, '| Testers:', testers);

  await pool.end();
}
run().catch(console.error);
