import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema(
  {
    // The venue being booked
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },

    // Guest details
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, trim: true, default: '' },
    guestPhone: { type: String, required: true, trim: true },
    guestAddress: { type: String, trim: true, default: '' },
    numberOfGuests: { type: Number, default: 1 },

    // Booking details
    roomType: { type: String, default: '' },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    specialRequests: { type: String, default: '' },

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', BookingSchema)
