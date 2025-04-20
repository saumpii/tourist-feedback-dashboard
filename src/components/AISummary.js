// src/components/AISummary.js
import { useState } from 'react'

export default function AISummary({ filteredData }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const generateSummary = async () => {
    setLoading(true)
    setSummary('')

    const res = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: filteredData })
    })
    const result = await res.json()
    setSummary(result.output)
    setLoading(false)
  }

  return (
    <div className="flex-1">
      <button
        onClick={generateSummary}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded shadow"
        disabled={loading}
      >
        {loading ? 'Summarizing...' : 'Generate Summary'}
      </button>
      {summary && (
        <div className="mt-4 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          <strong>AI Summary:</strong>
          <div>{summary}</div>
        </div>
      )}
    </div>
  )
}
