import express from 'express'
import Lead from '../models/Lead.js'

const router = express.Router()

// POST /api/leads — Buyer submits interest
router.post('/', async (req, res) => {
  try {
    const {
      property,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      message,
    } = req.body

    if (!property || !buyerName || !buyerPhone) {
      return res.status(400).json({
        message: 'Property, name and phone number are required.',
      })
    }

    const lead = await Lead.create({
      property,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerAddress,
      message,
    })

    // Real-time alert to admin
    const io = req.app.get('io')
    if (io) {
      io.emit('lead:alert', {
        message: `📩 New interest from ${buyerName}`,
        lead,
      })
    }

    res.status(201).json(lead)
  } catch (err) {
    console.error('Lead creation error:', err)
    res.status(500).json({ message: err.message })
  }
})

// GET /api/leads — Admin gets all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('property', 'title location')
      .sort({ createdAt: -1 })
    res.json(leads)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/leads/:id — Single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('property', 'title location')
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' })
    }
    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PATCH /api/leads/:id — Update lead status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body

    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' })
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('property', 'title')

    if (!updated) {
      return res.status(404).json({ message: 'Lead not found.' })
    }

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/leads/:id — Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id)
    res.json({ message: 'Lead deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router