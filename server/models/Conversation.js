import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    // The two users in the conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    // The property this conversation is about
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    // Last message for preview in conversation list
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // Unread count per user
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
)

const Conversation = mongoose.model('Conversation', conversationSchema)
export default Conversation
