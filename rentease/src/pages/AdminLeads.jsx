import { useEffect, useState } from "react"
import axios from "../api/axiosInstance"

export default function AdminLeads() {

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchLeads = async () => {
      try {

        const res = await axios.get("/api/leads")
        setLeads(res.data)

      } catch (error) {
        console.error("Failed to fetch leads", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()

  }, [])

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading leads...
      </div>
    )
  }

  return (

    <div className="max-w-6xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Buyer Leads
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full border border-gray-200">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Buyer</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Date</th>
            </tr>

          </thead>

          <tbody>

            {leads.map((lead) => (

              <tr key={lead._id} className="border-t">

                <td className="p-3">
                  {lead.property?.title || "Property"}
                </td>

                <td className="p-3">
                  {lead.buyerName}
                </td>

                <td className="p-3">
                  {lead.buyerPhone}
                </td>

                <td className="p-3">
                  {lead.buyerEmail}
                </td>

                <td className="p-3">
                  {lead.message}
                </td>

                <td className="p-3 text-sm text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}