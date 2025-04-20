'use client'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer
} from 'recharts'



const categoryOptions = [
  "Travel", "Stay", "Restaurant", "Food", "Culture",
  "Fraud", "Pricing", "Safety", "Medical services",
  "Parking", "Traffic", "Cleanliness"
].map(cat => ({ label: cat, value: cat }))

const chartOptions = [
  { label: "Bar Chart", value: "bar" },
  { label: "Pie Chart", value: "pie" },
  { label: "Line Chart", value: "line" }
]

const metricOptions = [
  { label: "Review Count by Category", value: "categoryCount" },
  { label: "Average Rating by Category", value: "averageRating" },
  { label: "Review Count over Time", value: "timeCount" }
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28']

export default function Home() {
  
  const [allReviews, setAllReviews] = useState([])
  const [cities, setCities] = useState([])

  const [selectedCities, setSelectedCities] = useState([])
  const [selectedPincodes, setSelectedPincodes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [selectedChartType, setSelectedChartType] = useState(chartOptions[0])
  const [selectedMetric, setSelectedMetric] = useState(metricOptions[0])

  useEffect(() => {
    fetch('/goa_cities.json')
      .then(res => res.json())
      .then(data => setCities(data))

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

  const selectedCityNames = selectedCities.map(c => c.value)
  const selectedPincodeValues = selectedPincodes.map(p => p.value)

  // Get filtered pincodes based on selected cities
  const cityFilteredPincodes = cities
    .filter(c => selectedCityNames.includes(c.city))
    .flatMap(c => c.pincodes)
    .map(p => ({ label: p, value: p }))

  // Filter reviews
  const filteredReviews = allReviews.filter(r =>
    (selectedCityNames.length === 0 || selectedCityNames.includes(r.city)) &&
    (selectedPincodeValues.length === 0 || selectedPincodeValues.includes(r.pincode)) &&
    (!selectedCategory || r.category === selectedCategory.value) &&
    (!startDate || new Date(r.date) >= new Date(startDate)) &&
    (!endDate || new Date(r.date) <= new Date(endDate))
  )

  // Chart data preparation
  let chartData = []

  if (selectedMetric.value === "categoryCount") {
    const map = {}
    filteredReviews.forEach(r => {
      map[r.category] = (map[r.category] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, v]) => ({ name: k, value: v }))
  }

  if (selectedMetric.value === "averageRating") {
    const map = {}
    const count = {}
    filteredReviews.forEach(r => {
      map[r.category] = (map[r.category] || 0) + r.rating
      count[r.category] = (count[r.category] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, sum]) => ({
      name: k,
      value: (sum / count[k]).toFixed(2)
    }))
  }

  if (selectedMetric.value === "timeCount") {
    const map = {}
    filteredReviews.forEach(r => {
      map[r.date] = (map[r.date] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, v]) => ({ name: k, value: v }))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tourist Feedback Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="min-w-[200px]">
          <label className="block mb-1 font-semibold">City</label>
          <Select
            isMulti
            options={cities.map(c => ({ label: c.city, value: c.city }))}
            value={selectedCities}
            onChange={setSelectedCities}
          />
        </div>

        <div className="min-w-[200px]">
          <label className="block mb-1 font-semibold">Pincode</label>
          <Select
            isMulti
            options={cityFilteredPincodes}
            value={selectedPincodes}
            onChange={setSelectedPincodes}
            isDisabled={selectedCityNames.length === 0}
          />
        </div>

        <div className="min-w-[200px]">
          <label className="block mb-1 font-semibold">Category</label>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            isClearable
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">From</label>
          <input type="date" className="border p-2 rounded" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 font-semibold">To</label>
          <input type="date" className="border p-2 rounded" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>

      {/* Chart Selectors */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="min-w-[200px]">
          <label className="block mb-1 font-semibold">Chart Type</label>
          <Select options={chartOptions} value={selectedChartType} onChange={setSelectedChartType} />
        </div>
        <div className="min-w-[300px]">
          <label className="block mb-1 font-semibold">Metric</label>
          <Select options={metricOptions} value={selectedMetric} onChange={setSelectedMetric} />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border p-4 mb-6 rounded shadow w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {selectedChartType.value === "bar" && (
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}
          {selectedChartType.value === "pie" && (
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={150} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
          {selectedChartType.value === "line" && (
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Review Cards */}
      <div className="grid gap-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review, idx) => (
            <div key={`review-${idx}`} className="border rounded p-4 shadow">
              <div><strong>City:</strong> {review.city}</div>
              <div><strong>Pincode:</strong> {review.pincode}</div>
              <div><strong>Category:</strong> {review.category}</div>
              <div><strong>Review:</strong> {review.review}</div>
              <div><strong>Rating:</strong> {review.rating}/5</div>
              <div><strong>Date:</strong> {review.date}</div>
            </div>
          ))
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
    </div>
  )
}
