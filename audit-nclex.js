require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function run() {
  const users = await pool.query(`SELECT COUNT(*) total, COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) completed, COUNT(CASE WHEN converted_to_paid=true THEN 1 END) paid, COUNT(CASE WHEN discount_sent_at IS NOT NULL THEN 1 END) discounted, COUNT(CASE WHEN expiry_reminder_sent_at IS NOT NULL THEN 1 END) reminded FROM nclex_sample_users WHERE email NOT LIKE '%test%' AND email NOT LIKE '%example%' AND email NOT LIKE '%verify%'`);
  const orders = await pool.query('SELECT COUNT(*) n, COALESCE(SUM(amount_cents),0) rev FROM nclex_orders').catch(() => ({ rows: [{ n: 0, rev: 0 }] }));
  const dupes = await pool.query(`SELECT COUNT(*) n FROM (SELECT email FROM nclex_sample_users GROUP BY email HAVING COUNT(*)>1) x`);
  console.log('=== NCLEX AUDIT ===');
  console.log('Real users (excl test):', users.rows[0].total);
  console.log('Completed sample:', users.rows[0].completed);
  console.log('Converted to paid:', users.rows[0].paid);
  console.log('Discount emails sent:', users.rows[0].discounted);
  console.log('Expiry reminders sent:', users.rows[0].reminded);
  console.log('Orders:', orders.rows[0].n, '| Revenue: $' + (orders.rows[0].rev / 100).toFixed(2));
  console.log('Duplicate emails:', dupes.rows[0].n);
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET ✅' : 'MISSING ❌');
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'SET ✅' : 'MISSING ❌');
  console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'NOT SET (using default)');
  await pool.end();
}
run().catch(e => { console.log('ERR:', e.message); pool.end(); });
