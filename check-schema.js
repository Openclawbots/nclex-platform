const {Pool}=require('pg');
require('dotenv').config();
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});
pool.connect().then(async client=>{
  const tables=await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
  console.log('All tables:',tables.rows.map(r=>r.table_name).join(', '));
  // Find question table
  const qtable=tables.rows.find(r=>r.table_name.includes('question'));
  if(qtable){
    const cols=await client.query(`SELECT column_name,data_type FROM information_schema.columns WHERE table_name='${qtable.table_name}' ORDER BY ordinal_position`);
    console.log('\nColumns for',qtable.table_name+':');
    cols.rows.forEach(r=>console.log(' ',r.column_name,':',r.data_type));
    const sample=await client.query(`SELECT * FROM ${qtable.table_name} LIMIT 1`);
    console.log('\nSample:',JSON.stringify(sample.rows[0],null,2));
    const cats=await client.query(`SELECT category,COUNT(*) as cnt FROM ${qtable.table_name} GROUP BY category ORDER BY category`);
    console.log('\nCategories:'); cats.rows.forEach(r=>console.log(' ',r.category,':',r.cnt));
  }
  client.release();await pool.end();
}).catch(e=>console.error(e.message));
