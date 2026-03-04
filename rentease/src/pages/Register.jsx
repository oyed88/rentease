import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/shared/Input'
import Button from '../components/shared/Button'
import Toast from '../components/shared/Toast'

const ROLES = [
  {
    value: 'tenant',
    label: 'Tenant',
    desc: 'I\'m looking for a property to rent or buy',
    icon: '🔍',
  },
  {
    value: 'landlord',
    label: 'Landlord',
    desc: 'I own properties and want to list them',
    icon: '🏠',
  },
  {
    value: 'agent',
    label: 'Agent',
    desc: 'I\'m a real estate agent helping clients',
    icon: '🤝',
  },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name)     newErrors.name = 'Full name is required'
    if (!formData.email)    newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.role)     newErrors.role = 'Please select your role'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await register(formData.name, formData.email, formData.password, formData.role)
      navigate('/dashboard')
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Registration failed. Please try again.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">R</span>
            </div>
            <span className="font-display font-semibold text-2xl text-dark">
              Rent<span className="text-primary-500">Ease</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-dark mb-2">Create your account</h1>
          <p className="font-body text-gray-500 text-sm">Join thousands finding homes across Nigeria</p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Role Selection */}
            <div>
              <label className="font-body text-sm font-medium text-gray-700 mb-2 block">
                I am a... <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map(({ value, label, desc, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, role: value }))
                      setErrors(prev => ({ ...prev, role: '' }))
                    }}
                    className={`
                      p-3 rounded-xl border-2 text-left transition-all
                      ${formData.role === value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="font-body font-medium text-sm text-dark">{label}</div>
                    <div className="font-body text-xs text-gray-500 leading-snug mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
              {errors.role && <p className="font-body text-xs text-red-500 mt-1.5">{errors.role}</p>}
            </div>

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Emeka Okonkwo"
              error={errors.name}
              required
            />

            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              required
            />

            <Button type="submit" loading={loading} fullWidth>
              Create Account
            </Button>
          </form>

          <p className="font-body text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
