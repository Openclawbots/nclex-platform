import { NextResponse } from 'next/server'
import { getPool, initDB } from '../../../../lib/db'
import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  try {
    await initDB()
    const { name, email } = await req.json()

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Load questions and pick 2 from each category
    const questionsPath = path.join(process.cwd(), 'nclex-questions.json')
    const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))

    const categories = [
      'Med-Surg',
      'Pharmacology',
      'Safety & Infection Control',
      'Prioritization & Delegation',
      'SATA',
    ]

    const selected = []
    for (const cat of categories) {
      const catQuestions = allQuestions.filter(q => q.category === cat)
      const shuffled = catQuestions.sort(() => Math.random() - 0.5)
      selected.push(...shuffled.slice(0, 2))
    }

    // Store full questions (with answers) server-side
    const sample_token = randomUUID()
    const pool = getPool()

    await pool.query(
      'INSERT INTO nclex_sample_users (name, email, sample_token, sample_questions, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [name?.trim() || null, email.trim().toLowerCase(), sample_token, JSON.stringify(selected)]
    )

    // Return questions WITHOUT correct answers
    const clientQuestions = selected.map(q => ({
      id: q.id,
      category: q.category,
      type: q.type,
      question: q.question,
      choices: q.choices,
    }))

    return NextResponse.json({ sample_token, questions: clientQuestions })
  } catch (e) {
    console.error('Sample start error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
