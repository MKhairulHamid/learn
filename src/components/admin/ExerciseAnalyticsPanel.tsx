import { useState, useEffect } from 'react'
import { TrendingDown, Users, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Exercise } from '../../types'

interface ExerciseStat {
  id: string
  title_en: string
  title_id: string
  difficulty: 'easy' | 'medium' | 'hard'
  session_id: string
  attempts: number
  passed: number
  passRate: number
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy:   'bg-green-900/50 text-green-400 border border-green-800',
  medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  hard:   'bg-red-900/50 text-red-400 border border-red-800',
}

function passRateColor(rate: number): string {
  if (rate < 40) return 'bg-red-500'
  if (rate < 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

function passRateTextColor(rate: number): string {
  if (rate < 40) return 'text-red-400'
  if (rate < 70) return 'text-yellow-400'
  return 'text-green-400'
}

export function ExerciseAnalyticsPanel() {
  const [stats, setStats] = useState<ExerciseStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      const [exResult, subResult] = await Promise.all([
        supabase.from('exercises').select('id, title_en, title_id, difficulty, session_id'),
        supabase.from('exercise_submissions').select('exercise_id, passed'),
      ])

      if (exResult.error) { setError(exResult.error.message); setLoading(false); return }
      if (subResult.error) { setError(subResult.error.message); setLoading(false); return }

      const exercises = (exResult.data ?? []) as Pick<
        Exercise, 'id' | 'title_en' | 'title_id' | 'difficulty' | 'session_id'
      >[]
      const submissions = (subResult.data ?? []) as { exercise_id: string; passed: boolean }[]

      const computed: ExerciseStat[] = exercises.map(ex => {
        const exSubs = submissions.filter(s => s.exercise_id === ex.id)
        const attempts = exSubs.length
        const passedCount = exSubs.filter(s => s.passed).length
        const passRate = attempts > 0 ? Math.round((passedCount / attempts) * 100) : 0
        return {
          id: ex.id,
          title_en: ex.title_en,
          title_id: ex.title_id,
          difficulty: ex.difficulty,
          session_id: ex.session_id,
          attempts,
          passed: passedCount,
          passRate,
        }
      })

      // Sort ascending by pass rate (hardest / most failed first)
      computed.sort((a, b) => a.passRate - b.passRate)

      setStats(computed)
      setLoading(false)
    }

    load()
  }, [])

  const totalAttempts = stats.reduce((s, e) => s + e.attempts, 0)
  const avgPassRate = stats.length > 0
    ? Math.round(stats.reduce((s, e) => s + e.passRate, 0) / stats.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{stats.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Exercises</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Users size={16} className="text-gray-500" />
            <p className="text-2xl font-bold text-white">{totalAttempts}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Total Attempts</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 size={16} className={passRateTextColor(avgPassRate)} />
            <p className={`text-2xl font-bold ${passRateTextColor(avgPassRate)}`}>{avgPassRate}%</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">Avg Pass Rate</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 text-sm">
            Error loading data: {error}
          </div>
        ) : stats.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No exercise data yet.
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_180px] gap-4 px-5 py-3 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Exercise</span>
              <span className="text-center">Difficulty</span>
              <span className="text-center w-16">Attempts</span>
              <span>Pass Rate</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-800/60">
              {stats.map(stat => (
                <div
                  key={stat.id}
                  className="grid grid-cols-[1fr_auto_auto_180px] gap-4 items-center px-5 py-3.5 hover:bg-gray-800/40 transition-colors"
                >
                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 truncate">{stat.title_en}</p>
                    {stat.title_id && stat.title_id !== stat.title_en && (
                      <p className="text-xs text-gray-600 truncate">{stat.title_id}</p>
                    )}
                  </div>

                  {/* Difficulty */}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${DIFFICULTY_BADGE[stat.difficulty] ?? ''}`}>
                    {stat.difficulty.charAt(0).toUpperCase() + stat.difficulty.slice(1)}
                  </span>

                  {/* Attempts */}
                  <span className="text-sm text-gray-400 text-center w-16">
                    {stat.attempts === 0 ? (
                      <span className="text-gray-700">—</span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <TrendingDown size={12} className="text-gray-600" />
                        {stat.attempts}
                      </span>
                    )}
                  </span>

                  {/* Pass Rate bar + % */}
                  <div className="w-full">
                    {stat.attempts === 0 ? (
                      <span className="text-xs text-gray-700">No submissions</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${passRateColor(stat.passRate)}`}
                            style={{ width: `${stat.passRate}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold w-9 text-right shrink-0 ${passRateTextColor(stat.passRate)}`}>
                          {stat.passRate}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
