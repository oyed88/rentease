import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/properties?location=${searchQuery}`)
  }

  const stats = [
    { label: 'Properties Listed', value: '2,400+' },
    { label: 'Happy Tenants',     value: '1,800+' },
    { label: 'Verified Landlords', value: '650+'  },
    { label: 'Cities Covered',    value: '12'     },
  ]

  const features = [
    {
      icon: '🔒',
      title: 'Blockchain Verified',
      desc: 'Every property is verified on-chain. No fake listings, no scams.',
    },
    {
      icon: '🏠',
      title: 'Virtual Tours',
      desc: 'View properties in 360° from your phone before visiting in person.',
    },
    {
      icon: '💬',
      title: 'Direct Messaging',
      desc: 'Chat directly with landlords. No agent fees, no middlemen.',
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      desc: 'Pay rent and deposits safely via Paystack escrow.',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-dark min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-block bg-primary-500/20 text-primary-300 text-xs font-body font-medium px-3 py-1.5 rounded-full mb-6 border border-primary-500/30">
            🇳🇬 Built for Nigeria's Real Estate Market
          </span>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Find Your Perfect<br />
            <span className="text-primary-400 italic">Home in Nigeria</span>
          </h1>

          <p className="font-body text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect directly with verified landlords. No inflated agent fees, no property fraud, 
            no wasted journeys. Just your next home.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3 bg-white rounded-2xl p-2 shadow-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, area, or neighbourhood..."
              className="flex-1 px-4 py-3 font-body text-dark bg-transparent focus:outline-none"
            />
            <button type="submit" className="btn-primary px-6 py-3 shrink-0">
              Search
            </button>
          </form>

          {/* Quick filter tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'].map((city) => (
              <button
                key={city}
                onClick={() => setSearchQuery(city)}
                className="font-body text-xs text-gray-300 border border-gray-600 hover:border-primary-400 hover:text-primary-400 px-3 py-1.5 rounded-full transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <p className="font-display text-4xl font-bold text-primary-600">{value}</p>
                <p className="font-body text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-dark mb-4">
              Why Choose RentEase?
            </h2>
            <p className="font-body text-gray-500 max-w-xl mx-auto">
              We solve the three biggest problems in Nigeria's rental market.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display font-semibold text-lg text-dark mb-2">{title}</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to find your home?
          </h2>
          <p className="font-body text-primary-100 mb-8">
            Join thousands of Nigerians who already use RentEase.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/register" className="bg-white text-primary-600 font-body font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              Get Started Free
            </a>
            <a href="/properties" className="border-2 border-white text-white font-body font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Browse Properties
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
