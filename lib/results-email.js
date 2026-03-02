import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

const CATEGORY_COLORS = {
  'Med-Surg': '#3B82F6',
  'Pharmacology': '#8B5CF6',
  'Safety & Infection Control': '#10B981',
  'Prioritization': '#F59E0B',
  'SATA': '#EF4444',
}

const CATEGORY_TIPS = {
  'Med-Surg': 'Review common disease processes (heart failure, COPD, diabetes) and their nursing interventions. Focus on assessment findings that signal deterioration.',
  'Pharmacology': 'Use mnemonics for drug classes. For each drug: know the mechanism, side effects, and critical nursing considerations (especially narrow therapeutic index drugs).',
  'Safety & Infection Control': 'Memorize the hierarchy of infection control (Standard > Transmission-based) and RACE/PASS for fire safety. These questions are often free points.',
  'Prioritization': 'Apply ABC (Airway, Breathing, Circulation) and Maslow\'s hierarchy. Unstable patients always come before stable ones. When in doubt — who could die first?',
  'SATA': 'For Select All That Apply, treat each option as a True/False question independently. Never select an answer just because it "sounds right" — verify each one.',
}

function getScoreMessage(score) {
  if (score >= 85) return { emoji: '🏆', headline: 'Outstanding performance!', body: "You're well above the passing threshold. One more focused review session and you'll be fully ready for test day." }
  if (score >= 75) return { emoji: '✅', headline: "You're in passing range!", body: "You hit the NCLEX passing benchmark. Keep reinforcing your weak categories and you'll go in confident." }
  if (score >= 60) return { emoji: '📈', headline: "You're getting close.", body: "A focused 2-week study sprint targeting your weak areas could move you into passing range. You've got this." }
  return { emoji: '💪', headline: "Every expert started here.", body: "Your results show exactly where to focus. Use this breakdown as your study roadmap — targeted practice is how you improve fast." }
}

function buildCategoryChart(categoryStats) {
  const sorted = Object.entries(categoryStats).sort((a, b) => {
    const pctA = a[1].total > 0 ? (a[1].correct / a[1].total) * 100 : 0
    const pctB = b[1].total > 0 ? (b[1].correct / b[1].total) * 100 : 0
    return pctB - pctA
  })

  return sorted.map(([cat, stats]) => {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    const color = CATEGORY_COLORS[cat] || '#6B7280'
    return `
      <tr>
        <td style="padding: 8px 0; font-size: 14px; color: #374151; width: 180px; vertical-align: middle;">${cat}</td>
        <td style="padding: 8px 0; vertical-align: middle;">
          <div style="background: #F3F4F6; border-radius: 4px; height: 20px; width: 100%; max-width: 200px; display: inline-block;">
            <div style="background: ${color}; width: ${pct}%; height: 20px; border-radius: 4px; min-width: 4px;"></div>
          </div>
        </td>
        <td style="padding: 8px 0 8px 12px; font-size: 14px; font-weight: 600; color: ${color}; white-space: nowrap; vertical-align: middle;">${pct}% (${stats.correct}/${stats.total})</td>
      </tr>`
  }).join('')
}

function getTopImprovements(categoryStats) {
  return Object.entries(categoryStats)
    .map(([cat, stats]) => ({
      cat,
      pct: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      stats,
    }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3)
}

export async function sendResultsEmail({ name, email, score, correct, total, categoryStats, examType = 'full' }) {
  const pct = Math.round(score * 10) / 10
  const msg = getScoreMessage(pct)
  const improvements = getTopImprovements(categoryStats)
  const chartRows = buildCategoryChart(categoryStats)
  const isRetake = examType === 'full'

  const improvementBlocks = improvements.map((item, i) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #F3F4F6;">
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <span style="font-size: 20px; line-height: 1;">${['1️⃣','2️⃣','3️⃣'][i]}</span>
          <div>
            <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px;">${item.cat} — ${Math.round(item.pct)}%</div>
            <div style="font-size: 14px; color: #6B7280; line-height: 1.5;">${CATEGORY_TIPS[item.cat] || 'Review core concepts and practice additional questions in this category.'}</div>
          </div>
        </div>
      </td>
    </tr>`).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #F9FAFB; padding: 32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

        <!-- Header -->
        <tr><td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
          <div style="font-size: 28px; font-weight: 800; color: white; margin-bottom: 4px;">NCLEX PrepPro</div>
          <div style="font-size: 14px; color: #BFDBFE;">nclexprepro.com</div>
        </td></tr>

        <!-- Score Hero -->
        <tr><td style="background: white; padding: 32px; text-align: center; border-bottom: 2px solid #F3F4F6;">
          <div style="font-size: 48px; margin-bottom: 8px;">${msg.emoji}</div>
          <div style="font-size: 64px; font-weight: 900; color: ${pct >= 75 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444'}; line-height: 1;">${pct}%</div>
          <div style="font-size: 18px; color: #6B7280; margin: 8px 0;">${correct} correct out of ${total} questions</div>
          <div style="font-size: 22px; font-weight: 700; color: #111827; margin: 16px 0 8px;">${msg.headline}</div>
          <div style="font-size: 15px; color: #6B7280; line-height: 1.6; max-width: 420px; margin: 0 auto;">Hi ${name || 'there'}, ${msg.body}</div>
        </td></tr>

        <!-- Category Breakdown -->
        <tr><td style="background: white; padding: 28px 32px; border-bottom: 2px solid #F3F4F6;">
          <div style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px;">📊 Category Breakdown</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${chartRows}
          </table>
        </td></tr>

        <!-- Top 3 Improvements -->
        <tr><td style="background: white; padding: 28px 32px; border-bottom: 2px solid #F3F4F6;">
          <div style="font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px;">🎯 Your Top 3 Focus Areas</div>
          <div style="font-size: 14px; color: #6B7280; margin-bottom: 16px;">Based on your results, prioritize these categories:</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${improvementBlocks}
          </table>
        </td></tr>

        <!-- CTA -->
        ${isRetake ? `
        <tr><td style="background: #EFF6FF; padding: 28px 32px; border-radius: 0 0 12px 12px; text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: #1E3A8A; margin-bottom: 8px;">Ready to retake?</div>
          <div style="font-size: 14px; color: #3B82F6; margin-bottom: 20px;">Practice builds confidence. Your next attempt will be better.</div>
          <a href="https://nclexprepro.com" style="display: inline-block; background: #2563EB; color: white; font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none;">Retake Full Exam — $19</a>
          <div style="font-size: 13px; color: #9CA3AF; margin-top: 16px;">One-time access • 497 questions • All 5 NCLEX categories</div>
        </td></tr>` : `
        <tr><td style="background: #EFF6FF; padding: 28px 32px; border-radius: 0 0 12px 12px; text-align: center;">
          <div style="font-size: 16px; font-weight: 700; color: #1E3A8A; margin-bottom: 8px;">Want the full 497-question exam?</div>
          <div style="font-size: 14px; color: #3B82F6; margin-bottom: 20px;">You just completed the free sample. Get the full exam for complete prep.</div>
          <a href="https://nclexprepro.com" style="display: inline-block; background: #2563EB; color: white; font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 8px; text-decoration: none;">Get Full Access — $19</a>
          <div style="font-size: 13px; color: #9CA3AF; margin-top: 16px;">One-time access • 497 questions • All 5 NCLEX categories</div>
        </td></tr>`}

        <!-- Footer -->
        <tr><td style="padding: 20px; text-align: center;">
          <div style="font-size: 12px; color: #9CA3AF;">NCLEX PrepPro · nclexprepro.com</div>
          <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">Questions? Reply to this email.</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await transporter.sendMail({
    from: '"NCLEX PrepPro" <wisconsinfilingservice@gmail.com>',
    to: email,
    subject: `Your NCLEX Results: ${pct}% — ${msg.headline}`,
    html,
  })

  return true
}
