import mongoose from 'mongoose'

const LeadSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
    },
    buyerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    buyerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    buyerAddress: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Lead', LeadSchema)