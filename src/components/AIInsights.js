// src/components/AIInsights.js
import { useState } from 'react'

export default function AIInsights({ filteredData }) {
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)

  const generateInsights = async () => {
    setLoading(true)
    setInsights('')

    const res = await fetch('/api/generate-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: filteredData })
    })
    const result = await res.json()
    setInsights(result.output)
    setLoading(false)
  }

  return (
    <div className="flex-1">
      <button
        onClick={generateInsights}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        disabled={loading}
      >
        {loading ? 'Generating Insights...' : 'Generate Insights'}
      </button>
      {insights && (
        <div className="mt-4 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          <strong>AI Insights:</strong>
          <div>{insights}</div>
        </div>
      )}
    </div>
  )
}
