import mongoose from 'mongoose'

const VenueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['event_centre', 'shortlet', 'office_space'],
      required: true,
    },
    pricePerNight: { type: Number, default: 0 },
    pricePerHour: { type: Number, default: 0 },
    pricePerDay: { type: Number, default: 0 },

    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
    },

    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],

    amenities: [{ type: String }],
    capacity: { type: Number, default: 1 },

    roomTypes: [
      {
        name: { type: String },
        description: { type: String },
        price: { type: Number },
      },
    ],

    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Venue', VenueSchema)
