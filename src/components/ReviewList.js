'use client'

export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return <p className="text-gray-400 italic">No reviews found.</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r, idx) => (
        <div
          key={`review-${idx}`}
          className="relative bg-[#1f1f2e] border border-pink-600 rounded-lg p-4 shadow-lg hover:shadow-pink-400 transition-all"
        >
          {/* Header accent */}
          <div className="absolute -top-2 left-4 bg-pink-600 text-white text-xs px-2 py-0.5 rounded uppercase tracking-widest shadow">
            {r.category}
          </div>

          <div className="text-sm text-gray-300">
            <p><strong className="text-white">City:</strong> {r.city}</p>
            <p><strong className="text-white">Pincode:</strong> {r.pincode}</p>
            {r.name && <p><strong className="text-white">Place:</strong> {r.name}</p>}
            <p className="mt-2 text-white">{r.review}</p>
          </div>

          <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
            <span className="bg-purple-700 text-white px-2 py-0.5 rounded shadow">
              ⭐ {r.rating}/5
            </span>
            <span className="bg-gray-700 px-2 py-0.5 rounded">{r.source || 'Unknown'}</span>
            <span className="italic text-gray-500">{r.date}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
