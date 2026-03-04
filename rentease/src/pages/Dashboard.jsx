import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()

  // Different dashboard content based on user role
  const roleContent = {
    tenant: {
      greeting: 'Find Your Next Home',
      actions: [
        { label: 'Browse Properties', href: '/properties', icon: '🔍' },
        { label: 'Saved Properties',  href: '/saved',      icon: '❤️' },
        { label: 'My Messages',       href: '/messages',   icon: '💬' },
      ],
      stats: [
        { label: 'Saved Properties', value: '0' },
        { label: 'Unread Messages',  value: '0' },
        { label: 'Viewings Booked',  value: '0' },
      ],
    },
    landlord: {
      greeting: 'Manage Your Properties',
      actions: [
        { label: 'Add New Property',  href: '/properties/new', icon: '➕' },
        { label: 'My Listings',       href: '/my-listings',    icon: '🏠' },
        { label: 'Messages',          href: '/messages',       icon: '💬' },
      ],
      stats: [
        { label: 'Active Listings',  value: '0' },
        { label: 'Enquiries',        value: '0' },
        { label: 'Total Views',      value: '0' },
      ],
    },
    agent: {
      greeting: 'Your Agent Dashboard',
      actions: [
        { label: 'Browse Listings',  href: '/properties',     icon: '🔍' },
        { label: 'Add Property',     href: '/properties/new', icon: '➕' },
        { label: 'Messages',         href: '/messages',       icon: '💬' },
      ],
      stats: [
        { label: 'Active Listings', value: '0' },
        { label: 'Clients',         value: '0' },
        { label: 'Deals Closed',    value: '0' },
      ],
    },
  }

  const content = roleContent[user?.role] || roleContent.tenant

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8 text-white">
        <p className="font-body text-primary-200 text-sm mb-1">Welcome back 👋</p>
        <h1 className="font-display text-3xl font-bold mb-1">{user?.name}</h1>
        <p className="font-body text-primary-200 capitalize">
          {user?.role} account · {user?.email}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {content.stats.map(({ label, value }) => (
          <div key={label} className="card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary-600">{value}</p>
            <p className="font-body text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="font-display text-xl font-semibold text-dark mb-4">{content.greeting}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {content.actions.map(({ label, href, icon }) => (
          <Link
            key={label}
            to={href}
            className="card p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">{icon}</span>
            <span className="font-body font-medium text-dark">{label}</span>
            <span className="ml-auto text-gray-400">→</span>
          </Link>
        ))}
      </div>

      {/* Profile completion nudge */}
      <div className="mt-8 bg-earth-50 border border-earth-200 rounded-2xl p-6 flex items-start gap-4">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="font-body font-medium text-dark text-sm mb-1">Complete your profile</p>
          <p className="font-body text-xs text-gray-500">
            Add your phone number and profile photo to get more responses from landlords.
          </p>
        </div>
        <Link to="/profile" className="ml-auto shrink-0 btn-secondary text-sm px-4 py-2">
          Update
        </Link>
      </div>
    </div>
  )
}
