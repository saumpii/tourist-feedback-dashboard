'use client'
import { useState } from 'react'

export default function AIInsights({ filteredData = [] }) {
  const [insights, setInsights] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

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
      setInsights(result.output || 'No insights generated.')
      setShowPopup(true)
    } catch (err) {
      setInsights('Failed to generate insights.')
      setShowPopup(true)
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

      {showPopup && (
       <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
       <div className="bg-[#1f1f2e] border border-blue-600 rounded-lg w-full max-w-lg max-h-[60vh] overflow-y-auto shadow-xl p-6 text-white text-[15px] leading-relaxed">
         <h3 className="text-lg font-bold text-blue-300 mb-4">🔍 AI Insights</h3>
         <p className="whitespace-pre-wrap">{insights}</p>
         <div className="text-center mt-6">
           <button
             onClick={() => setShowPopup(false)}
             className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white shadow"
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

