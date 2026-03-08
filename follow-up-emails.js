/**
 * 📧 NCLEX Follow-Up Email — 15% off for sample non-converters
 * Run via heartbeat every few hours
 * Sends SAMPLE15 code 24hrs after sample completion if not converted
 *
 * ✅ Uses Resend.com (support@nclexprepro.com) — NOT Gmail
 * ⚠️  Daily cap: 80 emails/day (Resend free = 100/day, keeping 20 buffer)
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ── Resend Setup ─────────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'NCLEX PrepPro <support@nclexprepro.com>';

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not set in .env — aborting');
  process.exit(1);
}

async function sendViaResend(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Resend error ${res.status}`);
  return data;
}

// ── Daily Email Counter ───────────────────────────────────────────────────────
const COUNTER_FILE = path.join(__dirname, '..', '..', '.openclaw', 'workspace', 'memory', 'email-counts.json');
const DAILY_LIMIT = 80; // Hard cap — Resend free allows 100/day, keeping 20 buffer
const ACCOUNT_KEY = 'nclex-resend';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
}

function getEmailCount() {
  try {
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
    return data[getTodayKey()]?.[ACCOUNT_KEY] || 0;
  } catch { return 0; }
}

function incrementEmailCount(n = 1) {
  const today = getTodayKey();
  let data = {};
  try { data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8')); } catch {}
  if (!data[today]) data[today] = {};
  data[today][ACCOUNT_KEY] = (data[today][ACCOUNT_KEY] || 0) + n;
  // Prune dates older than 14 days
  const cutoff = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  Object.keys(data).filter(k => k < cutoff).forEach(k => delete data[k]);
  try { fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2)); } catch {}
}

// ── DB ────────────────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const DISCOUNT_EXPIRY_HOURS = 48;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nclexprepro.com';

// ── Email Template ────────────────────────────────────────────────────────────
function getEmailHTML(name, score, expiryDate) {
  const firstName = name?.split(' ')[0] || 'there';
  let scoreNum = null;
  if (score !== null && score !== undefined) {
    if (typeof score === 'string' && score.includes('/')) {
      const parts = score.split('/');
      scoreNum = parts.length === 2 ? Math.round((parseInt(parts[0]) / parseInt(parts[1])) * 100) : null;
    } else if (!isNaN(score)) {
      scoreNum = Math.round((Number(score) / 10) * 100);
    }
  }
  const scorePercent = scoreNum !== null ? `${scoreNum}%` : null;
  const expiryStr = new Date(expiryDate).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: #1e3a5f; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 22px;">🎓 NCLEX PrepPro</h1>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">Hey ${firstName},</p>
      
      <p style="font-size: 16px; color: #333;">
        You completed the free 10-question sample earlier${scorePercent ? ` and scored <strong>${scorePercent}</strong>` : ''}.
        ${scorePercent ? (parseInt(scorePercent) >= 70 ? " That's a solid start." : " There's room to improve — and knowing where is half the battle.") : ''}
      </p>

      <p style="font-size: 16px; color: #333;">
        The full exam has <strong>497 questions</strong> across all 5 NCLEX categories — with detailed rationales 
        for every wrong answer so you know exactly what to study.
      </p>

      <!-- Discount Box -->
      <div style="background: #f0f7ff; border: 2px solid #1e3a5f; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Exclusive Offer</p>
        <p style="margin: 0 0 12px; font-size: 28px; font-weight: bold; color: #1e3a5f;">15% OFF</p>
        <div style="background: #1e3a5f; color: white; font-size: 22px; font-weight: bold; letter-spacing: 4px; padding: 10px 20px; border-radius: 6px; display: inline-block;">
          SAMPLE15
        </div>
        <p style="margin: 12px 0 0; font-size: 13px; color: #e74c3c;">
          ⏰ Expires ${expiryStr}
        </p>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${APP_URL}/?code=SAMPLE15" 
           style="background: #1e3a5f; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
          Get Full Access — $16.15 (reg. $19)
        </a>
      </div>

      <p style="font-size: 14px; color: #888; text-align: center;">
        One-time payment. No subscription. Instant access.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 15px; text-align: center;">
      <p style="font-size: 12px; color: #aaa; margin: 0;">
        NCLEX PrepPro · Milwaukee, WI<br>
        <a href="${APP_URL}/unsubscribe" style="color: #aaa;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function sendFollowUps() {
  console.log('📧 NCLEX Follow-Up Email Runner');
  console.log('================================');
  console.log(`📤 Sender: ${EMAIL_FROM}`);
  console.log(`🔑 Via:    Resend.com (not Gmail)`);

  // Daily cap check
  const todayCount = getEmailCount();
  const remaining = DAILY_LIMIT - todayCount;
  console.log(`📊 Daily cap: ${todayCount}/${DAILY_LIMIT} sent today (${remaining} remaining)\n`);

  if (remaining <= 0) {
    console.log(`⚠️  Daily email cap reached (${DAILY_LIMIT}/day). Skipping. Resets at midnight UTC.`);
    await pool.end();
    return;
  }

  const eligible = await pool.query(`
    SELECT id, name, email, score, completed_at
    FROM nclex_sample_users
    WHERE completed_at IS NOT NULL
      AND converted_to_paid = false
      AND completed_at < NOW() - INTERVAL '24 hours'
      AND (discount_sent_at IS NULL)
    LIMIT $1
  `, [remaining]); // Never fetch more than our remaining daily budget

  console.log(`Found ${eligible.rows.length} eligible users\n`);

  let sent = 0, failed = 0;

  for (const user of eligible.rows) {
    const expiryDate = new Date(Date.now() + DISCOUNT_EXPIRY_HOURS * 3600 * 1000);

    try {
      await sendViaResend(
        user.email,
        `${user.name?.split(' ')[0] || 'Hey'}, your 15% discount expires soon ⏰`,
        getEmailHTML(user.name, user.score, expiryDate)
      );

      // Mark as sent + store expiry
      await pool.query(`
        UPDATE nclex_sample_users 
        SET discount_sent_at = NOW(), discount_expires_at = $1 
        WHERE id = $2
      `, [expiryDate.toISOString(), user.id]);

      incrementEmailCount(1);
      console.log(`✅ Sent to ${user.email}`);
      sent++;
    } catch (err) {
      console.log(`❌ Failed ${user.email}: ${err.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 300)); // Small delay between sends
  }

  console.log(`\nDone — sent: ${sent}, failed: ${failed}`);
  console.log(`📊 Daily total now: ${getEmailCount()}/${DAILY_LIMIT}`);
  await pool.end();
}

sendFollowUps().catch(console.error);
