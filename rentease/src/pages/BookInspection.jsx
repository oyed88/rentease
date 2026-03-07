import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "../api/axiosInstance"

const WHATSAPP_NUMBER = "2348149769770"

export default function BookInspection() {
  const { id } = useParams()

  const [name, setName]       = useState("")
  const [phone, setPhone]     = useState("")
  const [email, setEmail]     = useState("")
  const [address, setAddress] = useState("")
  const [date, setDate]       = useState("")
  const [time, setTime]       = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState("")

  const handleSubmit = async () => {
    if (!name || !phone || !date || !time) {
      setError("Please fill in your name, phone, date and time.")
      return
    }

    setError("")
    setLoading(true)

    try {
      await axios.post("/inspections", {
        property:     id,
        buyerName:    name,
        buyerPhone:   phone,
        buyerEmail:   email,
        buyerAddress: address,
        date,
        time,
        message,
      })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError("Failed to book inspection. Please try WhatsApp instead.")
    } finally {
      setLoading(false)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I want to book a property inspection on RentEase.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Date: ${date}\n` +
    `Time: ${time}\n` +
    `Property ID: ${id}\n` +
    `Message: ${message || "None"}`
  )
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  // ── SUCCESS SCREEN ──
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">

          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Inspection Booked!
          </h2>

          <p className="text-gray-500 mb-2">
            Your inspection has been scheduled for:
          </p>

          <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              📅 <strong>Date:</strong> {date}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              🕐 <strong>Time:</strong> {time}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              📞 <strong>We will call:</strong> {phone}
            </p>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            🔒 Your phone and address are private and only visible to the admin.
          </p>

          
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl mb-3 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Follow Up on WhatsApp
          </a>

          <Link
            to="/properties"
            className="block text-blue-600 hover:underline text-sm"
          >
            ← Browse More Properties
          </Link>

        </div>
      </div>
    )
  }

  // ── BOOKING FORM ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">

        {/* Header */}
        <div className="bg-orange-500 rounded-t-2xl p-6">
          <Link
            to={`/properties/${id}`}
            className="text-white/70 hover:text-white text-sm mb-3 block"
          >
            ← Back to Property
          </Link>
          <h1 className="text-2xl font-bold text-white">
            🏠 Book Inspection
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Schedule a visit to see this property in person
          </p>
        </div>

        <div className="p-6">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
              <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="email"
              placeholder="e.g. john@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Time */}
          <div className="mb-4">
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

          {/* Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message
              <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              placeholder="Any special requests or questions?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Privacy note */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 text-xs text-gray-500 flex gap-2">
            <span>🔒</span>
            <span>
              Your phone number and address are <strong>private</strong>.
              Only the RentEase admin can see them. Never shown publicly.
            </span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition mb-3"
          >
            {loading ? "Booking..." : "📅 Confirm Inspection"}
          </button>

          {/* WhatsApp alternative */}
          
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition mb-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Or Book via WhatsApp
          </a>

          <Link
            to={`/properties/${id}`}
            className="block text-center text-sm text-gray-400 hover:text-gray-600"
          >
            Cancel — go back
          </Link>

        </div>
      </div>
    </div>
  )
}