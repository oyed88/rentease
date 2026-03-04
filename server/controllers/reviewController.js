import Review from '../models/Review.js'
import Property from '../models/Property.js'

// ─────────────────────────────────────────────
// @route   GET /api/reviews/:propertyId
// @desc    Get all reviews for a property
// @access  Public
// ─────────────────────────────────────────────
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('reviewer', 'name avatar')
      .sort({ createdAt: -1 })

    // Calculate average rating
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   POST /api/reviews/:propertyId
// @desc    Add a review for a property
// @access  Private
// ─────────────────────────────────────────────
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' })
    }

    const property = await Property.findById(req.params.propertyId)
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Check if user already reviewed this property
    const existing = await Review.findOne({
      property: req.params.propertyId,
      reviewer: req.user._id,
    })
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this property' })
    }

    const review = await Review.create({
      property: req.params.propertyId,
      reviewer: req.user._id,
      rating:   Number(rating),
      comment,
    })

    const populated = await review.populate('reviewer', 'name avatar')
    res.status(201).json({ review: populated })
  } catch (error) {
    console.error('Add review error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private (owner only)
// ─────────────────────────────────────────────
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
    }

    await review.deleteOne()
    res.json({ message: 'Review deleted' })
  } catch (error) {
    console.error('Delete review error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
