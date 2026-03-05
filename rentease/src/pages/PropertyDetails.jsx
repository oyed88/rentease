import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api/axiosInstance'
import { propertiesAPI } from '../api/properties'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(price)

export default function PropertyDetails() {

  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // Your WhatsApp number
  const WHATSAPP_NUMBER = "2348149769770"

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await propertiesAPI.getOne(id)
        setProperty(data.property)
      } catch (err) {
        console.error('Failed to fetch property:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const sendMessage = async () => {
    try {
      await axios.post('/api/leads', {
        property: id,
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone,
        message: message
      })
      alert('Your interest has been sent successfully!')
      setShowForm(false)
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    } catch (error) {
      console.error(error)
      alert('Failed to send message')
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  if (!property) {
    return (
      <div className="text-center py-32">
        <p className="font-display text-2xl text-dark mb-4">
          Property not found
        </p>
        <Link to="/properties" className="btn-primary">
          Browse Properties
        </Link>
      </div>
    )
  }

  const {
    title,
    description,
    price,
    purpose,
    type,
    location,
    images,
    bedrooms,
    bathrooms,
    size,
    amenities,
    landlord,
    isVerified,
    views
  } = property

  // Build WhatsApp link for this property
  const whatsappMessage = encodeURIComponent(
    `Hi! I found a property on RentEase I'm interested in.\n\nProperty: ${title}\nLocation: ${location?.city}, ${location?.state}\nPrice: ${formatPrice(price)}\n\nPlease contact me with more details.`
  )
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/">Home</Link> →{' '}
        <Link to="/properties">Properties</Link> →{' '}
        <span>{title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* LEFT SIDE */}
        <div className="flex-1">

          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden h-96 mb-4 bg-gray-100">
            {images?.length > 0 ? (
              <img
                src={images[activeImage]?.url}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images?.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 rounded overflow-hidden border-2 ${
                    activeImage === i ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">{title}</h1>

          <p className="text-gray-500 mb-4">
            📍 {location?.address}, {location?.city}, {location?.state}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
            <span>🛏 {bedrooms} Bedrooms</span>
            <span>🚿 {bathrooms} Bathrooms</span>
            {size > 0 && <span>📐 {size} m²</span>}
            <span>🏠 {type}</span>
            <span>👁 {views} views</span>
            {isVerified && <span className="text-green-600 font-medium">✅ Verified</span>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <span key={a} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SIDE */}
        <aside className="lg:w-80">
          <div className="card p-6 sticky top-24">

            {/* Price */}
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {formatPrice(price)}
            </p>
            {purpose === 'rent' && (
              <p className="text-sm text-gray-400 mb-6">per year</p>
            )}

            {/* Landlord */}
            <div className="border-t pt-4 mb-6">
              <p className="text-sm text-gray-500 mb-3">Listed by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {landlord?.name?.[0]}
                </div>
                <div>
                  <p className="font-medium">{landlord?.name}</p>
                  <p className="text-xs text-gray-400">{landlord?.email}</p>
                </div>
              </div>
            </div>

            {/* CONTACT BUTTONS */}
            <div className="flex flex-col gap-3">

              {/* Send Message */}
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary w-full"
              >
                💬 Send Message
              </button>

              {/* I'm Interested */}
              <button
                onClick={() => setShowForm(true)}
                className="btn-secondary w-full"
              >
                ⭐ I'm Interested
              </button>

              {/* Book Inspection */}
              <Link
                to={`/properties/${id}/inspect`}
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-center"
              >
                🏠 Book Inspection
              </Link>

              {/* WhatsApp */}
              
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>

              {/* Open Chat */}
              <Link
                to="/messages"
                className="btn-secondary text-center w-full"
              >
                Open Chat
              </Link>

            </div>

          </div>
        </aside>

      </div>

      {/* CONTACT FORM POPUP */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-1">
              Contact About This Property
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              We'll send your message to the landlord.
            </p>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={sendMessage}
              className="btn-primary w-full mb-2"
            >
              Send Message
            </button>

            {/* WhatsApp fallback inside form */}
            
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition mb-3"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Or WhatsApp Us Directly
            </a>

            <button
              onClick={() => setShowForm(false)}
              className="text-sm text-gray-400 hover:text-gray-600 w-full text-center"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  )
}