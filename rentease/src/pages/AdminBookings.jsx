import { useEffect, useState } from 'react'
import axios from '../api/axiosInstance'

const WHATSAPP_NUMBER = '2348149769770'

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

const TYPE_LABELS = {
  event_centre: '🎉 Event Centre',
  shortlet:     '🏠 Short-let',
  office_space: '🏢 Office Space',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/bookings')
        setBookings(res.data)
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.patch('/bookings/' + bookingId, { status })
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      )
    } catch (err) {
      console.error('Failed to update booking:', err)
      alert('Could not update booking status.')
    }
  }

  const guestWhatsApp = (booking) => {
    const msg = encodeURIComponent(
      'Hi ' + booking.guestName + '! This is RentEase.\n\n' +
      'Your booking for ' + (booking.venue?.title || 'the venue') + ' is ' +
      (booking.status === 'confirmed' ? '✅ CONFIRMED' : '❌ CANCELLED') + '.\n\n' +
      'Check-in: ' + booking.checkIn + '\n' +
      'Check-out: ' + booking.checkOut + '\n\n' +
      'Thank you for choosing RentEase!'
    )
    const phone = booking.guestPhone?.replace(/\D/g, '')
    return 'https://wa.me/' + phone + '?text=' + msg
  }

  const adminWhatsApp = (booking) => {
    const msg = encodeURIComponent(
      '📅 New Venue Booking\n\n' +
      'Venue: ' + (booking.venue?.title || 'Venue') + '\n' +
      'Type: ' + (TYPE_LABELS[booking.venue?.type] || '') + '\n' +
      'Guest: ' + booking.guestName + '\n' +
      'Phone: ' + booking.guestPhone + '\n' +
      'Address: ' + (booking.guestAddress || 'Not provided') + '\n' +
      'Guests: ' + booking.numberOfGuests + '\n' +
      'Room: ' + (booking.roomType || 'Not selected') + '\n' +
      'Check-in: ' + booking.checkIn + '\n' +
      'Check-out: ' + booking.checkOut + '\n' +
      'Requests: ' + (booking.specialRequests || 'None')
    )
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + msg
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading bookings...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Venue Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">{bookings.length} total bookings</p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl text-center">
            <p className="font-bold text-yellow-700 text-lg">{bookings.filter((b) => b.status === 'pending').length}</p>
            <p className="text-yellow-600 text-xs">Pending</p>
          </div>
          <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-center">
            <p className="font-bold text-green-700 text-lg">{bookings.filter((b) => b.status === 'confirmed').length}</p>
            <p className="text-green-600 text-xs">Confirmed</p>
          </div>
          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-center">
            <p className="font-bold text-red-600 text-lg">{bookings.filter((b) => b.status === 'cancelled').length}</p>
            <p className="text-red-500 text-xs">Cancelled</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={'px-4 py-2 rounded-xl text-sm font-medium capitalize transition ' +
              (filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )
            }
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-lg font-medium">No bookings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-4">Venue</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Phone 🔒</th>
                <th className="p-4">Address 🔒</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Room</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking._id} className="border-t hover:bg-gray-50 transition">

                  <td className="p-4">
                    <p className="font-medium text-gray-800">{booking.venue?.title || 'Venue'}</p>
                    <p className="text-xs text-gray-400">{TYPE_LABELS[booking.venue?.type] || ''}</p>
                  </td>

                  <td className="p-4">
                    <p className="font-medium text-gray-800">{booking.guestName}</p>
                    {booking.guestEmail && <p className="text-xs text-gray-400">{booking.guestEmail}</p>}
                  </td>

                  <td className="p-4 text-gray-700">{booking.guestPhone}</td>

                  <td className="p-4 text-gray-700">
                    {booking.guestAddress || <span className="text-gray-400 italic">Not provided</span>}
                  </td>

                  <td className="p-4 text-gray-700 text-center">{booking.numberOfGuests}</td>

                  <td className="p-4 text-gray-600">
                    {booking.roomType || <span className="text-gray-400 italic">—</span>}
                  </td>

                  <td className="p-4">
                    <p className="text-xs font-medium text-gray-700">In: {booking.checkIn}</p>
                    <p className="text-xs text-gray-400">Out: {booking.checkOut}</p>
                  </td>

                  <td className="p-4">
                    <span className={'px-3 py-1 rounded-full text-xs font-semibold capitalize ' + (STATUS_COLORS[booking.status] || STATUS_COLORS.pending)}>
                      {booking.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-2">

                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'confirmed')}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          ✓ Confirm
                        </button>
                      )}

                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'cancelled')}
                          className="bg-red-100 hover:bg-red-200 text-red-600 text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          ✗ Cancel
                        </button>
                      )}

                      <a
                        href={guestWhatsApp(booking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        WhatsApp Guest
                      </a>

                      <a
                        href={adminWhatsApp(booking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        Send to Admin
                      </a>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
