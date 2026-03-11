import express from 'express'
import Booking from '../models/Booking.js'

const router = express.Router()

// POST /api/bookings — guest creates a booking
router.post('/', async (req, res) => {
  try {
    const {
      venue, guestName, guestEmail, guestPhone,
      guestAddress, numberOfGuests, roomType,
      checkIn, checkOut, specialRequests,
    } = req.body

    if (!venue || !guestName || !guestPhone || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Venue, name, phone, check-in and check-out are required.' })
    }

    const booking = await Booking.create({
      venue, guestName, guestEmail, guestPhone,
      guestAddress, numberOfGuests, roomType,
      checkIn, checkOut, specialRequests,
    })

    // Real-time alert to admin
    const io = req.app.get('io')
    if (io) {
      io.emit('booking:alert', {
        message: guestName + ' booked a venue for ' + checkIn + ' to ' + checkOut,
        booking,
      })
    }

    res.status(201).json(booking)
  } catch (err) {
    console.error('Booking error:', err)
    res.status(500).json({ message: err.message })
  }
})

// GET /api/bookings — admin gets all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('venue', 'title type location')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/bookings/:id — single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('venue', 'title type location')
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/bookings/:id — admin confirms or cancels
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' })
    }
    const updated = await Booking.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    ).populate('venue', 'title')
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/bookings/:id
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ message: 'Booking deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
