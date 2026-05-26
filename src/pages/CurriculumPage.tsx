import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2, Clock, ChevronDown, ChevronUp, Lock, PlayCircle,
  CalendarDays, Sparkles, ArrowLeft, MessageSquarePlus,
} from 'lucide-react'
import { usePhases, usePrograms } from '../hooks/usePhases'
import { useProgress } from '../hooks/useProgress'
import { useCohort } from '../hooks/useCohort'
import { usePendingFeedback } from '../hooks/useFeedback'
import { useFeedbackModal } from '../context/FeedbackModalContext'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { CohortNotice } from '../components/cohort/CohortNotice'
import type { Session } from '../types'

const PHASE_COLORS: Record<number, string> = {
  1: 'from-blue-500 to-cyan-500',
  2: 'from-violet-500 to-purple-600',
  3: 'from-orange-500 to-amber-500',
  4: 'from-emerald-500 to-teal-600',
}

const PHASE_BG: Record<number, string> = {
  1: 'bg-blue-50 border-blue-100',
  2: 'bg-violet-50 border-violet-100',
  3: 'bg-orange-50 border-orange-100',
  4: 'bg-emerald-50 border-emerald-100',
}

// Short date label, e.g. "14 Jun"
const fmtShort = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

export default function CurriculumPage() {
  const { t, i18n } = useTranslation(['common', 'curriculum'])
  const navigate = useNavigate()
  const { programId } = useParams<{ programId: string }>()
  const { programs, loading: programsLoading } = usePrograms()
  const cohort = useCohort()
  const { setActiveProgram } = cohort
  const lang = i18n.language === 'id' ? 'id' : 'en'

  // The program is chosen on the index page (/curriculum); resolve cohort,
  // schedule, and progress against it.
  useEffect(() => {
    if (programId) setActiveProgram(programId)
  }, [programId, setActiveProgram])

  const program = programs.find(p => p.id === programId)

  const { phases, orientation, loading } = usePhases(programId)
  const { isCompleted, loading: progressLoading } = useProgress()
  const { pendingSessionIds } = usePendingFeedback(cohort.cohortId)
  const { openFeedback } = useFeedbackModal()
  const [expandedPhase, setExpandedPhase] = useState<number>(1)

  // Per-program progress (sessions vary across programs).
  const totalSessions = phases.reduce((n, p) => n + (p.sessions?.length ?? 0), 0)
  const programCompleted = phases.reduce(
    (n, p) => n + (p.sessions?.filter(s => isCompleted(s.id)).length ?? 0), 0,
  )

  const phaseName = (p: { name_id: string; name_en: string }) =>
    lang === 'id' ? p.name_id : p.name_en
  const phaseDesc = (p: { description_id: string; description_en: string }) =>
    lang === 'id' ? p.description_id : p.description_en
  const sessionTitle = (s: { title_id: string; title_en: string }) =>
    lang === 'id' ? s.title_id : s.title_en

  // Wait until the cohort context has switched to this program, otherwise
  // gating/progress would briefly reflect the previously active program.
  const programResolving = !!programId && cohort.activeProgramId !== programId

  if (loading || progressLoading || cohort.loading || programsLoading || programResolving) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Students can only open a program they're enrolled in; send others back to
  // the program picker.
  if (!cohort.isEditor && programId && !cohort.enrolledProgramIds.includes(programId)) {
    return <Navigate to="/curriculum" replace />
  }

  // Hard gate: no usable cohort relationship → block the curriculum entirely.
  const blocked = !cohort.isEditor &&
    (cohort.status === 'none' || cohort.status === 'rejected' ||
     cohort.status === 'removed' || cohort.status === 'expired')

  if (blocked) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('common:nav.curriculum')}</h1>
        <p className="text-gray-500 text-sm mb-6">{t('common:landing.curriculum_subtitle')}</p>
        <CohortNotice status={cohort.status} cohort={cohort.cohort} courseStarted={cohort.courseStarted} />
      </div>
    )
  }

  // Renders one lesson row's right-hand meta (duration / unlock date / locked).
  const lessonMeta = (session: Session, accessible: boolean) => {
    const sched = cohort.getScheduleFor(session.id)
    if (!accessible) {
      return (
        <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
          <Lock size={12} />
          {sched ? `Unlocks ${fmtShort(sched.scheduled_date)}` : 'Locked'}
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
        {sched
          ? <><CalendarDays size={13} /> {fmtShort(sched.scheduled_date)}</>
          : <><Clock size={13} /> {session.estimated_duration_minutes} {t('common:common.minutes')}</>}
      </span>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Back to program picker */}
      <button
        onClick={() => navigate('/curriculum')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-5 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('common:nav.curriculum')}
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          {program && (
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl shrink-0`}>
              {program.icon}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {program ? (lang === 'id' ? program.name_id : program.name_en) : t('common:nav.curriculum')}
          </h1>
        </div>

        <div className="mt-4">
          <ProgressBar
            value={programCompleted}
            max={totalSessions || 1}
            label={`${programCompleted}/${totalSessions} sessions completed`}
          />
        </div>
      </div>

      {/* Cohort status banner — students only */}
      {!cohort.isEditor && (
        <div className="mb-6">
          <CohortNotice status={cohort.status} cohort={cohort.cohort} courseStarted={cohort.courseStarted} />
        </div>
      )}

      {/* Orientation — Lesson 0 */}
      {orientation && (() => {
        const accessible = cohort.isSessionAccessible(orientation)
        const done = isCompleted(orientation.id)
        return (
          <button
            disabled={!accessible}
            onClick={() => navigate(`/session/${orientation.id}`)}
            className={`w-full flex items-center gap-4 p-5 mb-4 rounded-2xl border text-left transition-all
              ${accessible
                ? 'bg-gradient-to-r from-primary-50 to-cyan-50 border-primary-100 hover:shadow-md cursor-pointer'
                : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center shrink-0">
              <Sparkles size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary" size="sm">Start here</Badge>
                {done && <Badge variant="success" size="sm">✓ {t('common:common.completed')}</Badge>}
              </div>
              <h2 className="mt-1 font-semibold text-gray-900 text-base">{sessionTitle(orientation)}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Lesson 0 · Get oriented and meet your cohort
              </p>
            </div>
            {accessible
              ? <PlayCircle size={22} className="text-primary-500 shrink-0" />
              : <Lock size={18} className="text-gray-300 shrink-0" />}
          </button>
        )
      })()}

      {/* Phases */}
      <div className="space-y-4">
        {phases.map(phase => {
          const phaseCompleted = phase.sessions?.every(s => isCompleted(s.id)) ?? false
          const phaseProgress = phase.sessions?.filter(s => isCompleted(s.id)).length ?? 0
          const isExpanded = expandedPhase === phase.phase_number

          return (
            <div key={phase.id}
              className={`rounded-2xl border overflow-hidden shadow-sm transition-shadow hover:shadow-md ${PHASE_BG[phase.phase_number]}`}>

              {/* Phase header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? 0 : phase.phase_number)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${PHASE_COLORS[phase.phase_number]} flex items-center justify-center text-2xl shrink-0`}>
                  {phase.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="gray" size="sm">Phase {phase.phase_number}</Badge>
                    {phaseCompleted && <Badge variant="success" size="sm">✓ Complete</Badge>}
                  </div>
                  <h2 className="mt-1 font-semibold text-gray-900 text-base">{phaseName(phase)}</h2>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{phaseDesc(phase)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-gray-500 hidden sm:block">
                    {phaseProgress}/{phase.sessions?.length ?? 0}
                  </span>
                  {isExpanded
                    ? <ChevronUp size={18} className="text-gray-400" />
                    : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>

              {/* Phase progress bar */}
              <div className="px-5 pb-3">
                <ProgressBar
                  value={phaseProgress}
                  max={phase.sessions?.length ?? 3}
                  showText={false}
                  size="sm"
                />
              </div>

              {/* Sessions list */}
              {isExpanded && (
                <div className="border-t border-white/60 divide-y divide-white/40">
                  {phase.sessions?.map(session => {
                    const done = isCompleted(session.id)
                    const accessible = cohort.isSessionAccessible(session)

                    return (
                      <button
                        key={session.id}
                        disabled={!accessible}
                        onClick={() => navigate(`/session/${session.id}`)}
                        className={`w-full flex items-start gap-4 px-5 py-4 text-left transition-colors
                          ${accessible ? 'hover:bg-white/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                        `}
                      >
                        {/* Status icon */}
                        <div className="mt-0.5 shrink-0">
                          {done
                            ? <CheckCircle2 size={20} className="text-green-500" />
                            : accessible
                              ? <PlayCircle size={20} className="text-primary-500" />
                              : <Lock size={18} className="text-gray-300" />}
                        </div>

                        {/* Session info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-gray-400">
                              Session {session.session_number}
                            </span>
                            <Badge variant={done ? 'success' : 'gray'} size="sm">
                              {done ? t('common:common.completed') : session.unit_skkni}
                            </Badge>
                            {pendingSessionIds.has(session.id) && (
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation()
                                  cohort.cohortId && openFeedback({
                                    sessionId: session.id,
                                    cohortId: cohort.cohortId,
                                    sessionTitle: sessionTitle(session),
                                  })
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                <MessageSquarePlus size={11} /> Feedback needed
                              </button>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm font-medium text-gray-800 line-clamp-2">
                            {sessionTitle(session)}
                          </p>
                        </div>

                        {/* Right meta */}
                        {lessonMeta(session, accessible)}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
