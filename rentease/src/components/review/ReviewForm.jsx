import { useState } from 'react'
import { reviewsAPI } from '../../api/reviews'
import RatingStars from './RatingStars'
import Button from '../shared/Button'

export default function ReviewForm({ propertyId, onReviewAdded }) {
  const [rating,  setRating]  = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return setError('Please select a star rating')
    if (!comment.trim()) return setError('Please write a comment')

    setLoading(true)
    setError('')
    try {
      const data = await reviewsAPI.add(propertyId, { rating, comment })
      onReviewAdded?.(data.review)
      setRating(0)
      setComment('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-dark mb-4">Write a Review</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <p className="font-body text-sm text-gray-600 mb-2">Your Rating *</p>
        <RatingStars rating={rating} interactive onRate={setRating} size="lg" />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="font-body text-sm text-gray-600 mb-1.5 block">Your Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this property..."
          className="input-field resize-none"
        />
      </div>

      {error && (
        <p className="font-body text-sm text-red-500 mb-4">{error}</p>
      )}

      <Button type="submit" loading={loading}>Submit Review</Button>
    </form>
  )
}
