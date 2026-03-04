// Displays star rating
// Usage: <RatingStars rating={4.5} /> or <RatingStars rating={3} interactive onRate={(r) => setRating(r)} />
export default function RatingStars({ rating = 0, interactive = false, onRate, size = 'md' }) {
  const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' }

  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <span className={star <= rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
        </button>
      ))}
    </div>
  )
}
