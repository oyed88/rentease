import express from 'express'
import { getReviews, addReview, deleteReview } from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/:propertyId',    getReviews)
router.post('/:propertyId',   protect, addReview)
router.delete('/:reviewId',   protect, deleteReview)

export default router
