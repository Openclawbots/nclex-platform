'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ALL_CATEGORIES = [
  'Med-Surg',
  'Pharmacology',
  'Safety & Infection Control',
  'Prioritization & Delegation',
  'SATA',
]

export default function SampleResultsPage() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('sample_results')
    if (!raw) { router.push('/'); return }
    setData(JSON.parse(raw))
  }, [])

  // ── Direct Stripe checkout — no friction, email already known ──────────────
  async function handleDirectCheckout(promoApplied) {
    if (checkoutLoading) return
    setCheckoutLoading(true)
    setCheckoutError('')
    try {
      const name = data?.name || 'Student'
      const email = data?.email || ''
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          action: 'stripe',
          promoCode: promoApplied || null,
        }),
      })
      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
      } else {
        setCheckoutError(json.error || 'Checkout failed. Please try again.')
        setCheckoutLoading(false)
      }
    } catch (e) {
      setCheckoutError('Network error. Please try again.')
      setCheckoutLoading(false)
    }
  }

  // ── Promo code: NURSETEST = free, SAMPLE15 = discount ────────────────────
  async function handlePromo() {
    if (!promoCode.trim()) return
    setPromoLoading(true)
    setPromoError('')
    const code = promoCode.trim().toUpperCase()

    // SAMPLE15 → Stripe checkout at discounted price
    if (code === 'SAMPLE15') {
      await handleDirectCheckout('SAMPLE15')
      setPromoLoading(false)
      return
    }

    // NURSETEST → free access
    try {
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data?.name || '', email: data?.email || '', promoCode: code, action: 'promo' }),
      })
      const json = await res.json()
      if (json.token) {
        localStorage.setItem('nclex_token', json.token)
        localStorage.setItem('nclex_user_type', json.type)
        router.push('/test')
      } else {
        setPromoError(json.error || 'Invalid promo code.')
      }
    } catch (e) {
      setPromoError('Network error.')
    }
    setPromoLoading(false)
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    )
  }

  const { score, correct, total, results, categoryStats } = data
  // Defensive: handle score as "X/10" string or raw number
  const pct = typeof correct === 'number' && typeof total === 'number' && total > 0
    ? Math.round((correct / total) * 100)
    : typeof score === 'string' && score.includes('/')
      ? Math.round((parseInt(score.split('/')[0]) / parseInt(score.split('/')[1])) * 100)
      : 0
  const passed = pct >= 70
  const gap = 75 - pct

  const wrongAnswers = results ? Object.values(results).filter(r => !r.correct) : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-4 px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <span className="font-bold text-xl">NCLEX PrepPro</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Score Card */}
        <div className={`rounded-2xl shadow-xl overflow-hidden ${passed ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-[#1e3a5f] to-[#2a4f7c]'}`}>
          <div className="p-8 text-white text-center">
            <div className="text-sm font-semibold uppercase tracking-widest mb-2 opacity-80">Sample Exam Results</div>
            <div className="text-7xl font-bold mb-2">{pct}%</div>
            <div className="text-xl font-semibold mb-1">
              {correct ?? score} of {total ?? 10} correct
            </div>
            <div className="text-lg opacity-90 mt-2">
              {passed
                ? '🎉 Great start — now see if you can hold this across 497 questions'
                : gap > 0
                  ? `📚 You need ${gap} more percentage points to pass (75% threshold)`
                  : '📚 Keep practicing to hit the 75% passing threshold'}
            </div>
          </div>
        </div>

        {/* ── THE MONEY MOMENT — Primary CTA ── */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-[#1e3a5f] p-8">
          <div className="text-center mb-6">
            <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              ⚡ Limited Time — Most Students Buy Right After Their Sample
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
              {passed
                ? `You scored ${pct}% — can you hold it across all 497 questions?`
                : `You scored ${pct}%. The full bank shows exactly where you're losing points.`}
            </h2>
            <p className="text-gray-500 mb-2">
              497 NCLEX-style questions · Full rationales · All 5 categories · Instant access
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6">
              <span>✅ Med-Surg (100q)</span>
              <span>✅ Pharmacology (100q)</span>
              <span>✅ SATA (98q)</span>
            </div>
          </div>

          <button
            onClick={() => handleDirectCheckout(null)}
            disabled={checkoutLoading}
            className="w-full bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-bold py-5 rounded-xl text-xl transition-colors shadow-lg mb-3 disabled:opacity-60"
          >
            {checkoutLoading ? '⏳ Opening checkout...' : '💳 Get Full Access — $19'}
          </button>
          <p className="text-gray-400 text-sm text-center mb-6">
            One-time payment · No subscription · Instant access after checkout
          </p>

          {/* Social proof */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
            <div className="text-sm text-gray-600">
              🏥 Built for the <strong>new NCLEX-RN format</strong> · At-home testing now available · Questions modeled after official NCSBN blueprints
            </div>
          </div>

          {checkoutError && (
            <p className="text-red-600 text-sm text-center mb-4">{checkoutError}</p>
          )}

          {/* Promo code */}
          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3 text-center">Have a promo code? Use it here:</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g. SAMPLE15"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              />
              <button
                onClick={handlePromo}
                disabled={promoLoading || checkoutLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
              >
                {promoLoading ? '...' : 'Apply'}
              </button>
            </div>
            {promoError && <p className="text-red-600 text-sm mt-2 text-center">{promoError}</p>}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-1">Category Breakdown</h2>
          <p className="text-sm text-gray-400 mb-4">Your sample covered 1–2 questions per category. Full test has 100 per category.</p>
          <div className="space-y-3">
            {ALL_CATEGORIES.map(cat => {
              const stats = categoryStats?.[cat]
              if (stats) {
                const catPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
                return (
                  <div key={cat} className="flex items-center gap-4">
                    <div className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">{cat}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all ${catPct >= 70 ? 'bg-green-500' : 'bg-orange-400'}`}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                    <div className="w-24 text-right text-sm font-semibold">
                      {stats.correct}/{stats.total} ({catPct}%)
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={cat} className="flex items-center gap-4 opacity-50">
                    <div className="w-40 text-sm font-medium text-gray-400 flex-shrink-0">{cat}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div className="h-4 rounded-full bg-gray-300" style={{ width: '100%' }} />
                    </div>
                    <div className="w-24 text-right text-sm text-gray-400 flex items-center justify-end gap-1">
                      🔒 Locked
                    </div>
                  </div>
                )
              }
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">🔒 Full 100-question breakdown per category unlocks with full access.</p>
        </div>

        {/* Wrong Answers */}
        {wrongAnswers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-1">Where You Went Wrong</h2>
            <p className="text-gray-500 text-sm mb-5">Full rationales below — this is what full access looks like for all 497 questions.</p>
            <div className="space-y-6">
              {wrongAnswers.map((r, i) => (
                <div key={i} className="border border-red-100 rounded-xl p-5 bg-red-50">
                  <div className="text-xs font-semibold text-blue-600 uppercase mb-2">{r.category}</div>
                  <p className="font-medium text-gray-800 mb-3">{r.question}</p>
                  <div className="space-y-1 mb-3">
                    {r.choices && Object.entries(r.choices).map(([letter, text]) => {
                      const isUser = Array.isArray(r.userAnswer) ? r.userAnswer.includes(letter) : r.userAnswer === letter
                      const isCorrect = Array.isArray(r.correctAnswer) ? r.correctAnswer.includes(letter) : r.correctAnswer === letter
                      return (
                        <div key={letter} className={`px-3 py-2 rounded-lg text-sm ${
                          isCorrect ? 'bg-green-100 text-green-800 font-semibold border border-green-300'
                          : isUser ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-white text-gray-600'}`}>
                          {isCorrect ? '✅' : isUser ? '❌' : '○'} <strong>{letter}.</strong> {text}
                        </div>
                      )
                    })}
                  </div>
                  {r.rationale && (
                    <div className="bg-white border border-blue-100 rounded-lg p-3 text-sm text-gray-700">
                      <span className="font-semibold text-blue-700">Rationale: </span>{r.rationale}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {wrongAnswers.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-xl font-bold text-green-700">Perfect Score on the Sample!</div>
            <div className="text-green-600 mt-1">The full 497-question exam will really test you. Ready?</div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4f7c] rounded-2xl p-8 text-center text-white">
          <div className="text-2xl font-bold mb-2">Ready to see all 497 questions?</div>
          <p className="text-blue-200 mb-6">
            {pct < 75
              ? `You're ${gap} points away from passing. The full bank shows exactly where to focus.`
              : 'Great sample score. Prove it on the full exam.'}
          </p>
          <button
            onClick={() => handleDirectCheckout(null)}
            disabled={checkoutLoading}
            className="bg-white text-[#1e3a5f] font-bold py-4 px-12 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-60"
          >
            {checkoutLoading ? '⏳ Opening checkout...' : '💳 Get Full Access — $19'}
          </button>
          <p className="text-blue-300 text-sm mt-3">One-time · No subscription · Instant access</p>
        </div>

      </div>

      <footer className="bg-[#1e3a5f] text-blue-200 py-8 px-6 text-center text-sm mt-8">
        <p>© 2026 NCLEX PrepPro · Questions modeled after NCLEX-RN exam format · Not affiliated with NCSBN</p>
      </footer>
    </div>
  )
}
