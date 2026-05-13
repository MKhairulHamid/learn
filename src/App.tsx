import { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { MobileNav } from './components/layout/MobileNav'
import './lib/i18n'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicOnlyRoute() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public + protected pages share the app layout */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Landing />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/curriculum" element={<div className="p-8 text-center text-gray-500 text-lg">📚 Curriculum — coming in Batch 2</div>} />
                <Route path="/playground" element={<div className="p-8 text-center text-gray-500 text-lg">🗄️ SQL Playground — coming in Batch 3</div>} />
                <Route path="/admin" element={<div className="p-8 text-center text-gray-500 text-lg">🔐 Admin Dashboard — coming in Batch 4</div>} />
              </Route>
            </Route>

            {/* Auth pages — no top nav/footer */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  )
}
