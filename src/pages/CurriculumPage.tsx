import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2, Clock, ChevronDown, ChevronUp, Lock, PlayCircle,
  CalendarDays, Sparkles,
} from 'lucide-react'
import { usePhases, usePrograms } from '../hooks/usePhases'
import { useProgress } from '../hooks/useProgress'
import { useCohort } from '../hooks/useCohort'
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
  const { programs, loading: programsLoading } = usePrograms()
  const cohort = useCohort()
  const lang = i18n.language === 'id' ? 'id' : 'en'

  // Students are locked to their cohort's program.
  // Editors (admin/mentor) can switch between all programs.
  const [picked, setPicked] = useState<string | null>(null)
  const studentProgramId = cohort.cohort?.program_id ?? programs[0]?.id
  const programId = cohort.isEditor
    ? (picked ?? studentProgramId)
    : studentProgramId

  const { phases, orientation, loading } = usePhases(programId)
  const { isCompleted, loading: progressLoading } = useProgress()
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

  if (loading || progressLoading || cohort.loading || programsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Hard gate: no usable cohort relationship → block the curriculum entirely.
  const blocked = !cohort.isAdmin &&
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('common:nav.curriculum')}</h1>
        <p className="mt-1 text-gray-500 text-sm">
          {t('common:landing.curriculum_subtitle')}
        </p>

        {/* Program switcher — editors (admin/mentor) only */}
        {cohort.isEditor && programs.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {programs.map(p => {
              const active = p.id === programId
              return (
                <button
                  key={p.id}
                  onClick={() => { setPicked(p.id); setExpandedPhase(1) }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}
                >
                  <span>{p.icon}</span>
                  {lang === 'id' ? p.name_id : p.name_en}
                </button>
              )
            })}
          </div>
        )}

        {/* Students: show which program they're enrolled in */}
        {!cohort.isEditor && cohort.cohort && (() => {
          const prog = programs.find(p => p.id === cohort.cohort!.program_id)
          if (!prog) return null
          return (
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-500">
              <span>{prog.icon}</span>
              <span className="font-medium text-gray-700">
                {lang === 'id' ? prog.name_id : prog.name_en}
              </span>
            </div>
          )
        })()}

        <div className="mt-4">
          <ProgressBar
            value={programCompleted}
            max={totalSessions || 1}
            label={`${programCompleted}/${totalSessions} sessions completed`}
          />
        </div>
      </div>

      {/* Cohort status banner */}
      {!cohort.isAdmin && (
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
