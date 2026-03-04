import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertiesAPI } from '../../api/properties'
import Input from '../shared/Input'
import Button from '../shared/Button'
import Toast from '../shared/Toast'

const TYPES     = ['apartment', 'house', 'land', 'commercial', 'shortlet']
const AMENITIES = ['WiFi', 'Parking', 'Generator', 'Security', 'Swimming Pool', 'Gym', 'Air Conditioning', 'Borehole']
const STATES    = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export default function PropertyForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  const [formData, setFormData] = useState({
    title: '', description: '', type: 'apartment', purpose: 'rent',
    price: '', address: '', city: '', state: '',
    bedrooms: '', bathrooms: '', size: '', amenities: [],
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, Array.isArray(val) ? val.join(',') : val)
      })
      images.forEach(img => data.append('images', img))

      await propertiesAPI.create(data)
      setToast({ message: 'Property listed successfully!', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to create listing', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="font-display text-3xl font-bold text-dark mb-2">List a Property</h1>
      <p className="font-body text-gray-500 mb-8">Fill in the details below to create your listing.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Basic Info */}
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-lg text-dark">Basic Information</h2>

          <Input label="Property Title" name="title" value={formData.title} onChange={handleChange}
            placeholder="e.g. Modern 3 Bedroom Flat in Lekki" required />

          <div>
            <label className="font-body text-sm font-medium text-gray-700 mb-1.5 block">Description *</label>
            <textarea
              name="description" value={formData.description} onChange={handleChange} rows={4} required
              placeholder="Describe the property in detail..."
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-gray-700 mb-1.5 block">Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                {TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-gray-700 mb-1.5 block">Purpose *</label>
              <select name="purpose" value={formData.purpose} onChange={handleChange} className="input-field">
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>

          <Input label="Price (₦)" name="price" type="number" value={formData.price}
            onChange={handleChange} placeholder="e.g. 1500000" required />
        </div>

        {/* Location */}
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-lg text-dark">Location</h2>
          <Input label="Street Address" name="address" value={formData.address}
            onChange={handleChange} placeholder="e.g. 12 Admiralty Way" required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" name="city" value={formData.city}
              onChange={handleChange} placeholder="e.g. Lekki" required />
            <div>
              <label className="font-body text-sm font-medium text-gray-700 mb-1.5 block">State *</label>
              <select name="state" value={formData.state} onChange={handleChange} className="input-field">
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-lg text-dark">Property Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms}
              onChange={handleChange} placeholder="0" />
            <Input label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms}
              onChange={handleChange} placeholder="0" />
            <Input label="Size (m²)" name="size" type="number" value={formData.size}
              onChange={handleChange} placeholder="0" />
          </div>

          {/* Amenities */}
          <div>
            <label className="font-body text-sm font-medium text-gray-700 mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(a => (
                <button key={a} type="button" onClick={() => handleAmenity(a)}
                  className={`text-xs font-body px-3 py-1.5 rounded-full border transition-all ${
                    formData.amenities.includes(a)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold text-lg text-dark">Property Images</h2>
          <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors">
            <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
            <p className="text-3xl mb-2">📸</p>
            <p className="font-body text-sm text-gray-500">Click to upload images (max 10, 5MB each)</p>
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`preview ${i}`}
                  className="w-full h-24 object-cover rounded-xl" />
              ))}
            </div>
          )}
        </div>

        <Button type="submit" loading={loading} fullWidth>
          Publish Listing
        </Button>
      </form>
    </div>
  )
}
