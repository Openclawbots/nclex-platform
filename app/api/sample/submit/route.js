import { NextResponse } from 'next/server'
import { getPool } from '../../../../lib/db'
import { sendResultsEmail } from '../../../../lib/results-email'

export async function POST(req) {
  try {
    const { sample_token, answers } = await req.json()

    if (!sample_token) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    const pool = getPool()
    const result = await pool.query(
      'SELECT * FROM nclex_sample_users WHERE sample_token = $1',
      [sample_token]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const sampleUser = result.rows[0]

    if (sampleUser.completed_at) {
      return NextResponse.json({ error: 'Already submitted' }, { status: 400 })
    }

    const questions = sampleUser.sample_questions
    const questionMap = {}
    questions.forEach(q => { questionMap[q.id] = q })

    let correct = 0
    const total = questions.length
    const results = {}
    const categoryStats = {}

    for (const q of questions) {
      const userAnswer = answers[q.id] ?? answers[String(q.id)]
      const cat = q.category
      if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 }
      categoryStats[cat].total++

      let isCorrect = false
      if (q.type === 'sata') {
        const correctArr = Array.isArray(q.correct) ? [...q.correct].sort() : [q.correct].sort()
        const userArr = Array.isArray(userAnswer) ? [...userAnswer].sort() : userAnswer ? [userAnswer].sort() : []
        isCorrect = JSON.stringify(correctArr) === JSON.stringify(userArr)
      } else {
        isCorrect = userAnswer === q.correct
      }

      if (isCorrect) {
        correct++
        categoryStats[cat].correct++
      }

      results[q.id] = {
        correct: isCorrect,
        userAnswer,
        correctAnswer: q.correct,
        rationale: isCorrect ? null : q.rationale, // Only show rationale for wrong answers
        question: q.question,
        choices: q.choices,
        category: q.category,
        type: q.type,
      }
    }

    const score = `${correct}/${total}`

    await pool.query(
      'UPDATE nclex_sample_users SET score = $1, completed_at = NOW() WHERE sample_token = $2',
      [score, sample_token]
    )

    // Send results email for sample (non-blocking)
    if (sampleUser.email) {
      const scoreNum = total > 0 ? (correct / total) * 100 : 0
      sendResultsEmail({
        name: sampleUser.name,
        email: sampleUser.email,
        score: scoreNum,
        correct,
        total,
        categoryStats,
        examType: 'sample',
      }).catch(err => console.error('Sample results email failed:', err.message))
    }

    return NextResponse.json({
      score,
      correct,
      total,
      results,
      categoryStats,
      email: sampleUser.email,
    })
  } catch (e) {
    console.error('Sample submit error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
