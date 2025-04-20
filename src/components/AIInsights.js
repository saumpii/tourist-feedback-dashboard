'use client'
import { useState } from 'react'

export default function AIInsights({ filteredData = [] }) {
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)

  const generateInsights = async () => {
    setLoading(true)
    setInsights('')
    try {
      const res = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: filteredData })
      })
      const result = await res.json()
      setInsights(result.output)
    } catch (err) {
      setInsights('Failed to generate insights.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <button
        onClick={generateInsights}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-blue-500/50 transition-all"
      >
        {loading ? '⏳ Generating Insights...' : '🔮 Generate Insights'}
      </button>

      {insights && (
        <div className="mt-4 p-4 bg-[#1f1f2e] border border-blue-600 rounded-lg text-sm whitespace-pre-wrap text-blue-100 shadow-lg">
          {insights}
        </div>
      )}
    </div>
  )
}
