import { connectDB } from '@/lib/mongodb'
import Sentiment from 'sentiment'
import { Anthropic } from '@anthropic-ai/sdk'

const sentiment = new Sentiment()
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const allowedCategories = [
  "Travel", "Stay", "Restaurant", "Food", "Culture",
  "Fraud", "Pricing", "Safety", "Medical services",
  "Parking", "Traffic", "Cleanliness"
]

function scoreToRating(score) {
  if (score <= -3) return 1
  if (score <= 0) return 2
  if (score <= 2) return 3
  if (score <= 4) return 4
  return 5
}

async function getCategoryFromAI(review) {
  const prompt = `Given the review below, classify it into one of these categories only: ${allowedCategories.join(", ")}.
Respond only with the category name and nothing else.

Review:
"${review}"`

  const completion = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 10,
    messages: [{ role: "user", content: prompt }]
  })

  const response = completion?.content?.[0]?.text?.trim() || "Unknown"
  const valid = allowedCategories.find(cat =>
    response.toLowerCase() === cat.toLowerCase()
  )
  return valid || "Unknown"
}

export async function POST(req) {
  try {
    const body = await req.json()
    const aiFields = []
    const reviewText = body.review || ''

    // Rating (via sentiment)
    let rating = body.rating
    if (!rating && reviewText) {
      const score = sentiment.analyze(reviewText).score
      rating = scoreToRating(score)
      aiFields.push("Rating")
    }

    // Category via Claude if not provided
    let category = body.category || "Unknown"
    if ((!body.category || body.category === "Unknown") && reviewText) {
      category = await getCategoryFromAI(reviewText)
      aiFields.push("Category")
    }

    // Track missing fields
    const data = {
      City: body.city || "Unknown",
      Pincode: body.pincode || "Unknown",
      Name: body.name || "Unknown",
      Category: category,
      Review: reviewText,
      Rating: Number(rating) || 3,
      "Date of review": new Date().toISOString(),
      Source: "Survey",
      aiGeneratedFields: aiFields
    }

    if (!body.city) aiFields.push("City")
    if (!body.pincode) aiFields.push("Pincode")
    if (!body.name) aiFields.push("Name")

    const db = await connectDB()
    await db.collection('reviews').insertOne(data)

    return Response.json({ success: true })
  } catch (err) {
    console.error("❌ Error in /submit-survey:", err)
    return Response.json({ error: 'Submission failed' }, { status: 500 })
  }
}
