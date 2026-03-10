import { NextResponse } from 'next/server'
import { getPool } from '../../../lib/db'
import fs from 'fs'
import path from 'path'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = getPool()
    const result = await pool.query('SELECT id, type FROM nclex_users WHERE access_token = $1', [token])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Load questions server-side and strip correct answers before sending
    const questionsPath = path.join(process.cwd(), 'nclex-questions.json')
    const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))

    // Shuffle questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)

    // Strip correct answers and rationale from client-side data
    // Include NGN metadata so UI can render badges, multi-select, and scenarios
    const clientQuestions = shuffled.map(q => ({
      id: q.id,
      category: q.category,
      type: q.type,
      question: q.question,
      choices: q.choices,
      // NGN fields — required for correct rendering
      ...(q.ngn && { ngn: q.ngn, ngn_type: q.ngn_type }),
      ...(q.scenario && { scenario: q.scenario }),
      ...(q.case_id && { case_id: q.case_id }),
    }))

    return NextResponse.json({ questions: clientQuestions, userType: result.rows[0].type })
  } catch (e) {
    console.error('Questions error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
