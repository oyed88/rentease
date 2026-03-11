import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axiosInstance'

const TYPE_LABELS = {
  event_centre: { label: 'Event Centre', icon: '🎉', color: 'bg-purple-100 text-purple-700' },
  shortlet:     { label: 'Short-let',    icon: '🏠', color: 'bg-blue-100 text-blue-700'   },
  office_space: { label: 'Office Space', icon: '🏢', color: 'bg-gray-100 text-gray-700'   },
}

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

export default function Venues() {
  const [venues, setVenues]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const params = {}
        if (filter !== 'all') params.type = filter
        const res = await axios.get('/venues', { params })
        setVenues(res.data)
      } catch (err) {
        console.error('Failed to fetch venues:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVenues()
  }, [filter])

  const filtered = venues.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.location?.city?.toLowerCase().includes(search.toLowerCase())
  )

  const FILTERS = [
    { value: 'all',          label: 'All',           icon: '✨' },
    { value: 'event_centre', label: 'Event Centres', icon: '🎉' },
    { value: 'shortlet',     label: 'Short-lets',    icon: '🏠' },
    { value: 'office_space', label: 'Office Spaces', icon: '🏢' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Book a Venue
        </h1>
        <p className="text-gray-500">
          Discover event centres, short-let apartments and office spaces across Nigeria.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-2xl px-5 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ' +
              (filter === f.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )
            }
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-gray-400">Loading venues...</div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏙️</p>
          <p className="text-lg font-medium text-gray-600">No venues found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different filter or search term</p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((venue) => {
            const typeInfo = TYPE_LABELS[venue.type] || TYPE_LABELS.event_centre
            const price = venue.pricePerNight || venue.pricePerDay || venue.pricePerHour || 0
            const priceLabel = venue.pricePerHour
              ? '/hr'
              : venue.pricePerNight
              ? '/night'
              : '/day'

            return (
              <div key={venue._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">

                {/* Image */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {venue.images?.[0]?.url ? (
                    <img
                      src={venue.images[0].url}
                      alt={venue.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-5xl">
                      {typeInfo.icon}
                    </div>
                  )}

                  {/* Type badge */}
                  <span className={'absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ' + typeInfo.color}>
                    {typeInfo.icon} {typeInfo.label}
                  </span>

                  {!venue.isAvailable && (
                    <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600">
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{venue.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    📍 {venue.location?.city}, {venue.location?.state}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    {venue.capacity > 0 && <span>👥 Up to {venue.capacity} guests</span>}
                    {venue.amenities?.length > 0 && <span>✓ {venue.amenities.length} amenities</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-600">{formatPrice(price)}</span>
                      <span className="text-xs text-gray-400 ml-1">{priceLabel}</span>
                    </div>
                    <Link
                      to={'/venues/' + venue._id}
                      className={'text-sm font-semibold px-4 py-2 rounded-xl transition ' +
                        (venue.isAvailable
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                        )
                      }
                    >
                      {venue.isAvailable ? 'Book Now' : 'Unavailable'}
                    </Link>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
