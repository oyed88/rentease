import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PropertyListings from './pages/PropertyListings'
import PropertyDetails from './pages/PropertyDetails'
import Messages from './pages/Messages'
import PropertyForm from './components/property/PropertyForm'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen flex flex-col bg-surface">
            <NavBar />
            <main className="flex-1">
              <Routes>
                {/* Public */}
                <Route path="/"               element={<Home />} />
                <Route path="/login"          element={<Login />} />
                <Route path="/register"       element={<Register />} />
                <Route path="/properties"     element={<PropertyListings />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />

                {/* Private */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/properties/new" element={
                  <ProtectedRoute><PropertyForm /></ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute><Messages /></ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
