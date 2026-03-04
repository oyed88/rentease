import { useState, useEffect } from 'react'
import { messagesAPI } from '../api/messages'
import MessageList from '../components/messaging/MessageList'
import ChatWindow from '../components/messaging/ChatWindow'

export default function Messages() {
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv]       = useState(null)
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await messagesAPI.getConversations()
        setConversations(data.conversations)
        // Auto-open first conversation
        if (data.conversations.length > 0) {
          setActiveConv(data.conversations[0])
        }
      } catch (err) {
        console.error('Failed to load conversations:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-dark mb-6">Messages</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        style={{ height: '70vh' }}>
        <div className="flex h-full">

          {/* Conversation List — left sidebar */}
          <div className="w-80 shrink-0 border-r border-gray-100 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-body font-medium text-dark text-sm">
                Conversations ({conversations.length})
              </p>
            </div>
            <MessageList
              conversations={conversations}
              loading={loading}
              activeId={activeConv?._id}
              onSelect={setActiveConv}
            />
          </div>

          {/* Chat Window — right */}
          <div className="flex-1 flex flex-col">
            {activeConv ? (
              <ChatWindow conversation={activeConv} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-10">
                <div>
                  <p className="text-5xl mb-4">💬</p>
                  <h3 className="font-display text-xl font-semibold text-dark mb-2">
                    No conversation selected
                  </h3>
                  <p className="font-body text-gray-500 text-sm">
                    Select a conversation or start one from a property listing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
