// src/components/ReviewList.js
export default function ReviewList({ reviews }) {
    return (
      <div className="grid gap-4">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={`review-${idx}`} className="border rounded p-4 shadow">
              <div><strong>City:</strong> {review.city}</div>
              <div><strong>Pincode:</strong> {review.pincode}</div>
              <div><strong>Category:</strong> {review.category}</div>
              <div><strong>Review:</strong> {review.review}</div>
              <div><strong>Rating:</strong> {review.rating}/5</div>
              <div><strong>Date:</strong> {review.date}</div>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    )
  }
  