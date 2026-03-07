'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [showWrong, setShowWrong] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [rating, setRating] = useState(0)
  const [helpful, setHelpful] = useState('')
  const [improve, setImprove] = useState('')
  const [wouldPay, setWouldPay] = useState(null)
  const [submittingFb, setSubmittingFb] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('nclex_results')
    if (!stored) { router.push('/'); return }
    setResults(JSON.parse(stored))
  }, [])

  async function submitFeedback() {
    const token = localStorage.getItem('nclex_token')
    setSubmittingFb(true)
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, rating, helpful, improve, wouldPay }),
    })
    setFeedbackSent(true)
    setSubmittingFb(false)
  }

  if (!results) return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading results...</div>
    </div>
  )

  const { score, correct, total, passed, results: questionResults, categoryStats, userType } = results
  const wrongQuestions = Object.values(questionResults || {}).filter(r => !r.correct)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">NCLEX PrepPro</div>
        <button onClick={() => { localStorage.clear(); router.push('/') }} className="text-sm bg-white text-[#1e3a5f] px-4 py-2 rounded-lg font-semibold">
          Start Over
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Score card */}
        <div className={`rounded-2xl shadow-xl p-8 text-white text-center mb-8 ${passed ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-[#1e3a5f] to-[#152d4a]'}`}>
          <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
          <div className="text-7xl font-bold mb-2">{score}%</div>
          <div className="text-2xl font-semibold mb-1">
            {passed ? 'Congratulations! You Passed!' : 'Keep Practicing'}
          </div>
          <div className="opacity-80 text-lg">
            {correct} of {total} questions correct
          </div>
          {passed
            ? <div className="mt-4 text-green-200">You met the 75% passing threshold. You're ready for the NCLEX!</div>
            : <div className="mt-4 opacity-80">You need 75% to pass. Review the rationales below and try again.</div>
          }
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-5">Score by Category</h2>
          <div className="space-y-4">
            {categoryStats && Object.entries(categoryStats).map(([cat, stat]) => {
              const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">{cat}</span>
                    <span className={pct >= 75 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                      {pct}% ({stat.correct}/{stat.total})
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${pct >= 75 ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Wrong questions */}
        {wrongQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1e3a5f]">
                Questions to Review ({wrongQuestions.length})
              </h2>
              <button
                onClick={() => setShowWrong(!showWrong)}
                className="text-[#1e3a5f] text-sm font-semibold underline hover:no-underline"
              >
                {showWrong ? 'Hide' : 'Show All'}
              </button>
            </div>
            {showWrong && (
              <div className="space-y-6">
                {wrongQuestions.map((r, i) => (
                  <div key={i} className="border border-red-100 bg-red-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-semibold">{r.category}</span>
                      <span className="text-red-500 text-sm font-semibold">✗ Incorrect</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-3">{r.question}</p>
                    <div className="text-sm space-y-1 mb-3">
                      <div className="text-red-600">Your answer: <strong>{r.userAnswer}</strong></div>
                      <div className="text-green-700">Correct answer: <strong>{Array.isArray(r.correctAnswer) ? r.correctAnswer.join(', ') : r.correctAnswer}</strong></div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                      <span className="font-semibold text-[#1e3a5f]">Rationale: </span>{r.rationale}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tester feedback */}
        {userType === 'tester' && !feedbackSent && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border-2 border-blue-200">
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">📝 Tester Feedback</h2>
            <p className="text-gray-500 text-sm mb-6">You're using this as a tester. Your feedback helps improve this product!</p>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)}
                    className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">What was most helpful?</label>
              <textarea
                value={helpful}
                onChange={e => setHelpful(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] h-24"
                placeholder="e.g. The rationales were really clear..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">What would you improve?</label>
              <textarea
                value={improve}
                onChange={e => setImprove(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] h-24"
                placeholder="e.g. I'd love more SATA questions..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Would you pay $19 for this?</label>
              <div className="flex gap-3">
                <button onClick={() => setWouldPay(true)}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-colors ${wouldPay === true ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 text-gray-600 hover:border-green-400'}`}>
                  ✅ Yes
                </button>
                <button onClick={() => setWouldPay(false)}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition-colors ${wouldPay === false ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-300 text-gray-600 hover:border-red-300'}`}>
                  ❌ No
                </button>
              </div>
            </div>

            <button
              onClick={submitFeedback}
              disabled={submittingFb || rating === 0}
              className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {submittingFb ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        )}

        {feedbackSent && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-8">
            <div className="text-3xl mb-2">🙏</div>
            <div className="text-green-800 font-bold text-lg">Thank you for your feedback!</div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => { localStorage.clear(); router.push('/') }}
            className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
