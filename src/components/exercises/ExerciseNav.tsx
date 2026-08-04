import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ListChecks, Zap, Flame, Skull } from 'lucide-react'
import { usePassedExerciseIds } from '../../hooks/useExercises'
import { useAuth } from '../../hooks/useAuth'
import type { Exercise } from '../../types'

interface Props {
  exercises: Exercise[]
  currentId?: string
  sessionId?: string | null
  lang: 'en' | 'id'
}

const DIFF_ICON: Record<string, typeof Zap> = {
  easy: Zap,
  medium: Flame,
  hard: Skull,
}

const DIFF_COLOR: Record<string, string> = {
  easy: 'text-emerald-500',
  medium: 'text-amber-500',
  hard: 'text-red-500',
}

/**
 * Left-hand navigation listing every exercise in the current session so the
 * learner can jump between them without going back to the session page.
 */
export function ExerciseNav({ exercises, currentId, sessionId, lang }: Props) {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { passedIds } = usePassedExerciseIds(exercises.map(e => e.id), profile?.id)

  if (exercises.length <= 1) return null

  const passedCount = exercises.filter(e => passedIds.has(e.id)).length

  return (
    <nav className="w-full lg:w-60 lg:shrink-0" aria-label={lang === 'id' ? 'Navigasi latihan' : 'Exercise navigation'}>
      <div className="lg:sticky lg:top-6 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
            <ListChecks size={13} className="text-primary-600" />
          </div>
          <span className="text-xs font-semibold text-gray-800">
            {lang === 'id' ? 'Latihan Sesi' : 'Session Exercises'}
          </span>
          <span className="ml-auto text-xs text-gray-400 font-medium tabular-nums">
            {passedCount}/{exercises.length}
          </span>
        </div>

        {/* List */}
        <div className="p-1.5 max-h-[70vh] overflow-y-auto">
          {exercises.map((ex, i) => {
            const title = lang === 'id' ? ex.title_id : ex.title_en
            const active = ex.id === currentId
            const passed = passedIds.has(ex.id)
            const DiffIcon = DIFF_ICON[ex.difficulty] ?? Zap

            return (
              <button
                key={ex.id}
                onClick={() => {
                  if (active) return
                  navigate(`/exercise/${ex.id}`, { state: { fromSessionId: sessionId } })
                }}
                aria-current={active ? 'page' : undefined}
                className={`cursor-pointer w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors group ${
                  active ? 'bg-primary-50 border border-primary-200' : 'border border-transparent hover:bg-gray-50'
                }`}
              >
                {/* Status / number */}
                {passed ? (
                  <span className="w-5 h-5 rounded-full bg-green-100 border border-green-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={11} className="text-green-600" />
                  </span>
                ) : (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono shrink-0 border ${
                    active ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-gray-100 border-gray-200 text-gray-500'
                  }`}>
                    {i + 1}
                  </span>
                )}

                {/* Title */}
                <span className={`flex-1 text-xs leading-snug truncate ${
                  active ? 'text-primary-800 font-medium' : passed ? 'text-green-700' : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {title}
                </span>

                {/* Difficulty icon */}
                <DiffIcon size={11} className={`shrink-0 ${DIFF_COLOR[ex.difficulty] ?? 'text-gray-400'}`} />
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
