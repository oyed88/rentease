import { Link } from 'react-router-dom'

// Formats price in Nigerian Naira
const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)

export default function PropertyCard({ property }) {
  const {
    _id, title, price, purpose, type,
    location, images, bedrooms, bathrooms,
    isVerified,
  } = property

  const imageUrl = images?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'

  return (
    <Link to={`/properties/${_id}`} className="card group block">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full ${
            purpose === 'rent' ? 'bg-primary-500 text-white' : 'bg-earth-500 text-white'
          }`}>
            For {purpose === 'rent' ? 'Rent' : 'Sale'}
          </span>
          {isVerified && (
            <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-blue-500 text-white">
              ✓ Verified
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-display font-semibold text-dark text-lg leading-snug mb-1 line-clamp-1">
          {title}
        </p>
        <p className="font-body text-sm text-gray-500 mb-3">
          📍 {location?.city}, {location?.state}
        </p>

        {/* Price */}
        <p className="font-display font-bold text-primary-600 text-xl mb-3">
          {formatPrice(price)}
          {purpose === 'rent' && <span className="font-body font-normal text-sm text-gray-400">/yr</span>}
        </p>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm font-body text-gray-500 border-t border-gray-100 pt-3">
          <span>🛏 {bedrooms} bed</span>
          <span>🚿 {bathrooms} bath</span>
          <span className="capitalize ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
            {type}
          </span>
        </div>
      </div>
    </Link>
  )
}
