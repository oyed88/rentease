import express from 'express'
import Inspection from '../models/Inspection.js'

const router = express.Router()

// POST /api/inspections — Buyer books inspection
router.post('/', async (req, res) => {
  try {
    const { property, buyerName, buyerPhone, date, time } = req.body

    if (!property || !buyerName || !buyerPhone || !date || !time) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    const inspection = await Inspection.create({
      property,
      buyerName,
      buyerPhone,
      date,
      time,
    })

    // ✅ Emit real-time alert to admin
    const io = req.app.get('io')
    if (io) {
      io.emit('inspection:alert', {
        message: `📅 New inspection booked by ${buyerName}`,
        inspection,
      })
    }

    res.status(201).json(inspection)
  } catch (err) {
    console.error('Inspection booking error:', err)
    res.status(500).json({ message: err.message })
  }
})

// GET /api/inspections — Admin gets all inspections
router.get('/', async (req, res) => {
  try {
    const inspections = await Inspection.find()
      .populate('property', 'title location')
      .sort({ createdAt: -1 })
    res.json(inspections)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/inspections/:id — Single inspection
router.get('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('property', 'title location')
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found.' })
    }
    res.json(inspection)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/inspections/:id — Admin confirms or cancels
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' })
    }

    const updated = await Inspection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('property', 'title')

    if (!updated) {
      return res.status(404).json({ message: 'Inspection not found.' })
    }

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/inspections/:id — Admin deletes inspection
router.delete('/:id', async (req, res) => {
  try {
    await Inspection.findByIdAndDelete(req.params.id)
    res.json({ message: 'Inspection deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router