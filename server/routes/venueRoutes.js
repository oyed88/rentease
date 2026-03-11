import express from 'express'
import Venue from '../models/Venue.js'

const router = express.Router()

// GET /api/venues — list all venues (with optional type filter)
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.type) filter.type = req.query.type
    if (req.query.city) filter['location.city'] = new RegExp(req.query.city, 'i')

    const venues = await Venue.find(filter).sort({ createdAt: -1 })
    res.json(venues)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/venues/:id — single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
    if (!venue) return res.status(404).json({ message: 'Venue not found.' })
    res.json(venue)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/venues — create venue (admin)
router.post('/', async (req, res) => {
  try {
    const venue = await Venue.create(req.body)
    res.status(201).json(venue)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/venues/:id — update venue (admin)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/venues/:id — delete venue (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id)
    res.json({ message: 'Venue deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
