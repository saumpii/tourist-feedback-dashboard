import Sentiment from 'sentiment'

const sentiment = new Sentiment()

function scoreToRating(score) {
  if (score <= -3) return 1
  if (score <= 0) return 2
  if (score <= 2) return 3
  if (score <= 4) return 4
  return 5
}

export async function GET() {
  try {
    const redditURL =
      'https://www.reddit.com/search.json?q=goa+vacation+OR+goa+trip+OR+goa+travel+OR+goa+tourist+OR+goa+review&limit=50&sort=relevance'

    const res = await fetch(redditURL)
    const data = await res.json()
    const posts = data.data.children || []

    const mapped = posts
      .filter(post => post.data && post.data.selftext) // must contain text
      .map(post => {
        const item = post.data
        const reviewText = `${item.title || ''}\n\n${item.selftext || ''}`.trim()
        const sentimentScore = sentiment.analyze(reviewText).score
        const rating = scoreToRating(sentimentScore)

        return {
          City: "",  // Optional NLP later
          Pincode: "",
          Name: "",
          Category: "",
          Review: reviewText,
          Rating: rating,
          "Date of review": new Date(item.created_utc * 1000).toISOString(),
          Source: "Social Media"
        }
      })

    return Response.json({ data: mapped })
  } catch (err) {
    console.error("❌ Reddit API error:", err)
    return Response.json({ error: 'Failed to fetch from Reddit' }, { status: 500 })
  }
}
