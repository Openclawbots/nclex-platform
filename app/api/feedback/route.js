import { NextResponse } from 'next/server'
import { getPool } from '../../../lib/db'

export async function POST(req) {
  try {
    const { token, rating, helpful, improve, wouldPay } = await req.json()

    const pool = getPool()
    const userResult = await pool.query('SELECT id, type FROM nclex_users WHERE access_token = $1', [token])
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = userResult.rows[0]
    if (user.type !== 'tester') {
      return NextResponse.json({ error: 'Feedback only for testers.' }, { status: 403 })
    }

    await pool.query(
      'INSERT INTO nclex_feedback (user_id, rating, helpful, improve, would_pay) VALUES ($1, $2, $3, $4, $5)',
      [user.id, rating, helpful, improve, wouldPay]
    )

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Feedback error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
