import { NextResponse } from 'next/server'
import { getPool } from '../../../../lib/db'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const password = searchParams.get('password')

    if (password !== 'DariusAdmin2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pool = getPool()

    const totalUsers = await pool.query('SELECT COUNT(*) FROM nclex_users')
    const paidUsers = await pool.query("SELECT COUNT(*) FROM nclex_users WHERE type = 'paid'")
    const testerUsers = await pool.query("SELECT COUNT(*) FROM nclex_users WHERE type = 'tester'")
    const avgScore = await pool.query('SELECT AVG(score) FROM nclex_attempts WHERE score IS NOT NULL')
    const feedbackCount = await pool.query('SELECT COUNT(*) FROM nclex_feedback')

    // Sample user stats
    const sampleUsersCount = await pool.query('SELECT COUNT(*) FROM nclex_sample_users')
    const sampleCompleted = await pool.query('SELECT COUNT(*) FROM nclex_sample_users WHERE completed_at IS NOT NULL')
    const sampleConverted = await pool.query('SELECT COUNT(*) FROM nclex_sample_users WHERE converted_to_paid = TRUE')

    const users = await pool.query(`
      SELECT u.id, u.name, u.email, u.type, u.created_at,
             a.score, a.completed_at
      FROM nclex_users u
      LEFT JOIN nclex_attempts a ON a.user_id = u.id
      ORDER BY u.created_at DESC
    `)

    const feedback = await pool.query(`
      SELECT f.*, u.name, u.email
      FROM nclex_feedback f
      JOIN nclex_users u ON u.id = f.user_id
      ORDER BY f.created_at DESC
    `)

    const sampleUsers = await pool.query(`
      SELECT id, name, email, score, completed_at, converted_to_paid, created_at
      FROM nclex_sample_users
      ORDER BY created_at DESC
      LIMIT 100
    `)

    const totalSample = parseInt(sampleUsersCount.rows[0].count)
    const totalConverted = parseInt(sampleConverted.rows[0].count)
    const conversionRate = totalSample > 0 ? ((totalConverted / totalSample) * 100).toFixed(1) : '0.0'

    return NextResponse.json({
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        paidUsers: parseInt(paidUsers.rows[0].count),
        testerUsers: parseInt(testerUsers.rows[0].count),
        avgScore: avgScore.rows[0].avg ? parseFloat(avgScore.rows[0].avg).toFixed(1) : null,
        feedbackCount: parseInt(feedbackCount.rows[0].count),
        sampleUsers: totalSample,
        sampleCompleted: parseInt(sampleCompleted.rows[0].count),
        sampleConverted: totalConverted,
        sampleConversionRate: conversionRate,
      },
      users: users.rows,
      feedback: feedback.rows,
      sampleUsers: sampleUsers.rows,
    })
  } catch (e) {
    console.error('Admin stats error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
