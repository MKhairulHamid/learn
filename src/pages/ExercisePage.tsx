import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Play, Send, BookOpen } from 'lucide-react'
import { SqlEditor } from '../components/exercises/SqlEditor'
import { ResultsTable } from '../components/exercises/ResultsTable'
import { TestResultPanel } from '../components/exercises/TestResultPanel'
import { HintSystem } from '../components/exercises/HintSystem'
import { useExercise, useSubmissions } from '../hooks/useExercises'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import { runQuery } from '../lib/sqlSimulator'
import { evaluateExercise } from '../lib/evaluator'
import { supabase } from '../lib/supabase'
import type { QueryResult } from '../lib/sqlSimulator'
import type { TestResult } from '../types'

export default function ExercisePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = useAuth()
  const lang = (localStorage.getItem('i18nextLng') ?? 'en') as 'en' | 'id'

  const { exercise, loading, error } = useExercise(id)
  const { submissions, saveSubmission } = useSubmissions(id, profile?.id)
  const { markComplete } = useProgress()

  const [query, setQuery] = useState('')
  const [runResult, setRunResult] = useState<QueryResult | null>(null)
  const [testResults, setTestResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [allPassed, setAllPassed] = useState(false)

  const attemptCount = submissions.length

  async function handleRun() {
    setRunning(true)
    setTestResults(null)
    const r = await runQuery(query)
    setRunResult(r)
    setRunning(false)
  }

  async function handleSubmit() {
    if (!exercise || !profile) return
    setSubmitting(true)

    const testCases = (exercise.test_cases ?? []) as Parameters<typeof evaluateExercise>[1]
    const { results, allPassed: passed, score } = await evaluateExercise(query, testCases, lang)
    setTestResults(results)
    setAllPassed(passed)

    await saveSubmission({
      user_id: profile.id,
      exercise_id: exercise.id,
      submitted_code: query,
      passed,
      test_results: results,
      attempt_number: attemptCount + 1,
      score,
    })

    if (passed && exercise.session_id) {
      await markComplete(exercise.session_id)
      await supabase.from('user_activity_logs').insert({
        user_id: profile.id,
        action_type: 'exercise_complete' as const,
        metadata: { exercise_id: exercise.id, score },
      })
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-400">
        Loading exercise…
      </div>
    )
  }

  if (error || !exercise) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-red-400">
        {error ?? 'Exercise not found.'}
      </div>
    )
  }

  const hints = lang === 'id'
    ? (exercise.hints_id ?? []) as string[]
    : (exercise.hints_en ?? []) as string[]
  const title = lang === 'id' ? exercise.title_id : exercise.title_en
  const description = lang === 'id' ? exercise.description_id : exercise.description_en

  const difficultyColor: Record<string, string> = {
    easy: 'text-green-400 bg-green-950/40 border-green-900',
    medium: 'text-yellow-400 bg-yellow-950/40 border-yellow-900',
    hard: 'text-red-400 bg-red-950/40 border-red-900',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <button
          onClick={() => {
            const sessionId = location.state?.fromSessionId ?? exercise.session_id
            if (sessionId) {
              navigate(`/session/${sessionId}`, { state: { scrollTo: 'exercises' } })
            } else {
              navigate('/curriculum')
            }
          }}
          className="shrink-0 mt-1 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${difficultyColor[exercise.difficulty] ?? difficultyColor.easy}`}>
              {exercise.difficulty}
            </span>
            {attemptCount > 0 && (
              <span className="text-xs text-gray-500">
                {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Problem statement */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
              <BookOpen size={15} />
              {lang === 'id' ? 'Soal' : 'Problem'}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <HintSystem hints={hints} lang={lang} />
          </div>

          {testResults && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <TestResultPanel results={testResults} lang={lang} />
            </div>
          )}

          {allPassed && (
            <div className="bg-primary-950/40 border border-primary-800 rounded-2xl p-5 text-center">
              <p className="text-primary-300 font-medium text-sm">
                {lang === 'id' ? 'Sesi ini ditandai selesai!' : 'Session marked as complete!'}
              </p>
            </div>
          )}
        </div>

        {/* Editor + results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            {exercise.starter_code && query === '' && (
              <p className="text-xs text-gray-500">
                {lang === 'id' ? 'Kode awal dimuat' : 'Starter code loaded'}
              </p>
            )}
            <SqlEditor
              value={query || exercise.starter_code || ''}
              onChange={setQuery}
              height="280px"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="flex items-center gap-2 border border-gray-600 hover:border-gray-400 text-gray-200 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Play size={14} />
                {running ? (lang === 'id' ? 'Menjalankan…' : 'Running…') : (lang === 'id' ? 'Jalankan' : 'Run')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Send size={14} />
                {submitting ? (lang === 'id' ? 'Mengirim…' : 'Submitting…') : (lang === 'id' ? 'Kirim' : 'Submit')}
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              {lang === 'id' ? 'Hasil' : 'Results'}
            </h3>
            <ResultsTable result={runResult} loading={running} />
          </div>
        </div>
      </div>
    </div>
  )
}
