'use client'
import { useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer
} from 'recharts'
import Select from 'react-select'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

const COLORS = ['#f472b6', '#8b5cf6', '#22d3ee', '#facc15', '#34d399', '#f87171']

const chartOptions = [
  { label: "Bar Chart", value: "bar" },
  { label: "Pie Chart", value: "pie" },
  { label: "Line Chart", value: "line" }
]

const metricOptions = [
  { label: "Review Count by Category", value: "categoryCount" },
  { label: "Average Rating by Category", value: "averageRating" },
  { label: "Review Count over Time", value: "timeCount" },
  { label: "Review Count by Source", value: "sourceCount" },
  { label: "Average Rating by Source", value: "avgRatingSource" },
  { label: "Review Count (Week-wise)", value: "weeklyCount" },
  { label: "Review Count (Month-wise)", value: "monthlyCount" },
  { label: "Average Rating by City", value: "avgRatingCity" },
  { label: "Monthly Avg Rating", value: "monthlyAvgRating" }
]

const darkSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#1f1f2e',
    borderColor: '#9333ea',
    color: 'white',
    boxShadow: 'none',
    '&:hover': { borderColor: '#d946ef' }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1f1f2e',
    color: 'white'
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#9333ea' : '#1f1f2e',
    color: 'white',
    cursor: 'pointer'
  })
}

export default function ChartView({ filteredData = [] }) {
  const [chartType, setChartType] = useState(chartOptions[0])
  const [metric, setMetric] = useState(metricOptions[0])

  const filteredReviews = Array.isArray(filteredData) ? filteredData : []
  let chartData = []

  // CTA buttons for predefined views
  const quickViews = [
    { label: "📅 Overall Reviews", metric: "monthlyCount", chart: "line" },
    { label: "⭐ Overall Ratings", metric: "monthlyAvgRating", chart: "line" },
    { label: "🧩 Count by Source", metric: "sourceCount", chart: "pie" },
    { label: "🎯 Avg Rating by Source", metric: "avgRatingSource", chart: "pie" },
    { label: "🏙️ Avg Rating by City", metric: "avgRatingCity", chart: "bar" },
    { label: "📚 Avg Rating by Category", metric: "averageRating", chart: "bar" }
  ]

  const handleQuickView = (m, c) => {
    setMetric(metricOptions.find(opt => opt.value === m))
    setChartType(chartOptions.find(opt => opt.value === c))
  }

  // Calculate data for selected metric
  if (metric.value === 'categoryCount') {
    const map = {}
    filteredReviews.forEach(r => {
      map[r.category] = (map[r.category] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, v]) => ({ name: k, value: v }))
  }

  if (metric.value === 'averageRating') {
    const map = {}
    const count = {}
    filteredReviews.forEach(r => {
      map[r.category] = (map[r.category] || 0) + r.rating
      count[r.category] = (count[r.category] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, sum]) => ({
      name: k,
      value: parseFloat((sum / count[k]).toFixed(2))
    }))
  }

  if (metric.value === 'timeCount') {
    const map = {}
    filteredReviews.forEach(r => {
      map[r.date] = (map[r.date] || 0) + 1
    })
    chartData = Object.entries(map)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([k, v]) => ({ name: k, value: v }))
  }

  if (metric.value === 'sourceCount') {
    const map = {}
    filteredReviews.forEach(r => {
      const source = r.source || 'Unknown'
      map[source] = (map[source] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, v]) => ({ name: k, value: v }))
  }

  if (metric.value === 'avgRatingSource') {
    const map = {}
    const count = {}
    filteredReviews.forEach(r => {
      const source = r.source || 'Unknown'
      map[source] = (map[source] || 0) + r.rating
      count[source] = (count[source] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, sum]) => ({
      name: k,
      value: parseFloat((sum / count[k]).toFixed(2))
    }))
  }

  if (metric.value === 'weeklyCount') {
    const map = {}
    filteredReviews.forEach(r => {
      const week = `W${dayjs(r.date).isoWeek()}-${dayjs(r.date).year()}`
      map[week] = (map[week] || 0) + 1
    })
    chartData = Object.entries(map)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([k, v]) => ({ name: k, value: v }))
  }

  if (metric.value === 'monthlyCount') {
    const map = {}
    filteredReviews.forEach(r => {
      const key = dayjs(r.date).format('YYYY-MM')
      map[key] = (map[key] || 0) + 1
    })
    chartData = Object.entries(map)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([k, v]) => ({
        name: dayjs(k).format('MMM YYYY'),
        value: v
      }))
  }

  if (metric.value === 'monthlyAvgRating') {
    const map = {}
    const count = {}
    filteredReviews.forEach(r => {
      const key = dayjs(r.date).format('YYYY-MM')
      map[key] = (map[key] || 0) + r.rating
      count[key] = (count[key] || 0) + 1
    })
    chartData = Object.entries(map)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([k, sum]) => ({
        name: dayjs(k).format('MMM YYYY'),
        value: parseFloat((sum / count[k]).toFixed(2))
      }))
  }

  if (metric.value === 'avgRatingCity') {
    const map = {}
    const count = {}
    filteredReviews.forEach(r => {
      map[r.city] = (map[r.city] || 0) + r.rating
      count[r.city] = (count[r.city] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, sum]) => ({
      name: k,
      value: parseFloat((sum / count[k]).toFixed(2))
    }))
  }

  return (
    <div>
      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {quickViews.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickView(q.metric, q.chart)}
            className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full shadow hover:scale-105 transition"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Manual Dropdowns */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="min-w-[200px]">
          <label className="block mb-1 text-purple-300 font-semibold">Chart Type</label>
          <Select
            options={chartOptions}
            value={chartType}
            onChange={setChartType}
            styles={darkSelectStyles}
          />
        </div>

        <div className="min-w-[280px]">
          <label className="block mb-1 text-purple-300 font-semibold">Metric</label>
          <Select
            options={metricOptions}
            value={metric}
            onChange={setMetric}
            styles={darkSelectStyles}
          />
        </div>
      </div>

      {/* Chart Area */}
      {chartData.length === 0 ? (
        <div className="text-center text-gray-400 italic mt-4">No data to display.</div>
      ) : (
        <div className="w-full h-[400px] bg-[#1a1a40] border border-purple-600 rounded-xl shadow-lg hover:shadow-purple-500 transition-all">
          <ResponsiveContainer width="100%" height="100%">
            {chartType.value === "bar" && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                <XAxis dataKey="name" stroke="#ddd" />
                <YAxis stroke="#ddd" />
                <Tooltip contentStyle={{ backgroundColor: "#2a2a4e", borderColor: "#9333ea" }} />
                <Legend />
                <Bar dataKey="value" fill="#9333ea" />
              </BarChart>
            )}
            {chartType.value === "pie" && (
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={140} label>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
            {chartType.value === "line" && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                <XAxis dataKey="name" stroke="#ddd" />
                <YAxis stroke="#ddd" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#22d3ee" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
