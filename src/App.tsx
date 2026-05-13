import { Suspense, lazy, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { MobileNav } from './components/layout/MobileNav'
import './lib/i18n'

const Landing        = lazy(() => import('./pages/Landing'))
const Login          = lazy(() => import('./pages/auth/Login'))
const Register       = lazy(() => import('./pages/auth/Register'))
const ResetPassword  = lazy(() => import('./pages/auth/ResetPassword'))
const Dashboard      = lazy(() => import('./pages/Dashboard'))
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'))
const SessionPage    = lazy(() => import('./pages/SessionPage'))
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'))
const ExercisePage   = lazy(() => import('./pages/ExercisePage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const UserDetailPage = lazy(() => import('./pages/admin/UserDetailPage'))
const NotFound       = lazy(() => import('./pages/NotFound'))

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ProtectedRoute() {
  const { user, loading, recoveryMode } = useAuth()
  if (loading) return <LoadingSpinner />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function AdminRoute() {
  const { user, profile, loading, recoveryMode } = useAuth()
  if (loading) return <LoadingSpinner />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  if (!user) return <Navigate to="/login" replace />
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <Outlet />
}

function PublicOnlyRoute() {
  const { user, loading, recoveryMode } = useAuth()
  if (loading) return <LoadingSpinner />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function RecoveryRedirect() {
  const { recoveryMode } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (recoveryMode) navigate('/reset-password', { replace: true })
  }, [recoveryMode, navigate])
  return null
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
        <RecoveryRedirect />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Landing />} />

              {/* Learner routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard"      element={<Dashboard />} />
                <Route path="/curriculum"     element={<CurriculumPage />} />
                <Route path="/session/:id"    element={<SessionPage />} />
                <Route path="/playground"     element={<PlaygroundPage />} />
                <Route path="/exercise/:id"   element={<ExercisePage />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin"                  element={<AdminDashboard />} />
                <Route path="/admin/users/:userId"    element={<UserDetailPage />} />
              </Route>
            </Route>

            <Route element={<PublicOnlyRoute />}>
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  )
}
