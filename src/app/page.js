// src/app/page.js
'use client'
import { useEffect, useState } from 'react'
import Filters from '@/components/Filters'
import ChartView from '@/components/ChartView'
import AIInsights from '@/components/AIInsights'
import AISummary from '@/components/AISummary'
import ReviewList from '@/components/ReviewList'

export default function Home() {
  const [allReviews, setAllReviews] = useState([])
  const [filters, setFilters] = useState({
    cities: [],
    pincodes: [],
    category: null,
    startDate: '',
    endDate: '',
  })
  const [cities, setCities] = useState([])

  useEffect(() => {
    fetch('/goa_cities.json')
      .then(res => res.json())
      .then(setCities)

    fetch('/goa_reviews.json')
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(item => ({
          city: item["City"],
          pincode: item["Pincode"],
          name: item["Name"],
          category: item["Category"],
          review: item["Review"],
          rating: item["Rating"],
          date: item["Date of review"]
        }))
        setAllReviews(normalized)
      })
  }, [])

  // Filter logic
  const filteredReviews = allReviews.filter(r =>
    (filters.cities.length === 0 || filters.cities.includes(r.city)) &&
    (filters.pincodes.length === 0 || filters.pincodes.includes(r.pincode)) &&
    (!filters.category || r.category === filters.category) &&
    (!filters.startDate || new Date(r.date) >= new Date(filters.startDate)) &&
    (!filters.endDate || new Date(r.date) <= new Date(filters.endDate))
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tourist Feedback Dashboard</h1>

      <Filters citiesData={cities} filters={filters} setFilters={setFilters} />

      <div className="my-6">
        <ChartView filteredReviews={filteredReviews} />
      </div>

      <div className="flex gap-4 mb-6">
        <AIInsights filteredData={filteredReviews} />
        <AISummary filteredData={filteredReviews} />
      </div>

      <ReviewList reviews={filteredReviews} />
    </div>
  )
}
