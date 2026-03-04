import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { messagesAPI } from '../../api/messages'
import LoadingSpinner from '../shared/LoadingSpinner'

export default function ChatWindow({ conversation }) {
  const { user } = useAuth()
  const { socket, isUserOnline } = useSocket()
  const [messages, setMessages]   = useState([])
  const [text, setText]           = useState('')
  const [loading, setLoading]     = useState(true)
  const [typing, setTyping]       = useState(false)
  const [typingUser, setTypingUser] = useState(null)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  const other = conversation.participants.find(p => p._id !== user._id)
  const isOnline = isUserOnline(other?._id)

  // Load messages
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await messagesAPI.getMessages(conversation._id)
        setMessages(data.messages)
      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Join socket room
    if (socket) {
      socket.emit('conversation:join', conversation._id)

      // Listen for new messages
      socket.on('message:received', (message) => {
        setMessages(prev => [...prev, message])
      })

      // Listen for typing
      socket.on('typing:start', ({ name }) => setTypingUser(name))
      socket.on('typing:stop',  ()         => setTypingUser(null))
    }

    return () => {
      if (socket) {
        socket.off('message:received')
        socket.off('typing:start')
        socket.off('typing:stop')
      }
    }
  }, [conversation._id, socket])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleTyping = (e) => {
    setText(e.target.value)
    if (!socket) return

    if (!typing) {
      setTyping(true)
      socket.emit('typing:start', {
        conversationId: conversation._id,
        userId: user._id,
        name: user.name,
      })
    }

    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      setTyping(false)
      socket.emit('typing:stop', { conversationId: conversation._id, userId: user._id })
    }, 1500)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      const data = await messagesAPI.sendMessage(conversation._id, text.trim())
      setMessages(prev => [...prev, data.message])

      // Broadcast via socket
      if (socket) {
        socket.emit('message:send', {
          conversationId: conversation._id,
          message: data.message,
        })
      }

      setText('')
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (loading) return <LoadingSpinner className="flex-1 py-20" />

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white">
        <div className="relative">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="font-display font-bold text-primary-600">
              {other?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <p className="font-body font-medium text-dark text-sm">{other?.name}</p>
          <p className="font-body text-xs text-gray-400 capitalize">
            {isOnline ? '🟢 Online' : '⚫ Offline'} · {other?.role}
          </p>
        </div>
        {conversation.property && (
          <div className="ml-auto text-right">
            <p className="font-body text-xs text-gray-400">About</p>
            <p className="font-body text-xs text-primary-600 font-medium truncate max-w-32">
              {conversation.property?.title}
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="font-body text-sm text-gray-400">
              Say hi to start the conversation!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender._id === user._id || msg.sender === user._id
          return (
            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                isMe
                  ? 'bg-primary-500 text-white rounded-br-sm'
                  : 'bg-white text-dark shadow-sm rounded-bl-sm'
              }`}>
                <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                <p className={`font-body text-xs mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                  {formatTime(msg.createdAt)}
                  {isMe && msg.isRead && ' · Read'}
                </p>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {typingUser && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
              <p className="font-body text-xs text-gray-400">{typingUser} is typing...</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-white">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 input-field py-2.5"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 disabled:opacity-40 transition-colors shrink-0"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
