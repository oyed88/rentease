import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { connectDB } from './config/db.js'

import authRoutes         from './routes/authRoutes.js'
import propertyRoutes     from './routes/propertyRoutes.js'
import messageRoutes      from './routes/messageRoutes.js'
import reviewRoutes       from './routes/reviewRoutes.js'
import paymentRoutes      from './routes/paymentRoutes.js'
import leadRoutes         from './routes/leadRoutes.js'
import inspectionRoutes   from './routes/inspectionRoutes.js'
import venueRoutes        from './routes/venueRoutes.js'
import bookingRoutes      from './routes/bookingRoutes.js'

dotenv.config()
connectDB()

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
})

// Make io accessible inside routes
app.set('io', io)

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes)
app.use('/api/properties',  propertyRoutes)
app.use('/api/messages',    messageRoutes)
app.use('/api/reviews',     reviewRoutes)
app.use('/api/payments',    paymentRoutes)
app.use('/api/leads',       leadRoutes)
app.use('/api/inspections', inspectionRoutes)
app.use('/api/venues',      venueRoutes)
app.use('/api/bookings',    bookingRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'RentEase API is running!' })
})

// ── Socket.io ─────────────────────────────────────────────────────────
const onlineUsers = new Map()

io.on('connection', (socket) => {

  // User comes online
  socket.on('user:online', (userId) => {
    onlineUsers.set(userId, socket.id)
    io.emit('users:online', Array.from(onlineUsers.keys()))
  })

  // Messaging
  socket.on('conversation:join', (conversationId) => {
    socket.join(conversationId)
  })

  socket.on('message:send', (data) => {
    io.to(data.conversationId).emit('message:received', data.message)
  })

  socket.on('typing:start', (data) => {
    socket.to(data.conversationId).emit('typing:start', {
      userId: data.userId,
      name: data.name,
    })
  })

  socket.on('typing:stop', (data) => {
    socket.to(data.conversationId).emit('typing:stop', {
      userId: data.userId,
    })
  })

  // Real-time inspection booking alert to admin
  socket.on('inspection:new', (data) => {
    io.emit('inspection:alert', data)
  })

  // Real-time lead alert to admin
  socket.on('lead:new', (data) => {
    io.emit('lead:alert', data)
  })

  // Real-time venue booking alert to admin
  socket.on('booking:new', (data) => {
    io.emit('booking:alert', data)
  })

  // User goes offline
  socket.on('disconnect', () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId)
      }
    })
    io.emit('users:online', Array.from(onlineUsers.keys()))
  })

})

// ── Start ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
