import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { propertiesAPI } from '../api/properties'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await propertiesAPI.getOne(id)
        setProperty(data.property)
      } catch (err) {
        console.error('Failed to fetch property:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  if (!property) return (
    <div className="text-center py-32">
      <p className="font-display text-2xl text-dark mb-4">Property not found</p>
      <Link to="/properties" className="btn-primary">Browse Properties</Link>
    </div>
  )

  const { title, description, price, purpose, type, location,
          images, bedrooms, bathrooms, size, amenities,
          landlord, isVerified, views } = property

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <div className="font-body text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link> →{' '}
        <Link to="/properties" className="hover:text-primary-600">Properties</Link> →{' '}
        <span className="text-dark">{title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* Left — Images & Details */}
        <div className="flex-1">
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden h-80 sm:h-96 mb-3 bg-gray-100">
            {images?.length > 0 ? (
              <img src={images[activeImage]?.url} alt={title}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images?.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary-500' : 'border-transparent'
                  }`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Badges */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-dark mb-2">{title}</h1>
              <p className="font-body text-gray-500">📍 {location?.address}, {location?.city}, {location?.state}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className={`text-xs font-body font-semibold px-3 py-1.5 rounded-full ${
                purpose === 'rent' ? 'bg-primary-500 text-white' : 'bg-earth-500 text-white'
              }`}>
                For {purpose === 'rent' ? 'Rent' : 'Sale'}
              </span>
              {isVerified && (
                <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-full bg-blue-500 text-white">
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 font-body text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-xl">
            <span>🛏 {bedrooms} Bedrooms</span>
            <span>🚿 {bathrooms} Bathrooms</span>
            {size > 0 && <span>📐 {size} m²</span>}
            <span className="capitalize">🏠 {type}</span>
            <span className="ml-auto">👁 {views} views</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-display font-semibold text-xl text-dark mb-3">Description</h2>
            <p className="font-body text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-xl text-dark mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="font-body text-sm bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Price & Contact */}
        <aside className="lg:w-80 shrink-0">
          <div className="card p-6 sticky top-24">
            <p className="font-display text-3xl font-bold text-primary-600 mb-1">
              {formatPrice(price)}
            </p>
            {purpose === 'rent' && (
              <p className="font-body text-sm text-gray-400 mb-6">per year</p>
            )}

            <div className="border-t border-gray-100 pt-4 mb-6">
              <p className="font-body text-sm text-gray-500 mb-3">Listed by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="font-display font-bold text-primary-600">
                    {landlord?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-body font-medium text-dark text-sm">{landlord?.name}</p>
                  <p className="font-body text-xs text-gray-400">{landlord?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a href={`mailto:${landlord?.email}`} className="btn-primary text-center">
                📧 Send Email
              </a>
              {landlord?.phone && (
                <a href={`tel:${landlord?.phone}`} className="btn-secondary text-center">
                  📞 Call Landlord
                </a>
              )}
              <Link to="/messages" className="btn-secondary text-center">
                💬 Send Message
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
