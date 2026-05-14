import { Link } from 'react-router-dom'
import { Code2, ChevronRight, Trophy } from 'lucide-react'
import { useExercises } from '../../hooks/useExercises'

interface Props {
  sessionId: string
  lang?: 'en' | 'id'
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy:   'bg-green-900/50 text-green-400 border border-green-800',
  medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  hard:   'bg-red-900/50 text-red-400 border border-red-800',
}

export function SessionExercises({ sessionId, lang = 'en' }: Props) {
  const { exercises, loading } = useExercises(sessionId)

  const label = lang === 'id' ? 'Latihan Soal' : 'Practice Exercises'

  if (loading) {
    return (
      <div className="border border-gray-800 rounded-2xl p-5 space-y-3">
        <div className="h-4 w-36 bg-gray-800 rounded-full animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (exercises.length === 0) return null

  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-900/50 border border-primary-800 flex items-center justify-center">
          <Code2 size={14} className="text-primary-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-200">{label}</h3>
        <span className="ml-auto text-xs text-gray-600 flex items-center gap-1">
          <Trophy size={11} />
          {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Exercise list */}
      <div className="divide-y divide-gray-800/60">
        {exercises.map(exercise => {
          const title = lang === 'id' ? exercise.title_id : exercise.title_en
          const diffLabel = exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)

          return (
            <Link
              key={exercise.id}
              to={`/exercise/${exercise.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors group"
            >
              {/* Order number */}
              <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-mono text-gray-500 shrink-0">
                {exercise.order_num}
              </span>

              {/* Title */}
              <span className="flex-1 text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                {title}
              </span>

              {/* Difficulty badge */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${DIFFICULTY_BADGE[exercise.difficulty] ?? ''}`}>
                {diffLabel}
              </span>

              {/* Arrow */}
              <ChevronRight size={15} className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
