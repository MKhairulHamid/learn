import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { useCohort } from '../hooks/useCohort'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { useUserCertificates } from '../hooks/useCohortReview'
import {
  User, Mail, Globe, Lock, CheckCircle2, Edit2, Save, X,
  Award, ExternalLink, Printer, Loader2, GraduationCap,
} from 'lucide-react'

type ProfileTab = 'profile' | 'certificates'

export default function ProfilePage() {
  const { t, i18n } = useTranslation('common')
  const { user, profile, refreshProfile } = useAuth()
  const { completedCount } = useProgress()
  const { schedule } = useCohort()
  const { certificates, loading: certsLoading } = useUserCertificates(user?.id)

  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState(profile?.full_name ?? '')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const [pwSent, setPwSent] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const currentLang = i18n.resolvedLanguage === 'id' ? 'id' : 'en'

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Learner'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Derive total from the cohort's actual lesson schedule instead of a hardcoded constant.
  const totalSessions = schedule.length
  const progressPct = totalSessions > 0 ? Math.min(100, Math.round((completedCount / totalSessions) * 100)) : 0

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

      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('profile')}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <User size={14} />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'certificates'
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Award size={14} />
          My Certificates
          {certificates.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-primary-900 text-primary-300">
              {certificates.length}
            </span>
          )}
        </button>
      </div>

      {/* Certificates tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-3">
          {certsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin text-gray-600" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
                <GraduationCap size={24} className="text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-400">No certificates yet</p>
              <p className="text-xs text-gray-600 mt-1">Complete a program and get reviewed to earn your certificate.</p>
            </div>
          ) : (
            certificates.map(cert => (
              <div
                key={cert.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Award size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{cert.course_title}</div>
                    {cert.cohort && (
                      <div className="text-xs text-gray-500 mt-0.5">{cert.cohort.name}</div>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span>
                        Issued {new Date(cert.issued_at).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                      {cert.score != null && (
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-medium">
                          {cert.score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`#/verify/${cert.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                  >
                    <ExternalLink size={12} />
                    View
                  </a>
                  <a
                    href={`#/certificate/${cert.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                  >
                    <Printer size={12} />
                    Print / PDF
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile tab */}
      {activeTab === 'profile' && (<>

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
                    className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    <Save size={13} />
                    {savingName ? '…' : t('profile.save')}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="cursor-pointer p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold text-white truncate">{displayName}</span>
                  <button
                    onClick={() => { setEditing(true); setNewName(profile?.full_name ?? '') }}
                    className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <Edit2 size={12} />
                    {t('profile.edit')}
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
      </>)}
    </div>
  )
}
