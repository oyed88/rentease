import { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { path: '/admin',              icon: '📊', label: 'Dashboard'   },
  { path: '/admin/leads',        icon: '📩', label: 'Leads'       },
  { path: '/admin/inspections',  icon: '📅', label: 'Inspections' },
  { path: '/admin/bookings',     icon: '🏨', label: 'Bookings'    },
  { path: '/properties',         icon: '🏠', label: 'Properties'  },
  { path: '/messages',           icon: '💬', label: 'Messages'    },
]

export default function AdminLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <Navigate to="/login" />

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">R</div>
            <span className="font-bold text-gray-800 text-lg">RentEase</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-4 py-4 border-t space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
            <span className="text-lg">🌐</span>
            View Live Site
          </Link>
          <Link to="/logout" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
            <span className="text-lg">🚪</span>
            Log Out
          </Link>
        </div>

      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">

          <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-gray-800">
              {NAV_ITEMS.find((i) => i.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-3">
            <Link to="/admin/leads" className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium transition">
              📩 Leads
            </Link>
            <Link to="/admin/inspections" className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-medium transition">
              📅 Inspections
            </Link>
            <Link to="/admin/bookings" className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-medium transition">
              🏨 Bookings
            </Link>
          </div>

        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  )
}
