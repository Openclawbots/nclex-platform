process.env.DATABASE_URL = 'postgresql://postgres:DyKoMdwanKZRzUckfTPvFZJJIBVUPJWb@centerbeam.proxy.rlwy.net:51032/railway';
const { Pool } = require('./node_modules/pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query('SELECT COUNT(*) total, COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) completed, COUNT(CASE WHEN converted_to_paid=true THEN 1 END) paid, COUNT(CASE WHEN discount_sent_at IS NOT NULL THEN 1 END) discounted FROM nclex_sample_users WHERE email NOT LIKE chr(37)||chr(116)||chr(101)||chr(115)||chr(116)||chr(37)').then(r=>{
  console.log(JSON.stringify(r.rows[0]));
  return pool.query('SELECT COUNT(*) n FROM nclex_orders').catch(()=>({rows:[{n:0}]}));
}).then(r=>{ console.log('orders:',r.rows[0].n); pool.end(); }).catch(e=>{console.log('ERR:',e.message);pool.end();});
