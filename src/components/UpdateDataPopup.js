'use client'
import { useState, useEffect } from 'react'

const steps = [
  "⏳ Fetching reviews from travel blogs...",
  "🌐 Pulling reviews from Google, TripAdvisor, and Zomato...",
  "📱 Fetching posts from Instagram and Twitter...",
  "📊 Loading feedback from government surveys...",
  "🧼 Cleaning and de-duplicating records...",
  "🧠 Running sentiment analysis...",
  "🤖 Categorizing feedback by topic, city, and pincode...",
  "📈 Calculating monthly trends and average ratings...",
  "💡 Extracting insights and top complaints...",
  "✅ 100% Processed — Success!"
]

export default function UpdateDataPopup() {
  const [show, setShow] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    let interval
    if (show) {
      setStepIndex(0)
      interval = setInterval(() => {
        setStepIndex(prev => {
          if (prev < steps.length - 1) return prev + 1
          clearInterval(interval)
          setTimeout(() => setShow(false), 2000) // 2s pause at success
          return prev
        })
      }, 1500) // every 1.5s
    }
    return () => clearInterval(interval)
  }, [show])

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
      >
        🔄 Update Data
      </button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
          <div className="bg-[#111827] border border-green-500 rounded-lg shadow-xl max-w-md w-full p-6 text-sm text-green-200 font-mono tracking-tight">
            <h2 className="text-green-400 text-lg font-bold mb-4">Processing Feedback...</h2>
            {steps.slice(0, stepIndex + 1).map((line, idx) => (
              <p key={idx} className="mb-1 animate-pulse">{line}</p>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
