'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function TestContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const startedAt = useRef(new Date().toISOString())
  const timerRef = useRef(null)

  useEffect(() => {
    // Get token from URL param or localStorage
    const urlToken = searchParams.get('token')
    const urlType = searchParams.get('type')
    if (urlToken) {
      localStorage.setItem('nclex_token', urlToken)
      if (urlType) localStorage.setItem('nclex_user_type', urlType)
      setToken(urlToken)
    } else {
      const stored = localStorage.getItem('nclex_token')
      if (stored) setToken(stored)
      else router.push('/')
    }
  }, [])

  useEffect(() => {
    if (!token) return
    fetch(`/api/questions?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push('/'); return }
        setQuestions(data.questions)
        setLoading(false)
      })
      .catch(() => { setError('Failed to load questions.'); setLoading(false) })
  }, [token])

  useEffect(() => {
    if (loading || questions.length === 0) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleSubmit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [loading, questions.length])

  function formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function selectAnswer(val) {
    const q = questions[current]
    if (q.type === 'sata') {
      setAnswers(prev => {
        const existing = prev[q.id] || []
        if (existing.includes(val)) {
          return { ...prev, [q.id]: existing.filter(v => v !== val) }
        } else {
          return { ...prev, [q.id]: [...existing, val] }
        }
      })
    } else {
      setAnswers(prev => ({ ...prev, [q.id]: val }))
    }
  }

  function toggleFlag() {
    const qId = questions[current].id
    setFlagged(prev => {
      const next = new Set(prev)
      if (next.has(qId)) next.delete(qId)
      else next.add(qId)
      return next
    })
  }

  function nextQuestion() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
    }
  }

  async function handleSubmit() {
    clearInterval(timerRef.current)
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, answers, startedAt: startedAt.current }),
      })
      const data = await res.json()
      localStorage.setItem('nclex_results', JSON.stringify(data))
      router.push('/results')
    } catch (e) {
      setError('Failed to submit. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading your exam...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-red-600 text-xl">{error}</div>
    </div>
  )

  const q = questions[current]
  const isLastQuestion = current === questions.length - 1
  const progress = ((current + 1) / questions.length) * 100
  const currentAnswer = answers[q?.id]
  const isTimeLow = timeLeft < 600

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className={`${isTimeLow ? 'bg-red-600' : 'bg-[#1e3a5f]'} text-white px-6 py-3 flex items-center justify-between transition-colors`}>
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">NCLEX PrepPro</span>
          <span className="text-sm opacity-75 hidden md:inline">Practice Exam</span>
        </div>
        <div className={`font-mono text-xl font-bold ${isTimeLow ? 'animate-pulse' : ''}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
        <button
          onClick={() => { if (confirm('Submit exam now?')) handleSubmit() }}
          disabled={submitting}
          className="bg-white text-[#1e3a5f] font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 h-2">
        <div
          className="bg-blue-500 h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-sm text-gray-500 py-2">
        Question {current + 1} of {questions.length}
        {flagged.has(q?.id) && <span className="ml-2 text-orange-500 font-semibold">🚩 Flagged</span>}
      </div>

      {/* Question card */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              {q?.category}
              {q?.type === 'sata' && ' · Select All That Apply'}
            </span>
            <button
              onClick={toggleFlag}
              className={`text-sm px-3 py-1 rounded-lg border transition-colors ${
                flagged.has(q?.id)
                  ? 'border-orange-400 bg-orange-50 text-orange-600'
                  : 'border-gray-300 text-gray-500 hover:border-orange-400'
              }`}
            >
              🚩 {flagged.has(q?.id) ? 'Flagged' : 'Flag for Review'}
            </button>
          </div>

          <p className="text-gray-900 text-lg leading-relaxed mb-8 font-medium">{q?.question}</p>

          <div className="space-y-3">
            {q?.choices && Object.entries(q.choices).map(([key, val]) => {
              const isSata = q.type === 'sata'
              const isSelected = isSata
                ? (currentAnswer || []).includes(key)
                : currentAnswer === key

              return (
                <button
                  key={key}
                  onClick={() => selectAnswer(key)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#1e3a5f] bg-blue-50 text-[#1e3a5f] font-semibold'
                      : 'border-gray-200 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded ${
                      isSata ? 'border-2 border-current' : 'rounded-full border-2 border-current'
                    } ${isSelected ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-400'}`}>
                      {isSelected && <span className="text-xs">{isSata ? '✓' : '●'}</span>}
                    </span>
                    <span><strong>{key}.</strong> {val}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="text-sm text-gray-400">
            {currentAnswer
              ? (q?.type === 'sata' ? `${(currentAnswer).length} selected` : 'Answer selected')
              : 'No answer selected'
            }
          </div>
          {isLastQuestion ? (
            <button
              onClick={() => { if (confirm('Submit exam now?')) handleSubmit() }}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : '🎯 Submit Exam'}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <TestContent />
    </Suspense>
  )
}
