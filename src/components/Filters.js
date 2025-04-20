'use client'
import Select from 'react-select'

const categoryOptions = [
  "Travel", "Stay", "Restaurant", "Food", "Culture",
  "Fraud", "Pricing", "Safety", "Medical services",
  "Parking", "Traffic", "Cleanliness"
].map(c => ({ label: c, value: c }))

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
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#6b21a8',
    color: 'white'
  }),
  multiValueLabel: (base) => ({
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

export default function Filters({ citiesData, filters, setFilters, filteredData = [] }) {
  const cityOptions = citiesData.map(c => ({ label: c.city, value: c.city }))
  const selectedPincodeValues = filters.cities.length
    ? citiesData
        .filter(c => filters.cities.some(sel => sel.value === c.city))
        .flatMap(c => c.pincodes)
        .map(pin => ({ label: pin, value: pin }))
    : []

  // ✅ Get all sources from full dataset
  const sourceOptions = [...new Set(filteredData.map(r => r.source || 'Unknown'))]
    .map(s => ({ label: s, value: s }))

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* City */}
      <div>
        <label className="block mb-1 text-purple-300 font-semibold">City</label>
        <Select
          isMulti
          options={cityOptions}
          value={filters.cities}
          onChange={(val) => setFilters({ ...filters, cities: val, pincodes: [] })}
          styles={darkSelectStyles}
        />
      </div>

      {/* Pincode */}
      <div>
        <label className="block mb-1 text-purple-300 font-semibold">Pincode</label>
        <Select
          isMulti
          options={selectedPincodeValues}
          value={filters.pincodes}
          onChange={(val) => setFilters({ ...filters, pincodes: val })}
          styles={darkSelectStyles}
          isDisabled={!filters.cities.length}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block mb-1 text-purple-300 font-semibold">Category</label>
        <Select
          options={categoryOptions}
          value={filters.category}
          onChange={(val) => setFilters({ ...filters, category: val })}
          isClearable
          styles={darkSelectStyles}
        />
      </div>

      {/* Source */}
      <div>
        <label className="block mb-1 text-purple-300 font-semibold">Source</label>
        <Select
          options={sourceOptions}
          value={filters.source}
          onChange={(val) => setFilters({ ...filters, source: val })}
          isClearable
          styles={darkSelectStyles}
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block mb-1 text-purple-300 font-semibold">From Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={e => setFilters({ ...filters, startDate: e.target.value })}
          className="w-full p-2 rounded bg-[#1f1f2e] border border-purple-600 text-white focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block mb-1 text-purple-300 font-semibold">To Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={e => setFilters({ ...filters, endDate: e.target.value })}
          className="w-full p-2 rounded bg-[#1f1f2e] border border-purple-600 text-white focus:ring-2 focus:ring-purple-400"
        />
      </div>
    </div>
  )
}
