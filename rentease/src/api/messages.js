import api from './axiosInstance'

export const messagesAPI = {
  // GET /api/messages/conversations
  getConversations: async () => {
    const response = await api.get('/messages/conversations')
    return response.data
  },

  // POST /api/messages/conversations
  startConversation: async ({ recipientId, propertyId }) => {
    const response = await api.post('/messages/conversations', { recipientId, propertyId })
    return response.data
  },

  // GET /api/messages/:conversationId
  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/${conversationId}`)
    return response.data
  },

  // POST /api/messages/:conversationId
  sendMessage: async (conversationId, text) => {
    const response = await api.post(`/messages/${conversationId}`, { text })
    return response.data
  },
}
