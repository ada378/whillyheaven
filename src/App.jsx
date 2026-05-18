import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import CategoryFilter from './components/CategoryFilter'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import { useApp } from './context/AppContext'

import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import TripsPage from './pages/TripsPage'
import WishlistPage from './pages/WishlistPage'
import HostDashboardPage from './pages/HostDashboardPage'
import ProfilePage from './pages/ProfilePage'

// ─── Toast Container ─────────────────────────────────────────────────────────
function ToastContainer() {
  const { toast, showToast } = useApp()
  if (!toast) return null
  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onDismiss={() => showToast(null)}
    />
  )
}

// ─── Home Layout (with CategoryFilter) ───────────────────────────────────────
function HomeLayout() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  return (
    <>
      <Navbar />
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-gold-pale min-h-screen">
        <HomePage selectedCategory={selectedCategory} />
      </main>
      <ToastContainer />
    </>
  )
}

// ─── Default Layout (no CategoryFilter) ──────────────────────────────────────
function DefaultLayout() {
  return (
    <>
      <Navbar />
      <main className="bg-gold-pale min-h-screen">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Home — has CategoryFilter */}
      <Route path="/" element={<HomeLayout />} />

      {/* All other pages — no CategoryFilter */}
      <Route element={<DefaultLayout />}>
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route
          path="/trips"
          element={<ProtectedRoute><TripsPage /></ProtectedRoute>}
        />
        <Route
          path="/wishlist"
          element={<ProtectedRoute><WishlistPage /></ProtectedRoute>}
        />
        <Route path="/host" element={<HostDashboardPage />} />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
      </Route>
    </Routes>
  )
}
