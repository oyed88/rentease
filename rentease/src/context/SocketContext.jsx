import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user, isLoggedIn } = useAuth()
  const [socket, setSocket]           = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!isLoggedIn || !user) return

    // Connect to Socket.io server
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      newSocket.emit('user:online', user._id)
    })

    newSocket.on('users:online', (users) => {
      setOnlineUsers(users)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [isLoggedIn, user])

  const isUserOnline = (userId) => onlineUsers.includes(userId)

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isUserOnline }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) throw new Error('useSocket must be used inside <SocketProvider>')
  return context
}
