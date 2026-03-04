import Message from '../models/Message.js'
import Conversation from '../models/Conversation.js'

// ─────────────────────────────────────────────
// @route   GET /api/messages/conversations
// @desc    Get all conversations for logged-in user
// @access  Private
// ─────────────────────────────────────────────
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar email role')
      .populate('property', 'title location images')
      .sort({ lastMessageAt: -1 })

    res.json({ conversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   POST /api/messages/conversations
// @desc    Start a new conversation about a property
// @access  Private
// ─────────────────────────────────────────────
export const startConversation = async (req, res) => {
  try {
    const { recipientId, propertyId } = req.body

    // Check if conversation already exists
    const existing = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      property: propertyId,
    })
      .populate('participants', 'name avatar email role')
      .populate('property', 'title location images')

    if (existing) {
      return res.json({ conversation: existing })
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
      property: propertyId,
    })

    const populated = await conversation.populate([
      { path: 'participants', select: 'name avatar email role' },
      { path: 'property',     select: 'title location images' },
    ])

    res.status(201).json({ conversation: populated })
  } catch (error) {
    console.error('Start conversation error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   GET /api/messages/:conversationId
// @desc    Get all messages in a conversation
// @access  Private
// ─────────────────────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params

    // Verify user is part of this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    })

    if (!conversation) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' })
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 })

    // Mark messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, isRead: false },
      { isRead: true }
    )

    res.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   POST /api/messages/:conversationId
// @desc    Send a message in a conversation
// @access  Private
// ─────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { text } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' })
    }

    // Verify user is part of this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    })

    if (!conversation) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
    })

    const populated = await message.populate('sender', 'name avatar')

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text.trim(),
      lastMessageAt: new Date(),
    })

    res.status(201).json({ message: populated })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
