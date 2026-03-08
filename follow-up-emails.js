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

// ── Email Providers ───────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BREVO_API_KEY  = process.env.BREVO_API_KEY;
const EMAIL_FROM     = process.env.EMAIL_FROM || 'NCLEX PrepPro <support@nclexprepro.com>';

// Parse "Name <email>" → { name, email }
function parseFrom(from) {
  const m = from.match(/^(.+?)\s*<(.+?)>$/);
  return m ? { name: m[1].trim(), email: m[2].trim() } : { name: 'NCLEX PrepPro', email: from };
}

async function sendViaResend(to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Resend error ${res.status}`);
  return data;
}

async function sendViaBrevo(to, subject, html) {
  const { name, email } = parseFrom(EMAIL_FROM);
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: { name, email }, to: [{ email: to }], subject, htmlContent: html }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Brevo error ${res.status}`);
  return data;
}

// ── Daily Email Counter ───────────────────────────────────────────────────────
const COUNTER_FILE  = path.join(__dirname, '..', '..', '.openclaw', 'workspace', 'memory', 'email-counts.json');
const RESEND_LIMIT  = 80;  // Resend free = 100/day, keep 20 buffer
const BREVO_LIMIT   = 280; // Brevo free = 300/day, keep 20 buffer
const RESEND_KEY    = 'nclex-resend';
const BREVO_KEY     = 'brevo';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
}

function getCount(key) {
  try {
    const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
    return data[getTodayKey()]?.[key] || 0;
  } catch { return 0; }
}

function incrementCount(key, n = 1) {
  const today = getTodayKey();
  let data = {};
  try { data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8')); } catch {}
  if (!data[today]) data[today] = {};
  data[today][key] = (data[today][key] || 0) + n;
  const cutoff = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  Object.keys(data).filter(k => k < cutoff).forEach(k => delete data[k]);
  try { fs.writeFileSync(COUNTER_FILE, JSON.stringify(data, null, 2)); } catch {}
}

// Smart send: Resend first → Brevo overflow → fail gracefully
async function smartSend(to, subject, html) {
  const resendUsed  = getCount(RESEND_KEY);
  const brevoUsed   = getCount(BREVO_KEY);

  if (resendUsed < RESEND_LIMIT) {
    await sendViaResend(to, subject, html);
    incrementCount(RESEND_KEY);
    return 'resend';
  } else if (BREVO_API_KEY && brevoUsed < BREVO_LIMIT) {
    await sendViaBrevo(to, subject, html);
    incrementCount(BREVO_KEY);
    return 'brevo';
  } else {
    throw new Error(`All daily limits reached — Resend: ${resendUsed}/${RESEND_LIMIT}, Brevo: ${brevoUsed}/${BREVO_LIMIT}`);
  }
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
  const resendUsed = getCount(RESEND_KEY);
  const brevoUsed  = getCount(BREVO_KEY);
  const totalRemaining = (RESEND_LIMIT - resendUsed) + (BREVO_API_KEY ? Math.max(0, BREVO_LIMIT - brevoUsed) : 0);
  console.log(`📊 Resend: ${resendUsed}/${RESEND_LIMIT} | Brevo: ${brevoUsed}/${BREVO_LIMIT} | Remaining today: ${totalRemaining}\n`);

  if (totalRemaining <= 0) {
    console.log(`⚠️  All daily limits reached. Skipping. Resets at midnight UTC.`);
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
  `, [totalRemaining]);

  console.log(`Found ${eligible.rows.length} eligible users\n`);

  let sent = 0, failed = 0;

  for (const user of eligible.rows) {
    const expiryDate = new Date(Date.now() + DISCOUNT_EXPIRY_HOURS * 3600 * 1000);

    try {
      const provider = await smartSend(
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

      console.log(`✅ Sent to ${user.email} [via ${provider}]`);
      sent++;
    } catch (err) {
      console.log(`❌ Failed ${user.email}: ${err.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 300)); // Small delay between sends
  }

  console.log(`\nDone — sent: ${sent}, failed: ${failed}`);
  console.log(`📊 Resend: ${getCount(RESEND_KEY)}/${RESEND_LIMIT} | Brevo: ${getCount(BREVO_KEY)}/${BREVO_LIMIT}`);
  await pool.end();
}

sendFollowUps().catch(console.error);
