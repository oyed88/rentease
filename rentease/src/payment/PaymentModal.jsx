import { useState } from 'react'
import { paymentsAPI } from '../../api/payments'
import Button from '../shared/Button'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)

export default function PaymentModal({ property, type = 'rent', onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await paymentsAPI.initialize({
        propertyId: property._id,
        amount:     property.price,
        type,
      })

      // Redirect to Paystack payment page
      window.location.href = data.authorizationUrl
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-dark">Confirm Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* Property Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="font-body text-sm text-gray-500 mb-1">Property</p>
          <p className="font-body font-medium text-dark">{property.title}</p>
          <p className="font-body text-sm text-gray-500">
            📍 {property.location?.city}, {property.location?.state}
          </p>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between font-body text-sm">
            <span className="text-gray-500 capitalize">{type} amount</span>
            <span className="font-medium text-dark">{formatPrice(property.price)}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-gray-500">Payment method</span>
            <span className="font-medium text-dark">Paystack</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-body font-bold">
            <span className="text-dark">Total</span>
            <span className="text-primary-600 text-lg">{formatPrice(property.price)}</span>
          </div>
        </div>

        {error && (
          <p className="font-body text-sm text-red-500 mb-4 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
          <Button loading={loading} onClick={handlePayment} fullWidth>
            Pay with Paystack
          </Button>
        </div>

        <p className="font-body text-xs text-gray-400 text-center mt-4">
          🔒 Secured by Paystack. Your payment is safe.
        </p>
      </div>
    </div>
  )
}
