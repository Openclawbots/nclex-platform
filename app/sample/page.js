'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function SamplePage() {
  const router = useRouter()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sampleToken, setSampleToken] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    const token = sessionStorage.getItem('sample_token')
    const qs = sessionStorage.getItem('sample_questions')
    if (!token || !qs) {
      router.push('/')
      return
    }
    setSampleToken(token)
    setQuestions(JSON.parse(qs))
    setLoading(false)

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleSubmitAuto()
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  async function handleSubmitAuto() {
    // Called by timer — use current answers from state via ref won't work easily,
    // so we just trigger form submit
    document.getElementById('submit-btn')?.click()
  }

  async function handleSubmit() {
    if (submitting) return
    clearInterval(timerRef.current)
    setSubmitting(true)

    try {
      const res = await fetch('/api/sample/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sample_token: sampleToken, answers }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setSubmitting(false)
        return
      }
      sessionStorage.setItem('sample_results', JSON.stringify(data))
      router.push('/sample/results')
    } catch (e) {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  function isMultiSelect(q) {
    return q.type === 'sata' || (q.ngn && ['extended-response', 'bow-tie', 'matrix'].includes(q.ngn_type))
  }

  function handleAnswerClick(q, letter) {
    if (isMultiSelect(q)) {
      setAnswers(prev => {
        const current = Array.isArray(prev[q.id]) ? prev[q.id] : []
        if (current.includes(letter)) {
          return { ...prev, [q.id]: current.filter(c => c !== letter) }
        } else {
          return { ...prev, [q.id]: [...current, letter] }
        }
      })
    } else {
      setAnswers(prev => ({ ...prev, [q.id]: letter }))
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
  const isUrgent = timeLeft <= 60

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center">
        <div className="text-white text-xl">Loading sample exam...</div>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-4 px-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-lg">🏥 NCLEX PrepPro</span>
            <div className="text-blue-200 text-xs mt-0.5">Sample Exam — 10 of 667 questions</div>
          </div>
          <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${isUrgent ? 'bg-red-600 animate-pulse' : 'bg-blue-800'}`}>
            ⏱ {timeStr}
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-blue-100 border-b border-blue-200 py-2 px-6 text-center text-blue-800 text-sm font-medium">
        🎯 Free Sample Exam — Answer all 10 questions to see your score and free rationales
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{answeredCount} of {questions.length} answered</span>
          <span>{Math.round((answeredCount / questions.length) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#1e3a5f] h-2 rounded-full transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 pb-8 space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center font-bold text-sm">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{q.category}</span>
                  {q.ngn && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                      🎯 NGN — {q.ngn_type === 'bow-tie' ? 'Bow-Tie' : q.ngn_type === 'extended-response' ? 'Extended Response' : q.ngn_type === 'matrix' ? 'Matrix' : q.ngn_type === 'trend' ? 'Trend Analysis' : q.ngn_type === 'cloze' ? 'Cloze' : 'Clinical Judgment'}
                    </span>
                  )}
                  {isMultiSelect(q) && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">☑ Select All That Apply</span>
                  )}
                </div>

                {q.scenario && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-bold text-sm">📋 CLINICAL SCENARIO</span>
                      {q.case_id && <span className="text-blue-400 text-xs">({q.case_id})</span>}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{q.scenario}</p>
                  </div>
                )}

                <p className="text-gray-800 font-medium mt-1">{q.question}</p>
              </div>
            </div>

            <div className="space-y-2 ml-11">
              {Object.entries(q.choices).map(([letter, text]) => {
                const multi = isMultiSelect(q)
                const isSelected = multi
                  ? (Array.isArray(answers[q.id]) && answers[q.id].includes(letter))
                  : answers[q.id] === letter

                return (
                  <button
                    key={letter}
                    onClick={() => handleAnswerClick(q, letter)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-[#1e3a5f] bg-blue-50 text-[#1e3a5f] font-semibold'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="font-bold mr-2">{letter}.</span>{text}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="text-center pt-4">
          <button
            id="submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-bold py-4 px-12 rounded-xl text-lg transition-colors disabled:opacity-60 shadow-lg"
          >
            {submitting ? 'Grading...' : `Submit Sample Exam (${answeredCount}/${questions.length} answered)`}
          </button>
          {answeredCount < questions.length && (
            <p className="text-gray-400 text-sm mt-2">You can submit with unanswered questions</p>
          )}
        </div>
      </div>
    </div>
  )
}
