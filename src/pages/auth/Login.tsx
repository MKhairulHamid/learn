import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

type View = 'login' | 'forgot' | 'forgot_sent'

export default function Login() {
  const { t } = useTranslation('common')
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleSignIn() {
    setError(null)
    setGoogleLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setGoogleLoading(false)
      setError(error)
    }
    // on success, browser redirects to Google — no need to setLoading(false)
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(t('auth.error_invalid'))
    } else {
      navigate('/dashboard')
    }
  }

  async function handleForgotPassword(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    // redirectTo must NOT include a hash — Supabase appends its own #access_token fragment.
    // The app detects PASSWORD_RECOVERY via onAuthStateChange and navigates to /reset-password.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setView('forgot_sent')
    }
  }

  const Logo = () => (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center gap-2 text-primary-700 font-bold text-xl">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        DataLearn
      </Link>
    </div>
  )

  /* ── Forgot password sent ── */
  if (view === 'forgot_sent') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50 px-4 py-12">
        <div className="w-full max-w-md">
          <Logo />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={28} className="text-green-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              We sent a password reset link to <span className="font-medium text-gray-700">{email}</span>.
              Check your inbox and click the link to reset your password.
            </p>
            <button
              onClick={() => { setView('login'); setError(null) }}
              className="text-sm text-primary-600 hover:underline font-medium"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Forgot password form ── */
  if (view === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50 px-4 py-12">
        <div className="w-full max-w-md">
          <Logo />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <button
              onClick={() => { setView('login'); setError(null) }}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
            >
              <ArrowLeft size={15} /> Back to login
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot your password?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Send reset link
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  /* ── Login form ── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Logo />
        <div className="text-center mb-8 -mt-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('auth.login_title')}</h1>
          <p className="mt-2 text-gray-500 text-sm">{t('auth.login_subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Google sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-5"
          >
            <GoogleIcon />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-white px-3">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
                <button
                  type="button"
                  onClick={() => { setError(null); setView('forgot') }}
                  className="text-xs text-primary-600 hover:underline"
                >
                  {t('auth.forgot_password')}
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {t('auth.login_btn')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              {t('auth.sign_up')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
