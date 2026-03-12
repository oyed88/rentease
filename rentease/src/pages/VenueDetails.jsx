import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from '../api/axiosInstance'

const WHATSAPP_NUMBER = '2348149769770'

const TYPE_LABELS = {
  event_centre: { label: 'Event Centre', icon: '🎉' },
  shortlet:     { label: 'Short-let',    icon: '🏠' },
  office_space: { label: 'Office Space', icon: '🏢' },
}

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)

export default function VenueDetails() {
  const { id } = useParams()

  const [venue, setVenue]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [showForm, setShowForm]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Form fields
  const [guestName, setGuestName]         = useState('')
  const [guestEmail, setGuestEmail]       = useState('')
  const [guestPhone, setGuestPhone]       = useState('')
  const [guestAddress, setGuestAddress]   = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(1)
  const [roomType, setRoomType]           = useState('')
  const [checkIn, setCheckIn]             = useState('')
  const [checkOut, setCheckOut]           = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get('/venues/' + id)
        setVenue(res.data)
      } catch (err) {
        console.error('Failed to fetch venue:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVenue()
  }, [id])

  const resetForm = () => {
    setGuestName('')
    setGuestEmail('')
    setGuestPhone('')
    setGuestAddress('')
    setNumberOfGuests(1)
    setRoomType('')
    setCheckIn('')
    setCheckOut('')
    setSpecialRequests('')
    setFormError('')
  }

  const handleSubmit = async () => {
    if (!guestName || !guestPhone || !checkIn || !checkOut) {
      setFormError('Please fill in your name, phone, check-in and check-out.')
      return
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setFormError('Check-out must be after check-in.')
      return
    }
    setFormError('')
    setSubmitting(true)
    try {
      await axios.post('/bookings', {
        venue: id,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress,
        numberOfGuests,
        roomType,
        checkIn,
        checkOut,
        specialRequests,
      })
      setSubmitted(true)
      resetForm()
    } catch (err) {
      console.error(err)
      setFormError('Something went wrong. Please try WhatsApp instead.')
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappText = encodeURIComponent(
    'Hi! I want to book a venue on RentEase.\n\n' +
    'Venue: ' + (venue?.title || '') + '\n' +
    'Type: ' + (TYPE_LABELS[venue?.type]?.label || '') + '\n' +
    'Name: ' + guestName + '\n' +
    'Phone: ' + guestPhone + '\n' +
    'Check-in: ' + checkIn + '\n' +
    'Check-out: ' + checkOut + '\n' +
    'Guests: ' + numberOfGuests + '\n' +
    'Room type: ' + (roomType || 'Not selected') + '\n' +
    'Special requests: ' + (specialRequests || 'None')
  )
  const whatsappLink = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + whatsappText

  if (loading) return <div className="p-10 text-center text-gray-400">Loading venue...</div>

  if (!venue) {
    return (
      <div className="text-center py-32">
        <p className="text-2xl font-bold text-gray-600 mb-4">Venue not found</p>
        <Link to="/venues" className="text-blue-600 hover:underline">Browse Venues</Link>
      </div>
    )
  }

  const typeInfo = TYPE_LABELS[venue.type] || TYPE_LABELS.event_centre
  const priceDisplay = venue.pricePerHour
    ? formatPrice(venue.pricePerHour) + ' / hr'
    : venue.pricePerNight
    ? formatPrice(venue.pricePerNight) + ' / night'
    : venue.pricePerDay
    ? formatPrice(venue.pricePerDay) + ' / day'
    : 'Contact for price'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <Link to="/">Home</Link>
        {' → '}
        <Link to="/venues">Venues</Link>
        {' → '}
        <span className="text-gray-800">{venue.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* LEFT */}
        <div className="flex-1">

          {/* Main image */}
          <div className="rounded-2xl overflow-hidden h-96 mb-4 bg-gray-100">
            {venue.images?.length > 0 ? (
              <img
                src={venue.images[activeImage]?.url}
                alt={venue.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl">
                {typeInfo.icon}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {venue.images?.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {venue.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={'w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ' +
                    (activeImage === i ? 'border-blue-500' : 'border-transparent')}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title and type */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">{venue.title}</h1>
            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              {typeInfo.icon} {typeInfo.label}
            </span>
          </div>

          <p className="text-gray-400 mb-4">
            📍 {venue.location?.address}, {venue.location?.city}, {venue.location?.state}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            {venue.capacity > 0 && <span>👥 Up to {venue.capacity} guests</span>}
            {venue.isVerified && <span className="text-green-600 font-semibold">✅ Verified</span>}
            <span className={venue.isAvailable ? 'text-green-600' : 'text-red-500'}>
              {venue.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">About this venue</h2>
            <p className="text-gray-600 leading-relaxed">{venue.description}</p>
          </div>

          {/* Room types */}
          {venue.roomTypes?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Room Types</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {venue.roomTypes.map((room, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <p className="font-semibold text-gray-800">{room.name}</p>
                    {room.description && <p className="text-sm text-gray-500 mt-1">{room.description}</p>}
                    {room.price > 0 && (
                      <p className="text-blue-600 font-bold mt-2">{formatPrice(room.price)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {venue.amenities?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((a) => (
                  <span key={a} className="bg-gray-100 px-3 py-1 rounded-full text-sm">✓ {a}</span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            🔒 <strong>Privacy:</strong> Your phone and address are private and only visible to the RentEase admin.
          </div>

        </div>

        {/* RIGHT — Booking card */}
        <aside className="lg:w-80">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-24">

            <p className="text-3xl font-bold text-blue-600 mb-1">{priceDisplay}</p>
            <p className="text-xs text-gray-400 mb-5">Prices may vary by room type</p>

            <div className="flex flex-col gap-3">

              <button
                onClick={() => setShowForm(true)}
                disabled={!venue.isAvailable}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
              >
                📅 Book This Venue
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire on WhatsApp
              </a>

              <Link
                to="/venues"
                className="flex items-center justify-center w-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-3 rounded-xl transition text-sm"
              >
                Browse Other Venues
              </Link>

            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              🔒 Your phone and address are private
            </p>

          </div>
        </aside>

      </div>

      {/* BOOKING FORM POPUP */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">

            {/* Header */}
            <div className="bg-blue-600 rounded-t-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">📅 Book Venue</h2>
                  <p className="text-white opacity-80 text-sm mt-1">{venue.title}</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white opacity-70 hover:opacity-100 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">

              {/* Success */}
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Booking Submitted!</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    We have received your booking. The admin will confirm shortly and contact you.
                  </p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition mb-3"
                  >
                    Follow Up on WhatsApp
                  </a>
                  <button
                    onClick={() => { setShowForm(false); setSubmitted(false) }}
                    className="text-sm text-gray-400 hover:text-gray-600"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                      ⚠️ {formError}
                    </div>
                  )}

                  {/* Guest name */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. John Doe" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-400 font-normal ml-1">(🔒 admin only)</span>
                    </label>
                    <input type="tel" placeholder="e.g. 08012345678" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-xs text-gray-400 font-normal">(optional)</span></label>
                    <input type="email" placeholder="e.g. john@email.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Address
                      <span className="text-xs text-gray-400 font-normal ml-1">(🔒 admin only)</span>
                    </label>
                    <input type="text" placeholder="e.g. 12 Adeola Street, Lagos" value={guestAddress} onChange={(e) => setGuestAddress(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Number of guests */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                    <input type="number" min="1" max={venue.capacity || 999} value={numberOfGuests} onChange={(e) => setNumberOfGuests(Number(e.target.value))} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    {venue.capacity > 0 && (
                      <p className="text-xs text-gray-400 mt-1">Maximum capacity: {venue.capacity} guests</p>
                    )}
                  </div>

                  {/* Room type */}
                  {venue.roomTypes?.length > 0 && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                      <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="">Select a room type</option>
                        {venue.roomTypes.map((room, i) => (
                          <option key={i} value={room.name}>
                            {room.name} {room.price > 0 ? '— ' + formatPrice(room.price) : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Check-in */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date <span className="text-red-500">*</span>
                    </label>
                    <input type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Check-out */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date <span className="text-red-500">*</span>
                    </label>
                    <input type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Special requests */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests <span className="text-xs text-gray-400 font-normal">(optional)</span></label>
                    <textarea placeholder="Any special requirements or questions?" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {/* Privacy note */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 text-xs text-gray-500 flex gap-2">
                    <span>🔒</span>
                    <span>Your phone and address are <strong>private</strong>. Only the admin can see them.</span>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition mb-3"
                  >
                    {submitting ? 'Submitting...' : '📅 Confirm Booking'}
                  </button>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition mb-3"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Or Book via WhatsApp
                  </a>

                  <button onClick={() => setShowForm(false)} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">Cancel</button>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
