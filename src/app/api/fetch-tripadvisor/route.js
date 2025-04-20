export async function GET() {
    const headers = {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'tripadvisor-com1.p.rapidapi.com'
    }
  
    const url = 'https://tripadvisor-com1.p.rapidapi.com/attractions/search?geoId=1954828&startDate=2025-04-22&endDate=2025-04-24&currency=INR&lang=en_US&sort=popularity'
  
    try {
      const res = await fetch(url, { headers })
  
      if (!res.ok) {
        console.warn(`⚠️ Failed to fetch attractions:`, res.status)
        return Response.json({ data: [] })
      }
  
      const data = await res.json()
console.log("📥 Raw response for Attractions:", JSON.stringify(data, null, 2))

const items = (data.data?.results || []).slice(0, 2)

  
      const mapped = items.map(item => ({
        City: "Goa",
        Pincode: "",
        Name: item.name || "",
        Category: "Attraction",
        Review: item.description || item.details || "",
        Rating: Number(item.rating) || 3,
        "Date of review": new Date().toISOString(),
        Source: "Online Reviews"
      }))
  
      console.log("📦 Final mapped attractions:", mapped)
  
      return Response.json({ data: mapped })
    } catch (err) {
      console.error("❌ Error fetching TripAdvisor attractions:", err)
      return Response.json({ error: 'TripAdvisor fetch error' }, { status: 500 })
    }
  }
  