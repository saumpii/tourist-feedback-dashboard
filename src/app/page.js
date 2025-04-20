'use client'
import { useEffect, useState } from 'react'
import Filters from '@/components/Filters'
import ChartView from '@/components/ChartView'
import AIInsights from '@/components/AIInsights'
import AISummary from '@/components/AISummary'
import ReviewList from '@/components/ReviewList'
import ChatWithData from '@/components/ChatWithData'
import UpdateDataPopup from '@/components/UpdateDataPopup'
import TestSurveyForm from '@/components/TestSurveyForm'

export default function Home() {
  const [allReviews, setAllReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)

  const [citiesData, setCitiesData] = useState([])
  const [filters, setFilters] = useState({
    cities: [],
    pincodes: [],
    category: null,
    source: null,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetch('/goa_cities.json')
      .then(res => res.json())
      .then(data => setCitiesData(data || []))

    // ✅ Fetch from MongoDB instead of static JSON
    fetch('/api/reviews')
      .then(res => res.json())
      .then(result => {
        const normalized = (result.data || []).map(item => ({
          city: item.City || 'Unknown',
          pincode: item.Pincode || 'Unknown',
          name: item.Name || 'Unknown',
          category: item.Category || 'Unknown',
          review: item.Review,
          rating: item.Rating,
          date: item["Date of review"],
          source: item.Source || 'Unknown',
          aiGeneratedFields: item.aiGeneratedFields || []
        }))
        setAllReviews(normalized)
      })
  }, [])

  useEffect(() => {
    const cityNames = filters.cities.map(c => c.value)
    const pincodeValues = filters.pincodes.map(p => p.value)

    const filtered = allReviews.filter(r =>
      (cityNames.length === 0 || cityNames.includes(r.city)) &&
      (pincodeValues.length === 0 || pincodeValues.includes(r.pincode)) &&
      (!filters.category || r.category === filters.category.value) &&
      (!filters.source || r.source === filters.source.value) &&
      (!filters.startDate || new Date(r.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(r.date) <= new Date(filters.endDate))
    ).sort((a, b) => new Date(b.date) - new Date(a.date)) 

    setFilteredReviews(filtered)
  }, [allReviews, filters])

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white px-4 py-8 sm:px-8 lg:px-16">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-400 drop-shadow-md tracking-wide">
        🎯 Aamche GOI
      </h1>
      
      <div className="bg-[#1a1a40] shadow-2xl border border-purple-600 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-3 text-purple-300">🎛️ Apply Your Filters</h2>
        <Filters
          citiesData={citiesData || []}
          filteredData={allReviews || []}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="bg-[#1a1a40] shadow-2xl border border-blue-500 rounded-xl p-6 mb-10">
        <h2 className="text-lg font-bold mb-4 text-blue-300">📊 Live Feedback Visuals</h2>
        <ChartView filteredData={filteredReviews || []} />
      </div>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <AIInsights filteredData={filteredReviews || []} />
        <AISummary filteredData={filteredReviews || []} />
        <TestSurveyForm/>
        <UpdateDataPopup />

        <button
          onClick={() => setShowFeedback(prev => !prev)}
          className="bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white px-4 py-2 rounded-xl hover:scale-105 shadow-lg transition"
        >
          {showFeedback ? '🙈 Hide Feedback' : '🧾 Check All Feedback'}
        </button>
        <p className="text-sm text-gray-400 ml-auto italic">
          {filteredReviews.length} reviews loaded
        </p>
      </div>

      {showFeedback && (
        <div className="bg-[#1a1a40] shadow-2xl border border-pink-600 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-bold mb-4 text-pink-300">🗂️ Feedback Logs</h2>
          <ReviewList reviews={filteredReviews || []} />
        </div>
      )}

      <ChatWithData filteredData={filteredReviews || []} />
    </div>
  )
}
