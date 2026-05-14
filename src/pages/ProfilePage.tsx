import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { User, Mail, Globe, Lock, CheckCircle2, Edit2, Save, X } from 'lucide-react'

export default function ProfilePage() {
  const { t, i18n } = useTranslation('common')
  const { user, profile, refreshProfile } = useAuth()
  const { completedCount } = useProgress()

  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState(profile?.full_name ?? '')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const [pwSent, setPwSent] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [currentLang, setCurrentLang] = useState(i18n.resolvedLanguage ?? 'en')

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Learner'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const totalSessions = 12
  const progressPct = Math.min(100, Math.round((completedCount / totalSessions) * 100))

  async function handleSaveName() {
    if (!user) return
    setSavingName(true)
    setNameError(null)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: newName.trim() })
      .eq('id', user.id)
    if (error) {
      setNameError(error.message)
    } else {
      await refreshProfile()   // re-fetch so displayed name updates immediately
      setEditing(false)
    }
    setSavingName(false)
  }

  function handleCancelEdit() {
    setNewName(profile?.full_name ?? '')
    setEditing(false)
    setNameError(null)
  }

  function handleLangSwitch(lang: 'en' | 'id') {
    i18n.changeLanguage(lang)
    setCurrentLang(lang)
  }

  async function handlePasswordReset() {
    if (!user?.email) return
    setPwLoading(true)
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + window.location.pathname,
    })
    setPwLoading(false)
    setPwSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('profile.subtitle')}</p>
      </div>

      {/* Avatar + Name + Email + Role */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center shrink-0 text-white text-xl font-bold select-none">
            {initials}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Full name */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <User size={12} />
                {t('profile.full_name')}
              </label>
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveName()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="p-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 transition-colors"
                    title="Save"
                  >
                    <Save size={14} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                    title="Cancel"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="text-base font-semibold text-white">{displayName}</span>
                  <button
                    onClick={() => { setEditing(true); setNewName(profile?.full_name ?? '') }}
                    className="p-1 rounded-md text-gray-600 hover:text-gray-300 hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all"
                    title="Edit name"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
              )}
              {nameError && (
                <p className="text-xs text-red-400 mt-1">{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Mail size={12} />
                {t('profile.email')}
              </label>
              <span className="text-sm text-gray-300">{user?.email}</span>
            </div>

            {/* Role badge */}
            <div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                profile?.role === 'admin'
                  ? 'bg-primary-900 text-primary-300 border border-primary-700'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}>
                {profile?.role === 'admin' ? t('profile.role_admin') : t('profile.role_student')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-200">{t('profile.language_title')}</h2>
        </div>
        <div className="flex gap-3">
          {(['en', 'id'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => handleLangSwitch(lang)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentLang === lang
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
              }`}
            >
              {lang === 'en' ? 'English' : 'Indonesia'}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {t('profile.language_reload')}
        </p>
      </div>

      {/* Progress Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-200">{t('profile.progress_title')}</h2>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">{t('profile.sessions_completed')}</span>
          <span className="text-sm font-semibold text-white">
            {completedCount}
            <span className="text-gray-500 font-normal">/{totalSessions}</span>
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">{progressPct}% {t('profile.progress_pct')}</p>
      </div>

      {/* Change Password */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-200">{t('profile.password_title')}</h2>
        </div>
        {pwSent ? (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 size={16} />
            {t('profile.password_sent')}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {t('profile.password_desc')} <span className="text-gray-300">{user?.email}</span>.
            </p>
            <Button
              variant="outline"
              size="sm"
              loading={pwLoading}
              onClick={handlePasswordReset}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Lock size={14} />
              {t('profile.password_btn')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
