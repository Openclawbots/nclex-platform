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

    // Load questions: 8 traditional + 2 NGN = 10 total
    const questionsPath = path.join(process.cwd(), 'nclex-questions.json')
    const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))

    // 8 traditional questions: 1-2 from each of 5 categories (total 8)
    const traditionalCategories = [
      { name: 'Med-Surg', count: 2 },
      { name: 'Pharmacology', count: 2 },
      { name: 'Safety & Infection Control', count: 2 },
      { name: 'Prioritization & Delegation', count: 1 },
      { name: 'SATA', count: 1 },
    ]

    const selected = []
    for (const cat of traditionalCategories) {
      const catQuestions = allQuestions.filter(q => q.category === cat.name && !q.ngn)
      const shuffled = catQuestions.sort(() => Math.random() - 0.5)
      selected.push(...shuffled.slice(0, cat.count))
    }

    // 2 NGN questions — standalone only (NGN - Clinical Judgment), NOT case study questions
    // Case study questions lack scenario context when pulled in isolation
    const ngnQuestions = allQuestions.filter(q => q.ngn === true && q.category === 'NGN - Clinical Judgment')
    const shuffledNgn = ngnQuestions.sort(() => Math.random() - 0.5)
    selected.push(...shuffledNgn.slice(0, 2))

    // Shuffle the final selection so NGN questions aren't always at the end
    selected.sort(() => Math.random() - 0.5)

    // Store full questions (with answers) server-side
    const sample_token = randomUUID()
    const pool = getPool()

    await pool.query(
      'INSERT INTO nclex_sample_users (name, email, sample_token, sample_questions, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [name?.trim() || null, email.trim().toLowerCase(), sample_token, JSON.stringify(selected)]
    )

    // Return questions WITHOUT correct answers, but WITH ngn fields for UI rendering
    const clientQuestions = selected.map(q => ({
      id: q.id,
      category: q.category,
      type: q.type,
      question: q.question,
      choices: q.choices,
      ngn: q.ngn || false,
      ngn_type: q.ngn_type || null,
      scenario: q.scenario || null,
      case_id: q.case_id || null,
    }))

    return NextResponse.json({ sample_token, questions: clientQuestions })
  } catch (e) {
    console.error('Sample start error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
