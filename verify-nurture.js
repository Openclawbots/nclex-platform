require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  // Check sample users and their email status
  const users = (await pool.query(`
    SELECT id, name, email, score, completed_at, converted_to_paid,
           email1_sent_at, email2_sent_at, email3_sent_at,
           discount_sent_at, discount_expires_at, created_at
    FROM nclex_sample_users
    ORDER BY created_at DESC
  `)).rows;

  console.log('=== NCLEX SAMPLE USERS & EMAIL STATUS ===');
  console.log(`Total: ${users.length}\n`);
  
  let email1Count = 0, email2Count = 0, email3Count = 0, discountCount = 0;
  
  users.forEach(u => {
    const hoursSinceCreate = Math.round((Date.now() - new Date(u.created_at).getTime()) / 3600000);
    console.log(`[${u.id}] ${u.email}`);
    console.log(`  Created: ${new Date(u.created_at).toLocaleDateString()} (${hoursSinceCreate}h ago) | Score: ${u.score} | Paid: ${u.converted_to_paid}`);
    console.log(`  Email1 (2hr): ${u.email1_sent_at ? '✅ ' + new Date(u.email1_sent_at).toLocaleString() : '❌ NOT SENT'}`);
    console.log(`  Email2 (24hr): ${u.email2_sent_at ? '✅ ' + new Date(u.email2_sent_at).toLocaleString() : '❌ NOT SENT'}`);
    console.log(`  Email3 (72hr): ${u.email3_sent_at ? '✅ ' + new Date(u.email3_sent_at).toLocaleString() : '❌ NOT SENT'}`);
    console.log(`  Discount: ${u.discount_sent_at ? '✅ ' + new Date(u.discount_sent_at).toLocaleString() : '❌ NOT SENT'}`);
    
    if (u.email1_sent_at) email1Count++;
    if (u.email2_sent_at) email2Count++;
    if (u.email3_sent_at) email3Count++;
    if (u.discount_sent_at) discountCount++;
    
    // Flag users who SHOULD have received emails but didn't
    if (hoursSinceCreate > 3 && !u.email1_sent_at && u.completed_at) {
      console.log(`  ⚠️  OVERDUE: Email1 should have sent ${hoursSinceCreate - 2}h ago`);
    }
    if (hoursSinceCreate > 25 && !u.email2_sent_at && u.completed_at) {
      console.log(`  ⚠️  OVERDUE: Email2 should have sent ${hoursSinceCreate - 24}h ago`);
    }
    if (hoursSinceCreate > 73 && !u.email3_sent_at && u.completed_at) {
      console.log(`  ⚠️  OVERDUE: Email3 should have sent ${hoursSinceCreate - 72}h ago`);
    }
    console.log('');
  });

  console.log('=== SUMMARY ===');
  console.log(`Email1 sent: ${email1Count}/${users.length}`);
  console.log(`Email2 sent: ${email2Count}/${users.length}`);
  console.log(`Email3 sent: ${email3Count}/${users.length}`);
  console.log(`Discount sent: ${discountCount}/${users.length}`);
  
  // Check who completed the sample (eligible for emails)
  const completed = users.filter(u => u.completed_at);
  console.log(`\nCompleted sample: ${completed.length}/${users.length}`);
  console.log(`Eligible but NEVER emailed: ${completed.filter(u => !u.email1_sent_at).length}`);

  await pool.end();
}
run().catch(console.error);
