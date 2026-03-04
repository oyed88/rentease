import RatingStars from './RatingStars'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function ReviewList({ reviews, avgRating, total, loading }) {
  if (loading) return <LoadingSpinner className="py-10" />

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <p className="font-display text-5xl font-bold text-dark">{avgRating || 0}</p>
          <RatingStars rating={avgRating} size="sm" />
          <p className="font-body text-xs text-gray-400 mt-1">{total} review{total !== 1 ? 's' : ''}</p>
        </div>

        {/* Rating breakdown */}
        <div className="flex-1 flex flex-col gap-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter(r => r.rating === star).length
            const percent = total ? (count / total) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="font-body text-xs text-gray-500 w-3">{star}</span>
                <span className="text-yellow-400 text-xs">★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <span className="font-body text-xs text-gray-400 w-4">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      {reviews.length === 0 ? (
        <p className="font-body text-sm text-gray-500 text-center py-6">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="font-display font-bold text-primary-600 text-xs">
                    {review.reviewer?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-body font-medium text-dark text-sm">{review.reviewer?.name}</p>
                  <p className="font-body text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <RatingStars rating={review.rating} size="sm" />
                </div>
              </div>
              <p className="font-body text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
