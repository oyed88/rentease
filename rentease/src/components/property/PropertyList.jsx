import PropertyCard from './PropertyCard'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function PropertyList({ properties, loading }) {
  if (loading) {
    return <LoadingSpinner size="lg" className="py-20" />
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🏠</p>
        <h3 className="font-display text-xl font-semibold text-dark mb-2">No properties found</h3>
        <p className="font-body text-gray-500 text-sm">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  )
}
