require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
p.query(`
  ALTER TABLE nclex_sample_users
    ADD COLUMN IF NOT EXISTS email1_sent_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS email2_sent_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS email3_sent_at TIMESTAMPTZ
`).then(() => {
  console.log('✅ Columns added: email1_sent_at, email2_sent_at, email3_sent_at');

  // Backfill: any existing discount_sent_at records → mark as email2 sent
  return p.query('UPDATE nclex_sample_users SET email2_sent_at = discount_sent_at WHERE discount_sent_at IS NOT NULL AND email2_sent_at IS NULL');
}).then(r => {
  console.log(`✅ Backfilled ${r.rowCount} existing discount emails as email2`);
  p.end();
}).catch(e => { console.error(e.message); p.end(); });
