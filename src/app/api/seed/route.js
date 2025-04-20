import { connectDB } from '@/lib/mongodb'
import fs from 'fs'
import path from 'path'
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
    messages: [{ role: "user", content: prompt }],
  })

  const response = completion?.content?.[0]?.text?.trim() || "Unknown"
  const valid = allowedCategories.find(cat =>
    response.toLowerCase() === cat.toLowerCase()
  )
  return valid || "Unknown"
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'goa_reviews.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const json = JSON.parse(raw)

    const enriched = await Promise.all(
      json.map(async (item) => {
        const aiFields = []
        const reviewText = item["Review"] || ''

        const rating = item["Rating"]
          ? Number(item["Rating"])
          : (() => {
              const score = sentiment.analyze(reviewText).score
              aiFields.push("Rating")
              return scoreToRating(score)
            })()

        let category = item["Category"] || "Unknown"
        if (!item["Category"]) {
          category = await getCategoryFromAI(reviewText)
          if (category !== "Unknown") aiFields.push("Category")
        }

        const record = {
          City: item["City"] || "Unknown",
          Pincode: item["Pincode"] || "Unknown",
          Name: item["Name"] || "Unknown",
          Category: category,
          Review: reviewText,
          Rating: rating,
          "Date of review": item["Date of review"] || new Date().toISOString(),
          Source: item["Source"] || "Unknown",
          aiGeneratedFields: aiFields
        }

        if (!item["City"]) aiFields.push("City")
        if (!item["Source"]) aiFields.push("Source")
        if (!item["Name"]) aiFields.push("Name")
        if (!item["Pincode"]) aiFields.push("Pincode")

        return record
      })
    )

    const db = await connectDB()
    const result = await db.collection('reviews').insertMany(enriched)

    return Response.json({ inserted: result.insertedCount })
  } catch (err) {
    console.error("❌ Error seeding reviews:", err)
    return Response.json({ error: "Failed to seed reviews" }, { status: 500 })
  }
}
