import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function MessageList({ conversations, loading, activeId, onSelect }) {
  const { user } = useAuth()
  const { isUserOnline } = useSocket()

  if (loading) return <LoadingSpinner className="py-10" />

  if (conversations.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-3xl mb-2">💬</p>
        <p className="font-body text-sm text-gray-500">No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => {
        // Get the other person in the conversation
        const other = conv.participants.find(p => p._id !== user._id)
        const isOnline = isUserOnline(other?._id)
        const isActive = conv._id === activeId

        return (
          <button
            key={conv._id}
            onClick={() => onSelect(conv)}
            className={`flex items-start gap-3 p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              isActive ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-display font-bold text-primary-600">
                  {other?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="font-body font-medium text-dark text-sm truncate">{other?.name}</p>
                <p className="font-body text-xs text-gray-400 shrink-0 ml-2">
                  {new Date(conv.lastMessageAt).toLocaleDateString()}
                </p>
              </div>
              {conv.property && (
                <p className="font-body text-xs text-primary-600 mb-0.5 truncate">
                  🏠 {conv.property?.title}
                </p>
              )}
              <p className="font-body text-xs text-gray-500 truncate">
                {conv.lastMessage || 'Start a conversation'}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
