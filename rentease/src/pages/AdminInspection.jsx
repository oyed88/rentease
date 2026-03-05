import { useEffect, useState } from "react"
import axios from "../api/axiosInstance"

const STATUS_COLORS = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
}

export default function AdminInspections() {
  const [inspections, setInspections] = useState([])
  const [loading, setLoading] = useState(true)

  const whatsappNumber = "2348000000000" // 🔁 Replace with your real number

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/api/inspections")
        setInspections(res.data)
      } catch (err) {
        console.error("Failed to fetch inspections", err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const updateStatus = async (inspectionId, status) => {
    try {
      await axios.patch(`/api/inspections/${inspectionId}`, { status })
      setInspections((prev) =>
        prev.map((i) => (i._id === inspectionId ? { ...i, status } : i))
      )
    } catch (err) {
      console.error("Failed to update status", err)
      alert("Could not update status.")
    }
  }

  const makeWhatsAppLink = (inspection) => {
    const msg = encodeURIComponent(
      `Hi ${inspection.buyerName}! This is RentEase. Your property inspection is confirmed for ${inspection.date} at ${inspection.time}. Please be available. Thank you!`
    )
    return `https://wa.me/${inspection.buyerPhone.replace(/\D/g, "")}?text=${msg}`
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading inspections...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Property Inspections
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {inspections.length} booking{inspections.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {inspections.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-lg">No inspections booked yet.</p>
          <p className="text-sm mt-1">They will appear here when buyers schedule visits.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 text-left">Property</th>
                <th className="p-4 text-left">Buyer</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Date & Time</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((insp) => (
                <tr key={insp._id} className="border-t hover:bg-gray-50 transition">

                  <td className="p-4 font-medium text-gray-800">
                    {insp.property?.title || "Property"}
                  </td>

                  <td className="p-4 text-gray-700">
                    {insp.buyerName}
                  </td>

                  <td className="p-4 text-gray-600">
                    {insp.buyerPhone}
                  </td>

                  <td className="p-4 text-gray-600">
                    <span className="font-medium">{insp.date}</span>
                    <br />
                    <span className="text-xs text-gray-400">{insp.time}</span>
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[insp.status] || STATUS_COLORS.pending}`}>
                      {insp.status || "pending"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap">

                      {/* Confirm */}
                      {insp.status !== "confirmed" && (
                        <button
                          onClick={() => updateStatus(insp._id, "confirmed")}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          ✓ Confirm
                        </button>
                      )}

                      {/* Cancel */}
                      {insp.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(insp._id, "cancelled")}
                          className="bg-red-100 hover:bg-red-200 text-red-600 text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          ✗ Cancel
                        </button>
                      )}

                      {/* WhatsApp */}
                      
                        href={makeWhatsAppLink(insp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
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