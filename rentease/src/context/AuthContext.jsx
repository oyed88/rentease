import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/auth'

// 1. Create the context
const AuthContext = createContext(null)

// 2. Create the Provider — wraps the whole app in App.jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // the logged-in user object
  const [token, setToken] = useState(null)     // JWT token
  const [loading, setLoading] = useState(true) // still checking if user is logged in

  // On app load, check if there's a saved token in localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('rentease_token')
    const savedUser  = localStorage.getItem('rentease_user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }

    setLoading(false)
  }, [])

  // Register a new user
  const register = async (name, email, password, role) => {
    const data = await authAPI.register({ name, email, password, role })
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('rentease_token', data.token)
    localStorage.setItem('rentease_user', JSON.stringify(data.user))
    return data
  }

  // Log in an existing user
  const login = async (email, password) => {
    const data = await authAPI.login({ email, password })
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('rentease_token', data.token)
    localStorage.setItem('rentease_user', JSON.stringify(data.user))
    return data
  }

  // Log out
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('rentease_token')
    localStorage.removeItem('rentease_user')
  }

  // What we share with the rest of the app
  const value = {
    user,       // e.g. { name: 'Emeka', email: '...', role: 'tenant' }
    token,
    loading,
    isLoggedIn: !!user,
    register,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — use this in any component to access auth
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
