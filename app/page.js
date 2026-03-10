'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [showPromo, setShowPromo] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Free sample modal state
  const [showSampleModal, setShowSampleModal] = useState(false)
  const [sampleName, setSampleName] = useState('')
  const [sampleEmail, setSampleEmail] = useState('')
  const [sampleLoading, setSampleLoading] = useState(false)
  const [sampleError, setSampleError] = useState('')

  async function handleStartSample() {
    if (!sampleEmail.trim()) {
      setSampleError('Please enter your email to continue.')
      return
    }
    setSampleError('')
    setSampleLoading(true)
    try {
      const res = await fetch('/api/sample/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sampleName, email: sampleEmail }),
      })
      const data = await res.json()
      if (data.sample_token) {
        sessionStorage.setItem('sample_token', data.sample_token)
        sessionStorage.setItem('sample_questions', JSON.stringify(data.questions))
        router.push('/sample')
      } else {
        setSampleError(data.error || 'Something went wrong.')
      }
    } catch (e) {
      setSampleError('Network error. Please try again.')
    }
    setSampleLoading(false)
  }

  async function handlePayment() {
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, action: 'stripe' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  async function handlePromo() {
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    if (!promoCode.trim()) {
      setError('Please enter a promo code.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, promoCode, action: 'promo' }),
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('nclex_token', data.token)
        localStorage.setItem('nclex_user_type', data.type)
        window.location.href = '/test'
      } else {
        setError(data.error || 'Invalid promo code.')
      }
    } catch (e) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-4 px-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🏥</span>
          <span className="font-bold text-xl tracking-tight">NCLEX PrepPro</span>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4f7c] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="inline-block bg-purple-500 bg-opacity-90 text-white text-xs font-bold px-4 py-1.5 rounded-full">🎯 #1 NGN Case Study Bank Under $20</span>
            <span className="inline-block bg-blue-400 bg-opacity-30 text-blue-100 text-xs font-semibold px-4 py-1.5 rounded-full">✅ Updated for April 2026 Test Plan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            The Most Complete NGN Prep<br />
            <span className="text-blue-300">at Any Price Under $50.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto">
            667 questions including <strong>20 full NGN clinical case studies</strong> — the exact format used on the real NCLEX exam. Bow-tie, trend analysis, matrix, extended response, and cloze questions. All mapped to the NCSBN Clinical Judgment Measurement Model (CJMM).
          </p>
          <p className="text-blue-200 text-sm mb-10 max-w-xl mx-auto">
            UWorld has more questions. We have the same NGN formats — for $19 one-time instead of $349/year.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {[
              { num: '667', label: 'Practice Questions' },
              { num: 'NGN', label: 'Format Included' },
              { num: '7', label: 'Categories Covered' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-bold text-blue-300">{s.num}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Form */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-[#1e3a5f] text-white p-6 text-center">
              <div className="text-3xl font-bold">$19</div>
              <div className="text-blue-200 text-sm mt-1">One-time payment • Instant access</div>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@nursing.edu"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-gray-900"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-60"
              >
                {loading ? 'Processing...' : '💳 $19 — Start Practice Exam'}
              </button>

              <button
                onClick={() => { setSampleError(''); setShowSampleModal(true) }}
                className="w-full border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-blue-50 font-bold py-3 rounded-xl text-base transition-colors mt-3"
              >
                🎯 Try 10 Free Questions — No Payment Required
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => setShowPromo(!showPromo)}
                  className="text-[#1e3a5f] text-sm underline hover:no-underline"
                >
                  I have a promo code
                </button>
              </div>

              {showPromo && (
                <div className="mt-4 border-t pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-gray-900"
                    />
                    <button
                      onClick={handlePromo}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>🔒 Secure payment</span>
                <span>•</span>
                <span>Powered by Stripe</span>
                <span>•</span>
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility bar */}
      <div className="bg-white border-y border-gray-100 py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
          <span>🏆 <strong className="text-gray-700">20 Full NGN Case Studies</strong> — same format as the real exam</span>
          <span className="hidden md:inline text-gray-200">|</span>
          <span>📋 <strong className="text-gray-700">CJMM-Aligned</strong> — mapped to NCSBN framework</span>
          <span className="hidden md:inline text-gray-200">|</span>
          <span>✅ <strong className="text-gray-700">April 2026</strong> test plan updated</span>
          <span className="hidden md:inline text-gray-200">|</span>
          <span>🏫 <a href="/schools" className="text-[#1e3a5f] font-semibold hover:underline">For Nursing Programs →</a></span>
        </div>
      </div>

      {/* NGN Case Studies Section */}
      <section className="py-16 px-6 bg-blue-50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">NEW — April 2026 Aligned</div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">20 Full NGN Clinical Case Studies</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">The real NCLEX now includes unfolding case studies — one patient scenario with 6 linked clinical judgment questions. We have 20 complete cases covering the highest-yield NCLEX scenarios.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {['Hip Replacement','Sepsis / SIRS','Diabetic Ketoacidosis','Heart Failure','Acute Stroke / tPA','Pediatric Asthma','Acute Kidney Injury','Postpartum Hemorrhage','Suicidal Patient','Pneumonia + DNI Ethics','Hypertensive Crisis','Acute Pancreatitis','Pediatric Meningitis','Post-Cardiac Cath','Alcohol Withdrawal / DTs','Thyroid Storm','COPD Exacerbation','Burns + Parkland Formula','Sickle Cell / ACS','Pulmonary Embolism'].map(c => (
              <div key={c} className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs text-[#1e3a5f] font-medium text-center shadow-sm">{c}</div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            {[
              { icon: '🎯', name: 'Bow-Tie', desc: 'Condition + Actions + Parameters' },
              { icon: '📊', name: 'Trend Analysis', desc: 'Interpret changing clinical data' },
              { icon: '☑️', name: 'Extended Response', desc: 'Select all that apply — NGN style' },
              { icon: '📝', name: 'Cloze / Drop-Down', desc: 'Complete clinical statements' },
              { icon: '⚖️', name: 'Matrix / Grid', desc: 'Indicated vs. Contraindicated' },
              { icon: '⚡', name: 'Priority Action', desc: 'What do you do FIRST?' },
            ].map(f => (
              <div key={f.name} className="bg-white border border-blue-100 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="font-bold text-[#1e3a5f] text-sm">{f.name}</div>
                <div className="text-gray-500 text-xs mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1e3a5f] text-center mb-2">667 Questions Across 7 Categories</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Mapped to the NCSBN Clinical Judgment Measurement Model (CJMM) and April 2026 test plan</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🫀', name: 'Med-Surg', desc: '100 questions' },
              { icon: '💊', name: 'Pharmacology', desc: '100 questions' },
              { icon: '🛡️', name: 'Safety', desc: '100 questions' },
              { icon: '📋', name: 'Prioritization', desc: '99 questions' },
              { icon: '✅', name: 'SATA', desc: '98 questions' },
              { icon: '🏥', name: 'NGN Case Studies', desc: '120 questions — 20 cases' },
              { icon: '⚖️', name: 'NGN Clinical Judgment', desc: '50 standalone questions' },
            ].map(cat => (
              <div key={cat.name} className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-bold text-[#1e3a5f]">{cat.name}</div>
                <div className="text-gray-500 text-xs mt-1">{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-blue-200 py-8 px-6 text-center text-sm">
        <p>© 2026 NCLEX PrepPro · Questions modeled after NCLEX-RN exam format · Not affiliated with NCSBN</p>
      </footer>

      {/* Free Sample Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎯</div>
              <h2 className="text-2xl font-bold text-[#1e3a5f]">Try 10 Free Questions</h2>
              <p className="text-gray-500 text-sm mt-1">10 questions across categories • 10-minute timer • Free rationales on wrong answers</p>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={sampleName}
                  onChange={e => setSampleName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={sampleEmail}
                  onChange={e => setSampleEmail(e.target.value)}
                  placeholder="jane@nursing.edu"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-gray-900"
                  onKeyDown={e => e.key === 'Enter' && handleStartSample()}
                />
              </div>
            </div>

            {sampleError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                {sampleError}
              </div>
            )}

            <button
              onClick={handleStartSample}
              disabled={sampleLoading}
              className="w-full bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-60"
            >
              {sampleLoading ? 'Starting...' : '🚀 Start Free Sample'}
            </button>

            <button
              onClick={() => setShowSampleModal(false)}
              className="w-full text-gray-400 hover:text-gray-600 text-sm mt-3 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
