import express from 'express'
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
} from '../controllers/propertyController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// Public routes
router.get('/',    getProperties)
router.get('/:id', getProperty)

// Private routes
router.get('/user/my-listings', protect, getMyListings)
router.post('/',    protect, authorize('landlord', 'agent'), upload.array('images', 10), createProperty)
router.put('/:id',  protect, updateProperty)
router.delete('/:id', protect, deleteProperty)

export default router
