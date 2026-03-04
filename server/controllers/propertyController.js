import Property from '../models/Property.js'
import cloudinary from '../config/cloudinary.js'

// ─────────────────────────────────────────────
// @route   GET /api/properties
// @desc    Get all properties with search & filter
// @access  Public
// ─────────────────────────────────────────────
export const getProperties = async (req, res) => {
  try {
    const {
      city, type, purpose, minPrice, maxPrice,
      bedrooms, search, page = 1, limit = 12,
    } = req.query

    // Build filter object
    const filter = { isAvailable: true }

    if (city)     filter['location.city'] = { $regex: city, $options: 'i' }
    if (type)     filter.type = type
    if (purpose)  filter.purpose = purpose
    if (bedrooms) filter.bedrooms = Number(bedrooms)
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      filter.$or = [
        { title:                { $regex: search, $options: 'i' } },
        { 'location.city':      { $regex: search, $options: 'i' } },
        { 'location.address':   { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Property.countDocuments(filter)
    const properties = await Property.find(filter)
      .populate('landlord', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  } catch (error) {
    console.error('Get properties error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   GET /api/properties/:id
// @desc    Get single property
// @access  Public
// ─────────────────────────────────────────────
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'name email phone avatar')

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Increment view count
    property.views += 1
    await property.save()

    res.json({ property })
  } catch (error) {
    console.error('Get property error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   POST /api/properties
// @desc    Create new property listing
// @access  Private (landlord, agent)
// ─────────────────────────────────────────────
export const createProperty = async (req, res) => {
  try {
    const {
      title, description, type, purpose, price,
      address, city, state, bedrooms, bathrooms,
      size, amenities,
    } = req.body

    // Get uploaded images from Cloudinary (via multer middleware)
    const images = req.files
      ? req.files.map((file) => ({
          url:      file.path,
          publicId: file.filename,
        }))
      : []

    const property = await Property.create({
      title,
      description,
      type,
      purpose,
      price:    Number(price),
      location: { address, city, state },
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      size:     Number(size) || 0,
      amenities: amenities ? amenities.split(',') : [],
      images,
      landlord: req.user._id,
    })

    res.status(201).json({
      message: 'Property listed successfully',
      property,
    })
  } catch (error) {
    console.error('Create property error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (owner only)
// ─────────────────────────────────────────────
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Check ownership
    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this property' })
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    )

    res.json({ message: 'Property updated', property: updated })
  } catch (error) {
    console.error('Update property error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (owner only)
// ─────────────────────────────────────────────
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Check ownership
    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' })
    }

    // Delete images from Cloudinary
    for (const image of property.images) {
      await cloudinary.uploader.destroy(image.publicId)
    }

    await property.deleteOne()
    res.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Delete property error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ─────────────────────────────────────────────
// @route   GET /api/properties/my-listings
// @desc    Get properties listed by logged-in user
// @access  Private
// ─────────────────────────────────────────────
export const getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ landlord: req.user._id })
      .sort({ createdAt: -1 })

    res.json({ properties })
  } catch (error) {
    console.error('Get my listings error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
