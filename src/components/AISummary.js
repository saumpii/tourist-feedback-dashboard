'use client'
import { useState } from 'react'

export default function AISummary({ filteredData = [] }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const generateSummary = async () => {
    setLoading(true)
    setSummary('')
    try {
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: filteredData })
      })
      const result = await res.json()
      setSummary(result.output)
    } catch (err) {
      setSummary('Failed to generate summary.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <button
        onClick={generateSummary}
        disabled={loading}
        className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-fuchsia-500/50 transition-all"
      >
        {loading ? '🌀 Summarizing...' : '📝 Generate Summary'}
      </button>

      {summary && (
        <div className="mt-4 p-4 bg-[#1f1f2e] border border-pink-500 rounded-lg text-sm whitespace-pre-wrap text-pink-100 shadow-lg">
          {summary}
        </div>
      )}
    </div>
  )
}

