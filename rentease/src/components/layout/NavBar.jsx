import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NavBar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">R</span>
            </div>
            <span className="font-display font-semibold text-xl text-dark">
              Rent<span className="text-primary-500">Ease</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-body text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/properties" className="font-body text-sm text-gray-600 hover:text-primary-600 transition-colors">
              Properties
            </Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="font-body text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="font-body text-sm text-gray-600">
                  Hi, <span className="font-medium text-dark">{user?.name?.split(' ')[0]}</span>
                </span>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full capitalize font-body">
                  {user?.role}
                </span>
                <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-3">
            <Link to="/" className="font-body text-sm text-gray-600 py-2" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/properties" className="font-body text-sm text-gray-600 py-2" onClick={() => setMenuOpen(false)}>Properties</Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="font-body text-sm text-gray-600 py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary text-sm text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm" onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="btn-primary text-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
