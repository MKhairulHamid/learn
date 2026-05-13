import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'

type View = 'login' | 'forgot' | 'forgot_sent'

export default function Login() {
  const { t } = useTranslation('common')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
