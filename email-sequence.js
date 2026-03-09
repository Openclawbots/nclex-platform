/**
 * 📧 NCLEX Email Sequence — 3-email nurture for sample non-converters
 * ====================================================================
 * Email 1 (2 hrs after sample):  Score summary + what they missed
 * Email 2 (24 hrs after sample): SAMPLE15 discount code — expires in 48hrs
 * Email 3 (72 hrs after sample): Final call — price increase warning
 *
 * Run via heartbeat every 6 hours
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nclexprepro.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BREVO_API_KEY  = process.env.BREVO_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'NCLEX PrepPro <support@nclexprepro.com>';

// ── Daily Email Cap (DB-backed — works on Railway + local) ──────────────────
const RESEND_LIMIT = 80;  // Resend free = 100/day, keep 20 buffer
const BREVO_LIMIT  = 280; // Brevo free = 300/day, shared across platforms, keep 20 buffer
const RESEND_ACCT  = 'nclex-resend';
const BREVO_ACCT   = 'brevo';

async function getCount(account) {
  const r = await pool.query(
    'SELECT count FROM email_daily_counts WHERE date=CURRENT_DATE AND account=$1',
    [account]
  );
  return r.rows[0]?.count || 0;
}

async function incrementCount(account) {
  await pool.query(`
    INSERT INTO email_daily_counts (date, account, count) VALUES (CURRENT_DATE, $1, 1)
    ON CONFLICT (date, account) DO UPDATE SET count = email_daily_counts.count + 1
  `, [account]);
}

// ── Senders ─────────────────────────────────────────────────────────────────
function parseFrom(from) {
  const m = (from || '').match(/^(.+?)\s*<(.+?)>$/);
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

// Smart send: Resend first → Brevo overflow → error
async function smartSend(to, subject, html) {
  const resendUsed = await getCount(RESEND_ACCT);
  const brevoUsed  = await getCount(BREVO_ACCT);

  if (resendUsed < RESEND_LIMIT) {
    await sendViaResend(to, subject, html);
    await incrementCount(RESEND_ACCT);
    return 'resend';
  } else if (BREVO_API_KEY && brevoUsed < BREVO_LIMIT) {
    await sendViaBrevo(to, subject, html);
    await incrementCount(BREVO_ACCT);
    return 'brevo';
  } else {
    throw new Error(`Daily limits reached — Resend: ${resendUsed}/${RESEND_LIMIT}, Brevo: ${brevoUsed}/${BREVO_LIMIT}`);
  }
}

function firstName(name) { return name?.split(' ')[0] || 'there'; }

function scoreToPercent(score) {
  if (score === null || score === undefined) return null;
  if (typeof score === 'string' && score.includes('/')) {
    const [a, b] = score.split('/').map(Number);
    return b > 0 ? Math.round((a / b) * 100) : null;
  }
  if (!isNaN(score)) return Math.round(Number(score));
  return null;
}

// ── Email 1: Score Summary (sent at 2 hours) ────────────────────────────────
function email1HTML(name, score) {
  const fn = firstName(name);
  const pct = scoreToPercent(score);
  const scoreDisplay = pct !== null ? `${pct}%` : 'your score';
  const gap = pct !== null ? Math.max(0, 75 - pct) : null;
  const message = gap !== null && gap > 0
    ? `You're <strong>${gap} percentage points</strong> away from the 75% passing threshold. The full bank shows you exactly where those points are hiding.`
    : pct >= 75
      ? `Great start! You hit the 75% threshold on the sample. Let's see if you can hold it across all 497 questions.`
      : `The full bank has detailed rationales for every question so you know exactly what to study.`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
  <div style="background:#1e3a5f;padding:30px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:22px;">🏥 NCLEX PrepPro</h1>
  </div>
  <div style="padding:30px;">
    <p style="font-size:16px;color:#333;">Hey ${fn},</p>
    <p style="font-size:16px;color:#333;">You just completed the free 10-question sample and scored <strong>${scoreDisplay}</strong>.</p>
    <p style="font-size:16px;color:#333;">${message}</p>
    <div style="background:#f0f7ff;border-left:4px solid #1e3a5f;padding:16px;margin:20px 0;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:15px;color:#1e3a5f;"><strong>What you get with full access:</strong></p>
      <ul style="margin:10px 0 0;padding-left:20px;color:#444;font-size:14px;line-height:1.8;">
        <li>497 NCLEX-style questions (vs. 10 in the sample)</li>
        <li>Full rationales for every single wrong answer</li>
        <li>Category breakdown: Med-Surg, Pharm, Safety, Prioritization, SATA</li>
        <li>Instant access — no subscription, one-time $19</li>
      </ul>
    </div>
    <div style="text-align:center;margin:25px 0;">
      <a href="${APP_URL}" style="background:#1e3a5f;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">
        Get Full Access — $19
      </a>
    </div>
    <p style="font-size:14px;color:#888;text-align:center;">One-time payment. No subscription. Instant access.</p>
  </div>
  <div style="background:#f5f5f5;padding:15px;text-align:center;">
    <p style="font-size:12px;color:#aaa;margin:0;">NCLEX PrepPro · Milwaukee, WI<br>
    <a href="${APP_URL}/unsubscribe" style="color:#aaa;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

// ── Email 2: SAMPLE15 Discount — 24 hours ───────────────────────────────────
function email2HTML(name, score, expiryDate) {
  const fn = firstName(name);
  const pct = scoreToPercent(score);
  const expiryStr = new Date(expiryDate).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
  <div style="background:#1e3a5f;padding:30px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:22px;">🏥 NCLEX PrepPro</h1>
  </div>
  <div style="padding:30px;">
    <p style="font-size:16px;color:#333;">Hey ${fn},</p>
    <p style="font-size:16px;color:#333;">
      You took our free sample ${pct !== null ? `and scored <strong>${pct}%</strong>` : ''} but haven't unlocked full access yet.
    </p>
    <p style="font-size:16px;color:#333;">Here's a 15% discount — just for sample users — expires <strong>${expiryStr}</strong>:</p>
    <div style="background:#f0f7ff;border:2px solid #1e3a5f;border-radius:8px;padding:20px;text-align:center;margin:25px 0;">
      <p style="margin:0 0 8px;font-size:14px;color:#666;text-transform:uppercase;letter-spacing:1px;">Your Discount Code</p>
      <p style="margin:0 0 12px;font-size:28px;font-weight:bold;color:#1e3a5f;">15% OFF</p>
      <div style="background:#1e3a5f;color:white;font-size:22px;font-weight:bold;letter-spacing:4px;padding:10px 20px;border-radius:6px;display:inline-block;">SAMPLE15</div>
      <p style="margin:12px 0 0;font-size:13px;color:#e74c3c;">⏰ Expires ${expiryStr}</p>
    </div>
    <div style="text-align:center;margin:25px 0;">
      <a href="${APP_URL}/?code=SAMPLE15" style="background:#1e3a5f;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">
        Get Full Access — $16.15 (reg. $19)
      </a>
    </div>
    <p style="font-size:14px;color:#888;text-align:center;">497 questions · Full rationales · One-time payment</p>
  </div>
  <div style="background:#f5f5f5;padding:15px;text-align:center;">
    <p style="font-size:12px;color:#aaa;margin:0;">NCLEX PrepPro · Milwaukee, WI<br>
    <a href="${APP_URL}/unsubscribe" style="color:#aaa;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

// ── Email 3: Last chance — 72 hours ─────────────────────────────────────────
function email3HTML(name, score) {
  const fn = firstName(name);
  const pct = scoreToPercent(score);
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
  <div style="background:#1e3a5f;padding:30px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:22px;">🏥 NCLEX PrepPro</h1>
  </div>
  <div style="padding:30px;">
    <p style="font-size:16px;color:#333;">Hey ${fn},</p>
    <p style="font-size:16px;color:#333;">Last email from us — promise.</p>
    <p style="font-size:16px;color:#333;">
      ${pct !== null && pct < 75
        ? `You scored <strong>${pct}%</strong> on the sample. That's ${75 - pct} points below the passing threshold. Every week you don't practice is a week closer to test day with the same gaps.`
        : `You scored well on the sample — but the NCLEX has 75–145 questions designed to find your weaknesses. The full practice bank is the only way to find them first.`}
    </p>
    <p style="font-size:16px;color:#333;">The NCLEX is one of the most stressful exams in nursing. $19 is nothing compared to failing and paying $200 to retake it.</p>
    <div style="text-align:center;margin:25px 0;">
      <a href="${APP_URL}" style="background:#c0392b;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">
        Start Practicing — $19
      </a>
    </div>
    <p style="font-size:14px;color:#888;text-align:center;">This is our last email. Whenever you're ready, we'll be here.</p>
  </div>
  <div style="background:#f5f5f5;padding:15px;text-align:center;">
    <p style="font-size:12px;color:#aaa;margin:0;">NCLEX PrepPro · Milwaukee, WI<br>
    <a href="${APP_URL}/unsubscribe" style="color:#aaa;">Unsubscribe</a></p>
  </div>
</div>
</body></html>`;
}

// ── Runner ───────────────────────────────────────────────────────────────────
async function runSequence() {
  console.log('📧 NCLEX Email Sequence Runner');
  console.log('================================');

  let sent = 0, failed = 0;

  // Print daily cap status at start
  const resendUsed = await getCount(RESEND_ACCT);
  const brevoUsed  = await getCount(BREVO_ACCT);
  const totalRemaining = Math.max(0, RESEND_LIMIT - resendUsed) + (BREVO_API_KEY ? Math.max(0, BREVO_LIMIT - brevoUsed) : 0);
  console.log(`📊 Resend: ${resendUsed}/${RESEND_LIMIT} | Brevo: ${brevoUsed}/${BREVO_LIMIT} | Remaining today: ${totalRemaining}\n`);

  if (totalRemaining <= 0) {
    console.log('⚠️  All daily limits reached. Skipping. Resets at midnight UTC.');
    await pool.end();
    return;
  }

  async function send(user, emailNum, subject, html) {
    // Skip test/example addresses
    if (!user.email || user.email.includes('@example.com') || user.email.includes('@verify.com')) {
      console.log(`⏭  Skip ${emailNum} → ${user.email} (test address)`);
      return true; // mark as sent so it doesn't keep retrying
    }
    try {
      const provider = await smartSend(user.email, subject, html);
      console.log(`✅ Email ${emailNum} → ${user.email} [${provider}]`);
      sent++;
      return true;
    } catch (err) {
      console.log(`❌ Email ${emailNum} → ${user.email}: ${err.message}`);
      failed++;
      return false;
    }
  }

  // ── Email 1: 2 hours after completion, no email sent yet ──────────────────
  const e1 = await pool.query(`
    SELECT id, name, email, score, completed_at FROM nclex_sample_users
    WHERE completed_at IS NOT NULL AND converted_to_paid = false
      AND completed_at < NOW() - INTERVAL '2 hours'
      AND email1_sent_at IS NULL
    LIMIT 50
  `);
  console.log(`Email 1 eligible: ${e1.rows.length}`);
  for (const u of e1.rows) {
    const ok = await send(u, 1, `Your NCLEX sample results — here's what you missed`, email1HTML(u.name, u.score));
    if (ok) await pool.query(`UPDATE nclex_sample_users SET email1_sent_at = NOW() WHERE id = $1`, [u.id]);
    await new Promise(r => setTimeout(r, 400));
  }

  // ── Email 2: 24 hours, discount code ──────────────────────────────────────
  const e2 = await pool.query(`
    SELECT id, name, email, score, completed_at FROM nclex_sample_users
    WHERE completed_at IS NOT NULL AND converted_to_paid = false
      AND completed_at < NOW() - INTERVAL '24 hours'
      AND email1_sent_at IS NOT NULL
      AND email2_sent_at IS NULL
    LIMIT 50
  `);
  console.log(`Email 2 eligible: ${e2.rows.length}`);
  for (const u of e2.rows) {
    const expiry = new Date(Date.now() + 48 * 3600 * 1000);
    const ok = await send(u, 2, `${firstName(u.name)}, your 15% discount expires soon ⏰`, email2HTML(u.name, u.score, expiry));
    if (ok) await pool.query(`UPDATE nclex_sample_users SET email2_sent_at = NOW(), discount_sent_at = NOW(), discount_expires_at = $1 WHERE id = $2`, [expiry.toISOString(), u.id]);
    await new Promise(r => setTimeout(r, 400));
  }

  // ── Email 3: 72 hours, last call ──────────────────────────────────────────
  const e3 = await pool.query(`
    SELECT id, name, email, score, completed_at FROM nclex_sample_users
    WHERE completed_at IS NOT NULL AND converted_to_paid = false
      AND completed_at < NOW() - INTERVAL '72 hours'
      AND email2_sent_at IS NOT NULL
      AND email3_sent_at IS NULL
    LIMIT 50
  `);
  console.log(`Email 3 eligible: ${e3.rows.length}`);
  for (const u of e3.rows) {
    const ok = await send(u, 3, `${firstName(u.name)} — last email from us`, email3HTML(u.name, u.score));
    if (ok) await pool.query(`UPDATE nclex_sample_users SET email3_sent_at = NOW() WHERE id = $1`, [u.id]);
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\nDone — sent: ${sent}, failed: ${failed}`);
  await pool.end();
}

runSequence().catch(console.error);
