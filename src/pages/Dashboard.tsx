import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight, CheckCircle2, Clock, CalendarDays, Sparkles, Lock,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  useDashboardPrograms, type EnrolledProgram, type AvailableProgram,
} from '../hooks/useDashboardPrograms'
import { LESSON_ZERO_ID } from '../lib/constants'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import type { CohortStatus } from '../hooks/useCohort'

type Lang = 'en' | 'id'

function getGreeting(t: (key: string) => string) {
  const h = new Date().getHours()
  if (h < 12) return t('dashboard.greeting_morning')
  if (h < 17) return t('dashboard.greeting_afternoon')
  return t('dashboard.greeting_evening')
}

const fmtDate = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

export default function Dashboard() {
  const { t, i18n } = useTranslation('common')
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const { enrolled, available, loading, isEditor, enroll } = useDashboardPrograms()
  const lang: Lang = i18n.language === 'id' ? 'id' : 'en'

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Learner'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-sm text-gray-500">{getGreeting(t)},</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{displayName} 👋</h1>
        </div>
        {profile?.role === 'admin' && <Badge variant="primary" size="md">Admin</Badge>}
      </div>

      {/* Editors browse every program; students see their enrolled programs. */}
      {isEditor ? (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-4">{t('dashboard.my_programs')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {available.map(ap => (
              <button
                key={ap.program.id}
                onClick={() => navigate('/curriculum')}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
              >
                <ProgramIcon program={ap.program} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm truncate">
                    {lang === 'id' ? ap.program.name_id : ap.program.name_en}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{t('dashboard.view_curriculum')}</div>
                </div>
                <ArrowRight size={16} className="text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-4">{t('dashboard.my_programs')}</h2>
            {enrolled.length > 0 ? (
              <div className="space-y-5">
                {enrolled.map(ep => (
                  <EnrolledCard key={ep.program.id} ep={ep} lang={lang} t={t} onNavigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
                <Sparkles size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t('dashboard.not_enrolled_yet')}</p>
              </div>
            )}
          </section>

          {available.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-semibold text-gray-800 mb-4">{t('dashboard.explore_programs')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {available.map(ap => (
                  <AvailableCard key={ap.program.id} ap={ap} lang={lang} t={t} onEnroll={enroll} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function ProgramIcon({ program }: { program: EnrolledProgram['program'] }) {
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl shrink-0`}>
      {program.icon}
    </div>
  )
}

function StatusPill({ status, t }: { status: CohortStatus; t: (k: string) => string }) {
  if (status === 'active') return <Badge variant="success" size="sm">{t('dashboard.enrolled_badge')}</Badge>
  if (status === 'pending') return <Badge variant="warning" size="sm">{t('dashboard.under_review')}</Badge>
  if (status === 'expired') return <Badge variant="gray" size="sm">{t('dashboard.access_ended')}</Badge>
  return null
}

function EnrolledCard({ ep, lang, t, onNavigate }: {
  ep: EnrolledProgram; lang: Lang; t: (k: string) => string; onNavigate: (to: string) => void
}) {
  const { program, cohort, status, courseStarted, totalSessions, completedCount, currentPhase, nextSession, recent } = ep
  const name = lang === 'id' ? program.name_id : program.name_en
  const allDone = totalSessions > 0 && completedCount >= totalSessions

  const progressLabel = currentPhase
    ? `Phase ${currentPhase.phase_number} — ${lang === 'id' ? currentPhase.name_id : currentPhase.name_en}`
    : t('dashboard.progress_title')

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <ProgramIcon program={program} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-base">{name}</h3>
            <StatusPill status={status} t={t} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{cohort.name}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <ProgressBar value={completedCount} max={totalSessions || 1} label={progressLabel} />
      </div>

      {/* Update — next lesson or status hint */}
      <div className="mt-4">
        {nextSession ? (
          <button
            onClick={() => onNavigate(`/session/${nextSession.id}`)}
            className="w-full flex items-center justify-between bg-primary-50 hover:bg-primary-100 transition-colors rounded-xl px-4 py-3 text-sm"
          >
            <span className="font-medium text-primary-800 text-left">
              {t('dashboard.continue_learning')}: {lang === 'id' ? nextSession.title_id : nextSession.title_en}
            </span>
            <ArrowRight size={16} className="text-primary-600 shrink-0" />
          </button>
        ) : (
          <StatusHint status={status} cohort={cohort} courseStarted={courseStarted} allDone={allDone} lang={lang} t={t} onNavigate={onNavigate} />
        )}
      </div>

      {/* Last activity */}
      {recent.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
            {t('dashboard.recent_activity')}
          </p>
          <div className="space-y-2">
            {recent.map(r => (
              <div key={r.session.id} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate flex-1">
                  {lang === 'id' ? r.session.title_id : r.session.title_en}
                </span>
                <span className="text-xs text-gray-400 shrink-0">{fmtDate(r.completedAt, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusHint({ status, cohort, courseStarted, allDone, lang, t, onNavigate }: {
  status: CohortStatus
  cohort: EnrolledProgram['cohort']
  courseStarted: boolean
  allDone: boolean
  lang: Lang
  t: (k: string) => string
  onNavigate: (to: string) => void
}) {
  if (allDone) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        <CheckCircle2 size={16} /> {t('dashboard.all_complete')}
      </div>
    )
  }
  if (status === 'pending') {
    return (
      <button
        onClick={() => onNavigate(`/session/${LESSON_ZERO_ID}`)}
        className="w-full flex items-center gap-2 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors px-4 py-3 text-sm text-amber-700 text-left"
      >
        <Clock size={16} className="shrink-0" />
        <span className="flex-1">{t('dashboard.under_review_hint')}</span>
        <ArrowRight size={14} className="shrink-0" />
      </button>
    )
  }
  if (status === 'expired') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
        <Lock size={16} /> {t('dashboard.access_ended_hint')}
      </div>
    )
  }
  // Active but no accessible next lesson yet.
  if (!courseStarted) {
    return (
      <button
        onClick={() => onNavigate(`/session/${LESSON_ZERO_ID}`)}
        className="w-full flex items-center gap-2 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors px-4 py-3 text-sm text-primary-800 text-left"
      >
        <CalendarDays size={16} className="shrink-0" />
        <span className="flex-1">
          {t('dashboard.course_starts')} {fmtDate(cohort.course_start_at, lang)}
        </span>
        <ArrowRight size={14} className="shrink-0" />
      </button>
    )
  }
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
      <Clock size={16} /> {t('dashboard.unlocks_soon')}
    </div>
  )
}

function AvailableCard({ ap, lang, t, onEnroll }: {
  ap: AvailableProgram; lang: Lang; t: (k: string) => string
  onEnroll: (cohortId: string) => Promise<{ error: string | null }>
}) {
  const { program, openCohort, enrollable } = ap
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const name = lang === 'id' ? program.name_id : program.name_en
  const desc = lang === 'id' ? program.description_id : program.description_en

  const handleEnroll = async () => {
    if (!openCohort) return
    setBusy(true); setError(null)
    const { error } = await onEnroll(openCohort.id)
    if (error) { setError(t('dashboard.enroll_error')); setBusy(false) }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
      <div className="flex items-center gap-3">
        <ProgramIcon program={program} />
        <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
      </div>
      <p className="text-sm text-gray-500 mt-3 line-clamp-3 flex-1">{desc}</p>
      <div className="mt-4">
        {enrollable ? (
          <Button size="sm" loading={busy} onClick={handleEnroll}>
            {t('dashboard.enroll_now')}
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} /> {t('dashboard.enrollment_closed')}
          </span>
        )}
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}
