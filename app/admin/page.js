'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login() {
    setLoading(true)
    setError('')
    const res = await fetch(`/api/admin/stats?password=${encodeURIComponent(password)}`)
    const json = await res.json()
    if (json.error) {
      setError('Invalid password')
    } else {
      setData(json)
      setAuthed(true)
    }
    setLoading(false)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🔐</div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Admin Dashboard</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          />
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-[#1e3a5f] text-white font-bold py-3 rounded-xl hover:bg-[#152d4a] transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    )
  }

  const { stats, users, feedback, sampleUsers } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl">NCLEX PrepPro — Admin</div>
        <button onClick={() => setAuthed(false)} className="text-sm bg-white text-[#1e3a5f] px-4 py-2 rounded-lg font-semibold">
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {[
            { label: 'Total Users', val: stats.totalUsers },
            { label: 'Paid Users', val: stats.paidUsers },
            { label: 'Testers', val: stats.testerUsers },
            { label: 'Avg Score', val: stats.avgScore ? `${stats.avgScore}%` : 'N/A' },
            { label: 'Feedback', val: stats.feedbackCount },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow p-5 text-center">
              <div className="text-3xl font-bold text-[#1e3a5f]">{s.val}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sample Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Sample Users', val: stats.sampleUsers, color: 'text-purple-700' },
            { label: 'Completed Sample', val: stats.sampleCompleted, color: 'text-blue-700' },
            { label: 'Converted to Paid', val: stats.sampleConverted, color: 'text-green-700' },
            { label: 'Conversion Rate', val: `${stats.sampleConversionRate}%`, color: 'text-orange-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow p-5 text-center border-t-4 border-purple-300">
              <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Users</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Name</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Email</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Type</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Score</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3 text-gray-500">{u.email}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      u.type === 'paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.type}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    {u.score ? (
                      <span className={u.score >= 75 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                        {parseFloat(u.score).toFixed(1)}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="py-2 px-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sample Users */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 overflow-x-auto">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Sample Users ({sampleUsers?.length || 0})</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Email</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Name</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Score</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Completed</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Converted</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {(sampleUsers || []).map((u, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-700">{u.email}</td>
                  <td className="py-2 px-3 text-gray-500">{u.name || '—'}</td>
                  <td className="py-2 px-3 font-semibold">{u.score || '—'}</td>
                  <td className="py-2 px-3">
                    {u.completed_at
                      ? <span className="text-green-600 text-xs">✓ {new Date(u.completed_at).toLocaleDateString()}</span>
                      : <span className="text-gray-400 text-xs">Pending</span>}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.converted_to_paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                      {u.converted_to_paid ? '✓ Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!sampleUsers || sampleUsers.length === 0) && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No sample users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">Feedback Submissions ({feedback.length})</h2>
          {feedback.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No feedback yet</div>
          ) : (
            <div className="space-y-4">
              {feedback.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold">{f.name}</span>
                      <span className="text-gray-400 ml-2 text-sm">{f.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${f.would_pay ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        Would pay: {f.would_pay ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  {f.helpful && <p className="text-sm text-gray-600 mb-1"><strong>Helpful:</strong> {f.helpful}</p>}
                  {f.improve && <p className="text-sm text-gray-600"><strong>Improve:</strong> {f.improve}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
