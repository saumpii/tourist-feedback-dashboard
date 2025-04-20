import Sentiment from 'sentiment'

const sentiment = new Sentiment()

function scoreToRating(score) {
  if (score <= -3) return 1
  if (score <= 0) return 2
  if (score <= 2) return 3
  if (score <= 4) return 4
  return 5
}

export async function POST(req) {
  try {
    const { data } = await req.json() // data = array of reviews

    const updated = data.map((r) => {
        if (!r.rating || r.rating === 0) {
            const score = sentiment.analyze(r.review || '').score
            const autoRating = scoreToRating(score)
            return { ...r, rating: autoRating, autoRated: true }  // ✅ must add autoRated: true
          }
          return { ...r, autoRated: false }
          
    })

    return Response.json({ data: updated })
  } catch (err) {
    console.error("Auto-rating error:", err)
    return Response.json({ error: 'Failed to auto-rate reviews.' }, { status: 500 })
  }
}
