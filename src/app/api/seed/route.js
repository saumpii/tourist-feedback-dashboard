import clientPromise from '@/lib/mongodb'

export async function GET() {
  const sampleReview = {
    city: "Panaji",
    pincode: "403001",
    name: "Miramar Beach",
    category: "Cleanliness",
    review: "The beach was clean and peaceful, a perfect morning walk spot.",
    rating: 4,
    date: new Date().toISOString().split("T")[0]
  }

  try {
    const client = await clientPromise
    const db = client.db("Tourist")
    const result = await db.collection("reviews").insertOne(sampleReview)

    return Response.json({ success: true, insertedId: result.insertedId })
  } catch (err) {
    return Response.json({ error: "Failed to seed data" }, { status: 500 })
  }
}
