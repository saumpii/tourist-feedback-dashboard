// src/components/Filters.js
import Select from 'react-select'

const categoryOptions = [
  "Travel", "Stay", "Restaurant", "Food", "Culture",
  "Fraud", "Pricing", "Safety", "Medical services",
  "Parking", "Traffic", "Cleanliness"
].map(cat => ({ label: cat, value: cat }))

export default function Filters({ citiesData, filters, setFilters }) {
  const cityOptions = citiesData.map(c => ({ label: c.city, value: c.city }))

  const selectedPincodeValues = filters.cities.length
    ? citiesData
        .filter(c => filters.cities.includes(c.city))
        .flatMap(c => c.pincodes)
        .map(p => ({ label: p, value: p }))
    : []

  return (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[200px]">
        <label className="block mb-1 font-semibold">City</label>
        <Select
          isMulti
          options={cityOptions}
          value={cityOptions.filter(opt => filters.cities.includes(opt.value))}
          onChange={selected => setFilters(prev => ({
            ...prev,
            cities: selected.map(s => s.value),
            pincodes: [] // reset pincode if city changes
          }))}
        />
      </div>

      <div className="min-w-[200px]">
        <label className="block mb-1 font-semibold">Pincode</label>
        <Select
          isMulti
          isDisabled={!filters.cities.length}
          options={selectedPincodeValues}
          value={selectedPincodeValues.filter(p => filters.pincodes.includes(p.value))}
          onChange={selected => setFilters(prev => ({
            ...prev,
            pincodes: selected.map(s => s.value)
          }))}
        />
      </div>

      <div className="min-w-[200px]">
        <label className="block mb-1 font-semibold">Category</label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(opt => opt.value === filters.category)}
          onChange={selected => setFilters(prev => ({
            ...prev,
            category: selected ? selected.value : null
          }))}
          isClearable
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">From</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.startDate}
          onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">To</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.endDate}
          onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </div>
    </div>
  )
}
