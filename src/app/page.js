'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(data)
    }

    fetchReviews()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tourist Feedback Dashboard</h1>

      <div className="grid gap-4">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="border rounded p-4 shadow">
              <div><strong>City:</strong> {review.city}</div>
              <div><strong>Category:</strong> {review.category}</div>
              <div><strong>Review:</strong> {review.review}</div>
              <div><strong>Rating:</strong> {review.rating}/5</div>
              <div><strong>Date:</strong> {review.date}</div>
            </div>
          ))
        ) : (
          <p>No reviews found</p>
        )}
      </div>
    </div>
  )
}
