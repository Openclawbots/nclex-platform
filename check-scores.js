require('dotenv').config();
const { Pool } = require('pg');
const p = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

p.query('SELECT id, name, email, score, completed_at, converted_to_paid, discount_sent_at FROM nclex_sample_users ORDER BY completed_at DESC LIMIT 15')
  .then(r => {
    console.log('Recent NCLEX sample users:');
    r.rows.forEach(u => {
      const scoreDisplay = u.score !== null ? `${Math.round((Number(u.score) / 10) * 100)}%` : 'no score';
      console.log(`  [${u.id}] ${u.name} | ${u.email} | score: ${u.score} (${scoreDisplay}) | completed: ${u.completed_at ? 'yes' : 'no'} | converted: ${u.converted_to_paid} | discount_sent: ${u.discount_sent_at ? 'yes' : 'no'}`);
    });
    p.end();
  })
  .catch(e => { console.log('Error:', e.message); p.end(); });
