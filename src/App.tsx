import { Suspense, lazy, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { MobileNav } from './components/layout/MobileNav'
import { SplashScreen } from './components/ui/SplashScreen'
import './lib/i18n'

const Landing          = lazy(() => import('./pages/Landing'))
const Login            = lazy(() => import('./pages/auth/Login'))
const Register         = lazy(() => import('./pages/auth/Register'))
const ResetPassword    = lazy(() => import('./pages/auth/ResetPassword'))
const Dashboard        = lazy(() => import('./pages/Dashboard'))
const CurriculumPage   = lazy(() => import('./pages/CurriculumPage'))
const SessionPage      = lazy(() => import('./pages/SessionPage'))
const PlaygroundPage   = lazy(() => import('./pages/PlaygroundPage'))
const PythonPlayground = lazy(() => import('./pages/PythonPlaygroundPage'))
const ExercisePage     = lazy(() => import('./pages/ExercisePage'))
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'))
const UserDetailPage        = lazy(() => import('./pages/admin/UserDetailPage'))
const ExerciseAnalyticsPage = lazy(() => import('./pages/admin/ExerciseAnalyticsPage'))
const ProfilePage           = lazy(() => import('./pages/ProfilePage'))
const NotFound              = lazy(() => import('./pages/NotFound'))

// ── Route guards ──────────────────────────────────────────────

function ProtectedRoute() {
  const { user, loading, recoveryMode } = useAuth()
  if (loading) return <SplashScreen />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function AdminRoute() {
  const { user, profile, loading, recoveryMode } = useAuth()
  if (loading) return <SplashScreen />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  if (!user) return <Navigate to="/login" replace />
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <Outlet />
}

function PublicOnlyRoute() {
  const { user, loading, recoveryMode } = useAuth()
  if (loading) return <SplashScreen />
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

// ── Layout ────────────────────────────────────────────────────

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

// ── Inner app — rendered after auth resolves ──────────────────

function AppRoutes() {
  const { loading } = useAuth()

  // Show branded splash while Supabase session is being checked
  if (loading) return <SplashScreen />

  return (
    <HashRouter>
      <RecoveryRedirect />
      <Suspense fallback={<SplashScreen />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Landing />} />

            {/* Learner routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="/curriculum"   element={<CurriculumPage />} />
              <Route path="/session/:id"  element={<SessionPage />} />
              <Route path="/playground"   element={<PlaygroundPage />} />
              <Route path="/python"       element={<PythonPlayground />} />
              <Route path="/exercise/:id" element={<ExercisePage />} />
              <Route path="/profile"      element={<ProfilePage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin"                      element={<AdminDashboard />} />
              <Route path="/admin/users/:userId"        element={<UserDetailPage />} />
              <Route path="/admin/exercise-analytics"   element={<ExerciseAnalyticsPage />} />
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
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
