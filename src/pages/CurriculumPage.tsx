import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, Lock, PlayCircle } from 'lucide-react'
import { usePhases } from '../hooks/usePhases'
import { useProgress } from '../hooks/useProgress'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'

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

export default function CurriculumPage() {
  const { t, i18n } = useTranslation(['common', 'curriculum'])
  const navigate = useNavigate()
  const { phases, loading } = usePhases()
  const { isCompleted, completedCount, loading: progressLoading } = useProgress()
  const [expandedPhase, setExpandedPhase] = useState<number>(1)
  const lang = i18n.language === 'id' ? 'id' : 'en'

  const phaseName = (p: { name_id: string; name_en: string }) =>
    lang === 'id' ? p.name_id : p.name_en
  const phaseDesc = (p: { description_id: string; description_en: string }) =>
    lang === 'id' ? p.description_id : p.description_en
  const sessionTitle = (s: { title_id: string; title_en: string }) =>
    lang === 'id' ? s.title_id : s.title_en

  const isPhaseUnlocked = (phaseIndex: number) => {
    if (phaseIndex === 0) return true
    const prevPhase = phases[phaseIndex - 1]
    if (!prevPhase?.sessions) return false
    return prevPhase.sessions.every(s => isCompleted(s.id))
  }

  if (loading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('common:nav.curriculum')}</h1>
        <p className="mt-1 text-gray-500 text-sm">
          {t('common:landing.curriculum_subtitle')}
        </p>
        <div className="mt-4">
          <ProgressBar value={completedCount} max={12} label={`${completedCount}/12 sessions completed`} />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase, phaseIdx) => {
          const unlocked = isPhaseUnlocked(phaseIdx)
          const phaseCompleted = phase.sessions?.every(s => isCompleted(s.id)) ?? false
          const phaseProgress = phase.sessions?.filter(s => isCompleted(s.id)).length ?? 0
          const isExpanded = expandedPhase === phase.phase_number

          return (
            <div key={phase.id}
              className={`rounded-2xl border overflow-hidden shadow-sm transition-shadow ${
                unlocked ? 'hover:shadow-md' : 'opacity-60'
              } ${PHASE_BG[phase.phase_number]}`}>

              {/* Phase header */}
              <button
                disabled={!unlocked}
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
                    {!unlocked && (
                      <Badge variant="gray" size="sm">
                        <Lock size={10} className="mr-1" /> {t('common:landing.locked')}
                      </Badge>
                    )}
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
              {unlocked && (
                <div className="px-5 pb-3">
                  <ProgressBar
                    value={phaseProgress}
                    max={phase.sessions?.length ?? 3}
                    showText={false}
                    size="sm"
                  />
                </div>
              )}

              {/* Sessions list */}
              {isExpanded && unlocked && (
                <div className="border-t border-white/60 divide-y divide-white/40">
                  {phase.sessions?.map((session, sIdx) => {
                    const done = isCompleted(session.id)
                    const prevDone = sIdx === 0 || isCompleted(phase.sessions![sIdx - 1].id)
                    const accessible = sIdx === 0 || prevDone

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
                              : <Circle size={20} className="text-gray-300" />}
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

                        {/* Duration */}
                        <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                          <Clock size={13} />
                          {session.estimated_duration_minutes} {t('common:common.minutes')}
                        </div>
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
