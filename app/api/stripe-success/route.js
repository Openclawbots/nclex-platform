import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { v4 as uuidv4 } from 'uuid'
import { getPool, initDB } from '../../../lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function GET(req) {
  try {
    await initDB()
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.redirect(new URL('/?error=payment_failed', req.url))
    }

    const name = session.metadata?.name || 'Student'
    const email = session.customer_email || session.metadata?.email
    const token = uuidv4()

    const pool = getPool()
    await pool.query(
      'INSERT INTO nclex_users (name, email, type, access_token) VALUES ($1, $2, $3, $4) ON CONFLICT (access_token) DO NOTHING',
      [name, email, 'paid', token]
    )

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const redirectUrl = new URL('/test', appUrl)
    redirectUrl.searchParams.set('token', token)
    redirectUrl.searchParams.set('type', 'paid')
    return NextResponse.redirect(redirectUrl)
  } catch (e) {
    console.error('Stripe success error:', e)
    return NextResponse.redirect(new URL('/?error=server', req.url))
  }
}
