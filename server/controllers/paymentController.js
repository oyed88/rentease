import axios from 'axios'
import Payment from '../models/Payment.js'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

// ─────────────────────────────────────────────
// @route   POST /api/payments/initialize
// @desc    Initialize a Paystack payment
// @access  Private
// ─────────────────────────────────────────────
export const initializePayment = async (req, res) => {
  try {
    const { propertyId, amount, type, email } = req.body

    // Initialize transaction with Paystack
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email || req.user.email,
        amount: amount * 100, // Paystack uses kobo (multiply by 100)
        currency: 'NGN',
        metadata: {
          propertyId,
          userId: req.user._id,
          type,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const { authorization_url, reference } = response.data.data

    // Save pending payment to DB
    await Payment.create({
      user:      req.user._id,
      property:  propertyId,
      amount,
      reference,
      type,
      status:    'pending',
    })

    res.json({
      authorizationUrl: authorization_url,
      reference,
    })
  } catch (error) {
    console.error('Initialize payment error:', error)
    res.status(500).json({ message: 'Payment initialization failed' })
  }
}

// ─────────────────────────────────────────────
// @route   GET /api/payments/verify/:reference
// @desc    Verify a Paystack payment
// @access  Private
// ─────────────────────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      }
    )

    const { status, data } = response.data

    if (status && data.status === 'success') {
      // Update payment in DB
      await Payment.findOneAndUpdate(
        { reference },
        { status: 'success', paystackData: data },
        { new: true }
      )
      return res.json({ success: true, message: 'Payment verified successfully' })
    }

    await Payment.findOneAndUpdate({ reference }, { status: 'failed' })
    res.status(400).json({ success: false, message: 'Payment verification failed' })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({ message: 'Payment verification failed' })
  }
}

// ─────────────────────────────────────────────
// @route   GET /api/payments/history
// @desc    Get payment history for logged-in user
// @access  Private
// ─────────────────────────────────────────────
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('property', 'title location images price')
      .sort({ createdAt: -1 })

    res.json({ payments })
  } catch (error) {
    console.error('Get payment history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
