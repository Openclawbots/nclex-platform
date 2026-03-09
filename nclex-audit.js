require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  // Find tables
  const tables = (await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")).rows;
  console.log('=== NCLEX TABLES ===');
  console.log('  ' + tables.map(t => t.table_name).join(', '));

  // Try common table names
  for (const tbl of ['nclex_users', 'sample_users', 'quiz_users', 'leads', 'nclex_leads', 'email_daily_counts']) {
    if (tables.find(t => t.table_name === tbl)) {
      const cnt = (await pool.query(`SELECT COUNT(*)::int cnt FROM ${tbl}`)).rows[0].cnt;
      console.log(`\n  ${tbl}: ${cnt} rows`);

      // Get columns
      const cols = (await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='${tbl}' ORDER BY ordinal_position`)).rows;
      console.log(`  Columns: ${cols.map(c => c.column_name).join(', ')}`);

      // Sample
      if (cnt > 0) {
        const sample = (await pool.query(`SELECT * FROM ${tbl} ORDER BY 1 DESC LIMIT 3`)).rows;
        sample.forEach(r => console.log('  →', JSON.stringify(r).slice(0, 200)));
      }
    }
  }

  await pool.end();
}
run().catch(console.error);
