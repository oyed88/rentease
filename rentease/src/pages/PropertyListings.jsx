import { useState, useEffect } from 'react'
import { propertiesAPI } from '../api/properties'
import PropertyList from '../components/property/PropertyList'
import PropertyFilter from '../components/property/PropertyFilter'

export default function PropertyListings() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [filters, setFilters]       = useState({})

  const fetchProperties = async (activeFilters = {}, currentPage = 1) => {
    setLoading(true)
    try {
      const data = await propertiesAPI.getAll({ ...activeFilters, page: currentPage, limit: 12 })
      setProperties(data.properties)
      setTotal(data.total)
    } catch (err) {
      console.error('Failed to fetch properties:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(filters, page)
  }, [page])

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
    fetchProperties(newFilters, 1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-dark mb-2">Browse Properties</h1>
        <p className="font-body text-gray-500">
          {total > 0 ? `${total} properties found` : 'Search for your perfect home'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="lg:w-72 shrink-0">
          <PropertyFilter onFilter={handleFilter} />
        </aside>

        {/* Property Grid */}
        <div className="flex-1">
          <PropertyList properties={properties} loading={loading} />

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center gap-3 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                ← Previous
              </button>
              <span className="font-body text-sm text-gray-500 flex items-center">
                Page {page} of {Math.ceil(total / 12)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 12)}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
