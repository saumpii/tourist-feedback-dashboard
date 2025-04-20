import { connectDB } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await connectDB()
    const data = await db.collection('reviews').find({}).toArray()
    return Response.json({ data })
  } catch (err) {
    console.error("❌ Error fetching reviews:", err)
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
