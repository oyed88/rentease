import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'land', 'commercial', 'shortlet'],
      required: [true, 'Property type is required'],
    },
    purpose: {
      type: String,
      enum: ['rent', 'sale'],
      required: [true, 'Purpose is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    location: {
      address: { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      country: { type: String, default: 'Nigeria' },
    },
    images: [
      {
        url:       { type: String, required: true },
        publicId:  { type: String, required: true }, // Cloudinary public ID
      },
    ],
    amenities: [String], // e.g. ['wifi', 'parking', 'generator']
    bedrooms:  { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    size:      { type: Number, default: 0 }, // in square meters
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isVerified:  { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    views:       { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

const Property = mongoose.model('Property', propertySchema)
export default Property
