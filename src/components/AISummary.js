'use client'
import { useState } from 'react'

export default function AISummary({ filteredData = [] }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

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
      setSummary(result.output || 'No summary available.')
      setShowPopup(true)
    } catch (err) {
      setSummary('Failed to generate summary.')
      setShowPopup(true)
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

      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-[#1f1f2e] border border-pink-500 rounded-lg w-full max-w-lg max-h-[60vh] overflow-y-auto shadow-xl p-6 text-white text-[15px] leading-relaxed">
            <h3 className="text-lg font-bold text-pink-300 mb-4">📋 AI Summary</h3>
            <p className="whitespace-pre-wrap">{summary}</p>
            <div className="text-center mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-white shadow"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
