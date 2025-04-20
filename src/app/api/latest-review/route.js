import { connectDB } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await connectDB()
    const latest = await db.collection('reviews')
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray()

    return Response.json({ data: latest[0] || null })
  } catch (err) {
    console.error("❌ Error fetching latest review:", err)
    return Response.json({ error: 'Failed to fetch latest review' }, { status: 500 })
  }
}
