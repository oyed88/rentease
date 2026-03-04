import { useState } from 'react'

const CITIES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]
const TYPES = ['apartment', 'house', 'land', 'commercial', 'shortlet']

export default function PropertyFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    search: '', city: '', type: '', purpose: '', minPrice: '', maxPrice: '', bedrooms: '',
  })

  const handleChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    const empty = { search: '', city: '', type: '', purpose: '', minPrice: '', maxPrice: '', bedrooms: '' }
    setFilters(empty)
    onFilter(empty)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-display font-semibold text-dark text-lg mb-4">Filter Properties</h3>

      <div className="flex flex-col gap-4">
        {/* Search */}
        <input
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by title or location..."
          className="input-field"
        />

        {/* State */}
        <select name="city" value={filters.city} onChange={handleChange} className="input-field">
          <option value="">All States</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Purpose */}
        <select name="purpose" value={filters.purpose} onChange={handleChange} className="input-field">
          <option value="">Rent or Buy</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>

        {/* Type */}
        <select name="type" value={filters.type} onChange={handleChange} className="input-field">
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
        </select>

        {/* Bedrooms */}
        <select name="bedrooms" value={filters.bedrooms} onChange={handleChange} className="input-field">
          <option value="">Any Bedrooms</option>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} bedroom{n > 1 ? 's' : ''}</option>)}
        </select>

        {/* Price Range */}
        <div className="flex gap-2">
          <input
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min price"
            className="input-field"
          />
          <input
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max price"
            className="input-field"
          />
        </div>

        {/* Buttons */}
        <button type="submit" className="btn-primary w-full">
          Search Properties
        </button>
        <button type="button" onClick={handleReset} className="btn-secondary w-full">
          Reset Filters
        </button>
      </div>
    </form>
  )
}
