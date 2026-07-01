import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { useDashboardPrograms, type EnrolledProgram } from '../hooks/useDashboardPrograms'
import { useCohort } from '../hooks/useCohort'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { CohortNotice } from '../components/cohort/CohortNotice'
import type { Program } from '../types'
import type { CohortStatus } from '../hooks/useCohort'

type Lang = 'en' | 'id'

function StatusPill({ status, t }: { status: CohortStatus; t: (k: string) => string }) {
  if (status === 'active') return <Badge variant="success" size="sm">{t('dashboard.enrolled_badge')}</Badge>
  if (status === 'pending') return <Badge variant="warning" size="sm">{t('dashboard.under_review')}</Badge>
  if (status === 'expired') return <Badge variant="gray" size="sm">{t('dashboard.access_ended')}</Badge>
  return null
}

function ProgramIcon({ program }: { program: Program }) {
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center text-2xl shrink-0`}>
      {program.icon}
    </div>
  )
}

export default function CurriculumIndex() {
  const { t, i18n } = useTranslation('common')
  const navigate = useNavigate()
  const { enrolled, programs, loading, isEditor } = useDashboardPrograms()
  const cohort = useCohort()
  const lang: Lang = i18n.language === 'id' ? 'id' : 'en'

  const open = (programId: string) => {
    cohort.setActiveProgram(programId)
    navigate(`/curriculum/${programId}`)
  }

  if (loading || cohort.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <div data-tour="curriculum-header" className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.pick_program_title')}</h1>
        <p className="mt-1 text-gray-500 text-sm">
          {isEditor ? t('dashboard.pick_program_subtitle_editor') : t('dashboard.pick_program_subtitle')}
        </p>
      </div>

      {isEditor ? (
        // Editors browse every program.
        <div className="space-y-4">
          {programs.map(p => (
            <button
              key={p.id}
              onClick={() => open(p.id)}
              className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
            >
              <ProgramIcon program={p} />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 text-base">
                  {lang === 'id' ? p.name_id : p.name_en}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {lang === 'id' ? p.description_id : p.description_en}
                </p>
              </div>
              <ArrowRight size={18} className="text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      ) : enrolled.length > 0 ? (
        // Students pick among the programs they're enrolled in.
        <div className="space-y-4">
          {enrolled.map(ep => (
            <EnrolledProgramCard key={ep.program.id} ep={ep} lang={lang} t={t} onOpen={() => open(ep.program.id)} />
          ))}
        </div>
      ) : (
        <CohortNotice status={cohort.status} cohort={cohort.cohort} courseStarted={cohort.courseStarted} />
      )}
    </div>
  )
}

function EnrolledProgramCard({ ep, lang, t, onOpen }: {
  ep: EnrolledProgram; lang: Lang; t: (k: string) => string; onOpen: () => void
}) {
  const { program, cohort, status, totalSessions, completedCount } = ep
  return (
    <button
      onClick={onOpen}
      className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-start gap-4">
        <ProgramIcon program={program} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-gray-900 text-base">
              {lang === 'id' ? program.name_id : program.name_en}
            </h2>
            <StatusPill status={status} t={t} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{cohort.name}</p>
        </div>
        <ArrowRight size={18} className="text-gray-400 shrink-0 mt-1" />
      </div>
      <div className="mt-4">
        <ProgressBar
          value={completedCount}
          max={totalSessions || 1}
          label={`${completedCount}/${totalSessions} ${t('dashboard.sessions_completed').toLowerCase()}`}
        />
      </div>
    </button>
  )
}
