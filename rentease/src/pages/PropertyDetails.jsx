import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api/axiosInstance'
import { propertiesAPI } from '../api/properties'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(price)

const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function PropertyDetails() {
  const { id } = useParams()

  const [property, setProperty]     = useState(null)
  const [loading, setLoading]       = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  // Form state
  const [showForm, setShowForm]         = useState(false)
  const [formType, setFormType]         = useState('interest') // 'interest' | 'inspection'
  const [submitting, setSubmitting]     = useState(false)
  const [submitted, setSubmitted]       = useState(false)
  const [formError, setFormError]       = useState('')

  // Form fields
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate]       = useState('')
  const [time, setTime]       = useState('')

  const WHATSAPP_NUMBER = '2348149769770'

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertiesAPI.getOne(id)
        setProperty(data.property)
      } catch (err) {
        console.error('Failed to fetch property:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  const openForm = (type) => {
    setFormType(type)
    setSubmitted(false)
    setFormError('')
    setShowForm(true)
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setMessage('')
    setDate('')
    setTime('')
    setFormError('')
    setSubmitted(false)
  }

  const closeForm = () => {
    setShowForm(false)
    resetForm()
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!name.trim() || !phone.trim()) {
      setFormError('Name and phone number are required.')
      return
    }
    if (formType === 'inspection' && (!date || !time)) {
      setFormError('Please select a date and time for the inspection.')
      return
    }

    setFormError('')
    setSubmitting(true)

    try {
      if (formType === 'inspection') {
        // ── Book Inspection ──
        await axios.post('/inspections', {
          property:   id,
          buyerName:  name,
          buyerEmail: email,
          buyerPhone: phone,
          buyerAddress: address,
          date,
          time,
          message,
        })
      } else {
        // ── I'm Interested / Send Message ──
        await axios.post('/leads', {
          property:     id,
          buyerName:    name,
          buyerEmail:   email,
          buyerPhone:   phone,
          buyerAddress: address,
          message,
        })
      }

      setSubmitted(true)
      resetForm()
    } catch (err) {
      console.error(err)
      setFormError('Something went wrong. Please try WhatsApp instead.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  if (!property) {
    return (
      <div className="text-center py-32">
        <p className="font-display text-2xl text-dark mb-4">Property not found</p>
        <Link to="/properties" className="btn-primary">Browse Properties</Link>
      </div>
    )
  }

  const {
    title, description, price, purpose, type,
    location, images, bedrooms, bathrooms,
    size, amenities, landlord, isVerified, views,
  } = property

  // WhatsApp pre-filled message
  const whatsappMessage = encodeURIComponent(
    `Hi! I found a property on RentEase I'm interested in.\n\n` +
    `🏠 Property: ${title}\n` +
    `📍 Location: ${location?.city}, ${location?.state}\n` +
    `💰 Price: ${formatPrice(price)}\n\n` +
    `Please contact me with more details.`
  )
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/">Home</Link> →{' '}
        <Link to="/properties">Properties</Link> →{' '}
        <span className="text-gray-800">{title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── LEFT SIDE ── */}
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
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition ${
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
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <span>🛏 {bedrooms} Bedrooms</span>
            <span>🚿 {bathrooms} Bathrooms</span>
            {size > 0 && <span>📐 {size} m²</span>}
            <span>🏠 {type}</span>
            <span>👁 {views} views</span>
            {isVerified && (
              <span className="text-green-600 font-semibold">✅ Verified</span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Amenities */}
          {amenities?.length > 0 && (
            <div className="mb-6">
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

          {/* ── PRIVATE NOTICE (visible to public, details go to admin only) ── */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            🔒 <strong>Privacy notice:</strong> When you submit your phone number and address
            through our contact forms, this information is kept <strong>private</strong> and
            only visible to the RentEase admin. It will never be shown publicly.
          </div>

        </div>

        {/* ── RIGHT SIDE ── */}
        <aside className="lg:w-80">
          <div className="card p-6 sticky top-24">

            {/* Price */}
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {formatPrice(price)}
            </p>
            {purpose === 'rent' && (
              <p className="text-sm text-gray-400 mb-2">per year</p>
            )}

            {/* Purpose badge */}
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
              purpose === 'rent'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              For {purpose === 'rent' ? 'Rent' : 'Sale'}
            </span>

            {/* Landlord */}
            <div className="border-t pt-4 mb-6">
              <p className="text-sm text-gray-500 mb-3">Listed by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
                  {landlord?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{landlord?.name}</p>
                  <p className="text-xs text-gray-400">{landlord?.email}</p>
                </div>
              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div className="flex flex-col gap-3">

              {/* I'm Interested */}
              <button
                onClick={() => openForm('interest')}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              >
                ⭐ I'm Interested
              </button>

              {/* Book Inspection */}
              <button
                onClick={() => openForm('inspection')}
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
              >
                🏠 Book Inspection
              </button>

              {/* WhatsApp */}
              
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>

              {/* Open Chat */}
              <Link
                to="/messages"
                className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition text-center"
              >
                💬 Open Chat
              </Link>

            </div>

            {/* Privacy note on sidebar */}
            <p className="text-xs text-gray-400 mt-4 text-center">
              🔒 Your phone & address are private — admin only
            </p>

          </div>
        </aside>

      </div>

      {/* ════════════════════════════════════════════
          CONTACT FORM POPUP
      ════════════════════════════════════════════ */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Form Header */}
            <div className={`p-6 pb-4 rounded-t-2xl ${
              formType === 'inspection'
                ? 'bg-orange-500'
                : 'bg-blue-600'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {formType === 'inspection'
                      ? '🏠 Book Property Inspection'
                      : '⭐ Express Interest'}
                  </h2>
                  <p className="text-sm text-white/80 mt-1">
                    {formType === 'inspection'
                      ? 'Schedule a visit to see this property'
                      : 'Let us know you\'re interested in this property'}
                  </p>
                </div>
                <button
                  onClick={closeForm}
                  className="text-white/80 hover:text-white text-2xl leading-none ml-4"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">

              {/* ── SUCCESS STATE ── */}
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {formType === 'inspection'
                      ? 'Inspection Booked!'
                      : 'Interest Submitted!'}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    We've received your details. The admin will contact you shortly.
                    You can also reach us directly on WhatsApp.
                  </p>

                  {/* WhatsApp after success */}
                  
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition mb-3"
                  >
                    <WhatsAppIcon />
                    Follow Up on WhatsApp
                  </a>

                  <button
                    onClick={closeForm}
                    className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Property being enquired ── */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center gap-3">
                    {images?.[0]?.url && (
                      <img
                        src={images[0].url}
                        alt={title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{title}</p>
                      <p className="text-xs text-gray-400 truncate">
                        📍 {location?.city}, {location?.state}
                      </p>
                      <p className="text-xs font-bold text-blue-600">{formatPrice(price)}</p>
                    </div>
                  </div>

                  {/* ── Error ── */}
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                      ⚠️ {formError}
                    </div>
                  )}

                  {/* ── FORM FIELDS ── */}

                  {/* Name */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        (🔒 private — admin only)
                      </span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 08012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                      <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. john@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Address
                      <span className="text-xs text-gray-400 font-normal ml-1">
                        (🔒 private — admin only)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Adeola Street, Lagos"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Inspection-only: Date + Time */}
                  {formType === 'inspection' && (
                    <>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Time <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                        >
                          <option value="">Select a time slot</option>
                          <option>9:00 AM</option>
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                          <option>12:00 PM</option>
                          <option>1:00 PM</option>
                          <option>2:00 PM</option>
                          <option>3:00 PM</option>
                          <option>4:00 PM</option>
                          <option>5:00 PM</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Message */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                      <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <textarea
                      placeholder={
                        formType === 'inspection'
                          ? 'Any special requests for the inspection?'
                          : 'Tell us more about what you\'re looking for...'
                      }
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Privacy reminder */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 text-xs text-gray-500 flex gap-2">
                    <span>🔒</span>
                    <span>
                      Your phone number and address are <strong>private</strong>.
                      They are only visible to the RentEase admin and never shown to other users.
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`w-full text-white font-semibold py-3 rounded-xl transition mb-3 disabled:opacity-60 ${
                      formType === 'inspection'
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {submitting
                      ? 'Sending...'
                      : formType === 'inspection'
                      ? '📅 Confirm Inspection Booking'
                      : '⭐ Submit Interest'}
                  </button>

                  {/* WhatsApp alternative */}
                  
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition mb-3"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Or Contact Us on WhatsApp
                  </a>

                  {/* Cancel */}
                  <button
                    onClick={closeForm}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
                  >
                    Cancel
                  </button>

                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}