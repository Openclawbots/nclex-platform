import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { v4 as uuidv4 } from 'uuid'
import { getPool, initDB } from '../../../lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    await initDB()
    const { name, email, promoCode, action } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    if (action === 'promo') {
      const code = promoCode?.toUpperCase()
      // NURSETEST = full free tester access
      if (code === 'NURSETEST') {
        const token = uuidv4()
        const pool = getPool()
        const result = await pool.query(
          'INSERT INTO nclex_users (name, email, type, access_token) VALUES ($1, $2, $3, $4) RETURNING id',
          [name, email, 'tester', token]
        )
        return NextResponse.json({ token, type: 'tester', userId: result.rows[0].id })
      }
      // SAMPLE15 = 15% off via Stripe checkout
      if (code === 'SAMPLE15') {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'NCLEX PrepPro — Full Practice Exam',
                description: '497 real-style NCLEX questions with detailed rationales',
              },
              unit_amount: 1615, // $16.15 = $19 × 0.85
            },
            quantity: 1,
          }],
          mode: 'payment',
          metadata: { name, email, promo: 'SAMPLE15' },
          success_url: `${appUrl}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appUrl}/?cancelled=1`,
          customer_email: email,
        })
        return NextResponse.json({ url: session.url })
      }
      return NextResponse.json({ error: 'Invalid promo code.' }, { status: 400 })
    }

    if (action === 'stripe') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
      // Optional discount for known promo codes passed via stripe action
      const unitAmount = promoCode?.toUpperCase() === 'SAMPLE15' ? 1615 : 1900
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'NCLEX PrepPro — Full Practice Exam',
              description: '497 real-style NCLEX questions with detailed rationales',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        metadata: { name, email, promo: promoCode || '' },
        success_url: `${appUrl}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/?cancelled=1`,
        customer_email: email,
      })
      return NextResponse.json({ url: session.url })
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
  } catch (e) {
    console.error('Access error:', e)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
