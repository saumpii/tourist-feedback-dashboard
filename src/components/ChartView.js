// src/components/ChartView.js
import { useState } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import Select from 'react-select'

const chartOptions = [
  { label: 'Bar Chart', value: 'bar' },
  { label: 'Pie Chart', value: 'pie' },
  { label: 'Line Chart', value: 'line' }
]

const metricOptions = [
  { label: 'Review Count by Category', value: 'categoryCount' },
  { label: 'Average Rating by Category', value: 'averageRating' },
  { label: 'Review Count over Time', value: 'timeCount' }
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28']

export default function ChartView({ filteredReviews }) {
  const [chartType, setChartType] = useState(chartOptions[0])
  const [metric, setMetric] = useState(metricOptions[0])

  let chartData = []
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
      value: (sum / count[k]).toFixed(2)
    }))
  }

  if (metric.value === 'timeCount') {
    const map = {}
    filteredReviews.forEach(r => {
      map[r.date] = (map[r.date] || 0) + 1
    })
    chartData = Object.entries(map).map(([k, v]) => ({ name: k, value: v }))
  }

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Select options={chartOptions} value={chartType} onChange={setChartType} className="min-w-[200px]" />
        <Select options={metricOptions} value={metric} onChange={setMetric} className="min-w-[300px]" />
      </div>

      <div className="bg-white border p-4 rounded shadow w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType.value === 'bar' && (
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          )}

          {chartType.value === 'pie' && (
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

          {chartType.value === 'line' && (
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
    </div>
  )
}