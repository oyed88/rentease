import express from 'express'
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
} from '../controllers/messageController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes are private
router.get('/conversations',          protect, getConversations)
router.post('/conversations',         protect, startConversation)
router.get('/:conversationId',        protect, getMessages)
router.post('/:conversationId',       protect, sendMessage)

export default router
