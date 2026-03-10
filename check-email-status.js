const {Pool}=require('pg');
require('dotenv').config();
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});
pool.connect().then(async client=>{
  const r=await client.query('SELECT id,name,email,completed_at,converted_to_paid,email1_sent_at,email2_sent_at,email3_sent_at FROM nclex_sample_users WHERE email1_sent_at IS NOT NULL ORDER BY completed_at');
  console.log('Users with email1 sent:',r.rows.length);
  r.rows.forEach(u=>console.log(u.name,'| e1:',u.email1_sent_at,'| e2:',u.email2_sent_at,'| e3:',u.email3_sent_at,'| paid:',u.converted_to_paid));
  
  const r2=await client.query("SELECT id,name,email FROM nclex_sample_users WHERE completed_at IS NOT NULL AND converted_to_paid=false AND email1_sent_at IS NOT NULL AND email2_sent_at IS NULL");
  console.log('\nEmail 2 eligible (manual):', r2.rows.length, r2.rows.map(u=>u.name||u.email).join(', '));
  client.release(); await pool.end();
}).catch(e=>console.error(e.message));
