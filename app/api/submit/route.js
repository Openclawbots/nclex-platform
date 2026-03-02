import { NextResponse } from 'next/server'
import { getPool } from '../../../lib/db'
import { sendResultsEmail } from '../../../lib/results-email'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    const { token, answers, startedAt } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = getPool()
    const userResult = await pool.query('SELECT id, type FROM nclex_users WHERE access_token = $1', [token])
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = userResult.rows[0]

    // Load questions for grading (server-side only)
    const questionsPath = path.join(process.cwd(), 'nclex-questions.json')
    const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))
    const questionMap = {}
    allQuestions.forEach(q => { questionMap[q.id] = q })

    // Grade answers
    let correct = 0
    const total = Object.keys(answers).length
    const results = {}
    const categoryStats = {}

    for (const [qId, userAnswer] of Object.entries(answers)) {
      const q = questionMap[parseInt(qId)]
      if (!q) continue

      const cat = q.category
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 }
      categoryStats[cat].total++

      let isCorrect = false
      if (q.type === 'sata') {
        // SATA: userAnswer is array, correct is array
        const correctArr = Array.isArray(q.correct) ? q.correct.sort() : [q.correct].sort()
        const userArr = Array.isArray(userAnswer) ? userAnswer.sort() : [userAnswer].sort()
        isCorrect = JSON.stringify(correctArr) === JSON.stringify(userArr)
      } else {
        isCorrect = userAnswer === q.correct
      }

      if (isCorrect) {
        correct++
        categoryStats[cat].correct++
      }

      results[qId] = {
        correct: isCorrect,
        userAnswer,
        correctAnswer: q.correct,
        rationale: q.rationale,
        question: q.question,
        choices: q.choices,
        category: q.category,
        type: q.type,
      }
    }

    const score = total > 0 ? (correct / total) * 100 : 0
    const passed = score >= 75

    // Save attempt to DB
    await pool.query(
      'INSERT INTO nclex_attempts (user_id, started_at, completed_at, score, answers) VALUES ($1, $2, NOW(), $3, $4)',
      [user.id, startedAt || new Date().toISOString(), score, JSON.stringify(answers)]
    )

    // Send results email (non-blocking — don't fail the response if email fails)
    const userEmailResult = await pool.query('SELECT name, email FROM nclex_users WHERE id = $1', [user.id])
    if (userEmailResult.rows.length > 0) {
      const { name, email } = userEmailResult.rows[0]
      if (email) {
        sendResultsEmail({
          name,
          email,
          score,
          correct,
          total,
          categoryStats,
          examType: 'full',
        }).catch(err => console.error('Results email failed:', err.message))
      }
    }

    return NextResponse.json({
      score: Math.round(score * 10) / 10,
      correct,
      total,
      passed,
      results,
      categoryStats,
      userType: user.type,
    })
  } catch (e) {
    console.error('Submit error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
