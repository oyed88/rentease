import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"
import NavBar from "./components/layout/NavBar"
import Footer from "./components/layout/Footer"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import PropertyListings from "./pages/PropertyListings"
import PropertyDetails from "./pages/PropertyDetails"
import Messages from "./pages/Messages"
import AdminLeads from "./pages/AdminLeads"
import BookInspection from "./pages/BookInspection"
import AdminInspections from "./pages/AdminInspections"

// Venues & Bookings
import Venues from "./pages/Venues"
import VenueDetails from "./pages/VenueDetails"
import AdminBookings from "./pages/AdminBookings"

// Components
import PropertyForm from "./components/property/PropertyForm"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen flex flex-col bg-surface">

            <NavBar />

            <main className="flex-1">
              <Routes>

                {/* ── Public Routes ── */}
                <Route path="/"                       element={<Home />} />
                <Route path="/login"                  element={<Login />} />
                <Route path="/register"               element={<Register />} />
                <Route path="/properties"             element={<PropertyListings />} />
                <Route path="/properties/:id"         element={<PropertyDetails />} />
                <Route path="/properties/:id/inspect" element={<BookInspection />} />

                {/* ── Venues & Bookings (public) ── */}
                <Route path="/venues"                 element={<Venues />} />
                <Route path="/venues/:id"             element={<VenueDetails />} />

                {/* ── Protected Routes ── */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                }/>

                <Route path="/properties/new" element={
                  <ProtectedRoute><PropertyForm /></ProtectedRoute>
                }/>

                <Route path="/messages" element={
                  <ProtectedRoute><Messages /></ProtectedRoute>
                }/>

                {/* ── Admin Routes ── */}
                <Route path="/admin/leads" element={
                  <ProtectedRoute><AdminLeads /></ProtectedRoute>
                }/>

                <Route path="/admin/inspections" element={
                  <ProtectedRoute><AdminInspections /></ProtectedRoute>
                }/>

                <Route path="/admin/bookings" element={
                  <ProtectedRoute><AdminBookings /></ProtectedRoute>
                }/>

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
