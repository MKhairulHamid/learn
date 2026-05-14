import { useNavigate } from 'react-router-dom'
import { Code2, ChevronRight, Trophy, CheckCircle2 } from 'lucide-react'
import { useExercises, usePassedExerciseIds } from '../../hooks/useExercises'
import { useAuth } from '../../context/AuthContext'

interface Props {
  sessionId: string
  lang?: 'en' | 'id'
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy:   'bg-green-50 text-green-700 border border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  hard:   'bg-red-50 text-red-700 border border-red-200',
}

export function SessionExercises({ sessionId, lang = 'en' }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { exercises, loading } = useExercises(sessionId)
  const exerciseIds = exercises.map(e => e.id)
  const { passedIds } = usePassedExerciseIds(exerciseIds, user?.id)

  const label = lang === 'id' ? 'Latihan Soal' : 'Practice Exercises'
  const passedCount = exerciseIds.filter(id => passedIds.has(id)).length

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
        <div className="h-4 w-36 bg-gray-100 rounded-full animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (exercises.length === 0) return null

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center">
          <Code2 size={14} className="text-primary-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
        <span className="ml-auto text-xs flex items-center gap-1.5">
          {passedCount > 0 && (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <CheckCircle2 size={11} />
              {passedCount}/{exercises.length}
            </span>
          )}
          {passedCount === 0 && (
            <span className="text-gray-400 flex items-center gap-1">
              <Trophy size={11} />
              {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
            </span>
          )}
        </span>
      </div>

      {/* Exercise list */}
      <div className="divide-y divide-gray-50">
        {exercises.map(exercise => {
          const title = lang === 'id' ? exercise.title_id : exercise.title_en
          const diffLabel = exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)
          const passed = passedIds.has(exercise.id)

          return (
            <button
              key={exercise.id}
              onClick={() => navigate(`/exercise/${exercise.id}`, { state: { fromSessionId: sessionId } })}
              className="cursor-pointer w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group text-left"
            >
              {/* Passed indicator / order number */}
              {passed ? (
                <span className="w-6 h-6 rounded-full bg-green-100 border border-green-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} className="text-green-600" />
                </span>
              ) : (
                <span className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0">
                  {exercise.order_num}
                </span>
              )}

              {/* Title */}
              <span className={`flex-1 text-sm transition-colors truncate ${passed ? 'text-green-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                {title}
                {passed && (
                  <span className="ml-2 text-xs text-green-500">
                    {lang === 'id' ? '· Selesai' : '· Passed'}
                  </span>
                )}
              </span>

              {/* Difficulty badge */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${DIFFICULTY_BADGE[exercise.difficulty] ?? ''}`}>
                {diffLabel}
              </span>

              {/* Arrow */}
              <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
