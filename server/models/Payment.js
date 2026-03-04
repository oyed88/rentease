import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['rent', 'purchase', 'deposit'],
      required: true,
    },
    paystackData: {
      type: Object, // raw response from Paystack
      default: {},
    },
  },
  { timestamps: true }
)

const Payment = mongoose.model('Payment', paymentSchema)
export default Payment
