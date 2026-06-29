import { Suspense, lazy, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CohortProvider } from './hooks/useCohort'
import { FeedbackModalProvider } from './context/FeedbackModalContext'
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
const CurriculumIndex  = lazy(() => import('./pages/CurriculumIndex'))
const CurriculumPage   = lazy(() => import('./pages/CurriculumPage'))
const SessionPage      = lazy(() => import('./pages/SessionPage'))
const PlaygroundPage   = lazy(() => import('./pages/PlaygroundPage'))
const ExercisePage     = lazy(() => import('./pages/ExercisePage'))
const AdminDashboard           = lazy(() => import('./pages/admin/AdminDashboard'))
const UserDetailPage           = lazy(() => import('./pages/admin/UserDetailPage'))
const ExerciseAnalyticsPage    = lazy(() => import('./pages/admin/ExerciseAnalyticsPage'))
const ProgramManagerDashboard  = lazy(() => import('./pages/program-manager/ProgramManagerDashboard'))
const ProgramManagerPage       = lazy(() => import('./pages/program-manager/ProgramManagerPage'))
const ProfilePage              = lazy(() => import('./pages/ProfilePage'))
const DemoPage                 = lazy(() => import('./pages/DemoPage'))
const PitchPage                = lazy(() => import('./pages/PitchPage'))
const PresentationsIndex       = lazy(() => import('./pages/PresentationsIndex'))
const PresentationViewer       = lazy(() => import('./pages/PresentationViewer'))
const VerifyPage               = lazy(() => import('./pages/VerifyPage'))
const CertificatePrintPage     = lazy(() => import('./pages/CertificatePrintPage'))
const NotFound                 = lazy(() => import('./pages/NotFound'))

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

function ProgramManagerRoute() {
  const { user, profile, loading, recoveryMode } = useAuth()
  if (loading) return <SplashScreen />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  if (!user) return <Navigate to="/login" replace />
  if (profile?.role !== 'admin' && profile?.role !== 'program_manager') {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}

function PublicOnlyRoute() {
  const { user, loading, recoveryMode } = useAuth()
  if (loading) return <SplashScreen />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

// Redirect logged-in users away from landing page to the dashboard
function LandingRoute() {
  const { user, loading, recoveryMode } = useAuth()
  if (loading) return <SplashScreen />
  if (recoveryMode) return <Navigate to="/reset-password" replace />
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
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
            <Route element={<LandingRoute />}>
              <Route path="/" element={<Landing />} />
            </Route>

            {/* Learner routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="/curriculum"   element={<CurriculumIndex />} />
              <Route path="/curriculum/:programId" element={<CurriculumPage />} />
              <Route path="/session/:id"  element={<SessionPage />} />
              <Route path="/playground"   element={<PlaygroundPage />} />
              {/* Legacy redirect for old /python bookmarks */}
              <Route path="/python"       element={<Navigate to="/playground" replace />} />
              <Route path="/exercise/:id" element={<ExercisePage />} />
              <Route path="/profile"      element={<ProfilePage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin"                      element={<AdminDashboard />} />
              <Route path="/admin/users/:userId"        element={<UserDetailPage />} />
              <Route path="/admin/exercise-analytics"   element={<ExerciseAnalyticsPage />} />
            </Route>

            {/* Program Manager routes (admin + program_manager) */}
            <Route element={<ProgramManagerRoute />}>
              <Route path="/program-manager"                    element={<ProgramManagerDashboard />} />
              <Route path="/program-manager/:programId"         element={<ProgramManagerPage />} />
            </Route>
          </Route>

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Standalone demo / sales page — direct URL only, not in any nav */}
          <Route path="/demo" element={<DemoPage />} />

          {/* Standalone pitch deck — direct URL only: #/pitch */}
          <Route path="/pitch" element={<PitchPage />} />

          {/* Standalone class presentations — direct URL only, no auth, not in nav */}
          <Route path="/present" element={<PresentationsIndex />} />
          <Route path="/present/:id" element={<PresentationViewer />} />

          {/* Public certificate verification — no auth required */}
          <Route path="/verify/:certId" element={<VerifyPage />} />

          {/* Certificate print/PDF page — protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/certificate/:certId" element={<CertificatePrintPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CohortProvider>
        <FeedbackModalProvider>
          <AppRoutes />
        </FeedbackModalProvider>
      </CohortProvider>
    </AuthProvider>
  )
}
