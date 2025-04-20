'use client'
import { useState } from 'react'

export default function TestSurveyForm() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savedReview, setSavedReview] = useState(null)
  const [form, setForm] = useState({
    city: '',
    pincode: '',
    name: '',
    category: '',
    review: '',
    rating: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      date: new Date().toISOString(),
      source: 'Survey'
    }

    await fetch('/api/submit-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    // wait briefly for DB to write
    await new Promise(res => setTimeout(res, 3000))

    const res = await fetch('/api/latest-review')
    const result = await res.json()

    setSavedReview(result.data || null)
    setLoading(false)
  }

  const reset = () => {
    setShowForm(false)
    setLoading(false)
    setSavedReview(null)
    setForm({
      city: '',
      pincode: '',
      name: '',
      category: '',
      review: '',
      rating: ''
    })
  }

  const AI = (field) =>
    savedReview?.aiGeneratedFields?.includes(field) && (
      <span className="ml-2 text-yellow-300 bg-purple-700 px-2 py-0.5 rounded-full text-[10px]">AI</span>
    )

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-lg shadow-md"
      >
        🧪 Test
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1f1f2e] border border-purple-500 rounded-lg p-6 w-full max-w-md shadow-xl text-white">
            {loading ? (
              <div className="text-center">
                <h3 className="text-lg font-bold text-purple-300 mb-2">🔄 Processing...</h3>
                <p className="text-sm text-gray-300 mb-1">
                  This may take up to <span className="font-bold text-yellow-300">15 seconds</span>.
                </p>
                <p className="text-xs italic text-gray-400">
                  Category and Rating will be auto-generated using AI.
                </p>
              </div>
            ) : savedReview ? (
              <>
                <h3 className="text-green-400 text-lg font-bold mb-2">✅ Review Stored</h3>
                <div className="text-sm text-gray-300 space-y-1 mb-4">
                  <p><strong>City:</strong> {savedReview.City} {AI("City")}</p>
                  <p><strong>Pincode:</strong> {savedReview.Pincode} {AI("Pincode")}</p>
                  <p><strong>Name:</strong> {savedReview.Name} {AI("Name")}</p>
                  <p><strong>Category:</strong> {savedReview.Category} {AI("Category")}</p>
                  <p><strong>Rating:</strong> {savedReview.Rating}/5 {AI("Rating")}</p>
                  <p><strong>Review:</strong> {savedReview.Review}</p>
                  <p><strong>Source:</strong> {savedReview.Source} {AI("Source")}</p>
                  <p><strong>Date:</strong> {savedReview["Date of review"]}</p>
                </div>
                <button
                  onClick={reset}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  OK
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg text-purple-300 font-bold">📝 Submit Test Review</h2>

                {['city', 'pincode', 'name', 'category', 'review', 'rating'].map(field => (
                  <div key={field}>
                    <label className="block mb-1 text-sm capitalize text-white">{field}</label>
                    <input
                      type={field === 'rating' ? 'number' : 'text'}
                      step={field === 'rating' ? '0.1' : undefined}
                      value={form[field]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      className="w-full p-2 rounded bg-[#2a2a40] border border-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={`Enter ${field}... (optional)`}
                    />
                  </div>
                ))}

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
