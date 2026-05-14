import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Play, Send, BookOpen, CheckCircle2, ChevronRight, Zap, Flame, Skull, RotateCcw } from 'lucide-react'
import { SqlEditor } from '../components/exercises/SqlEditor'
import { ResultsTable } from '../components/exercises/ResultsTable'
import { TestResultPanel } from '../components/exercises/TestResultPanel'
import { HintSystem } from '../components/exercises/HintSystem'
import { MatchingExercise } from '../components/exercises/MatchingExercise'
import { useExercise, useExercises, useSubmissions } from '../hooks/useExercises'
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
  const { exercises: sessionExercises } = useExercises(exercise?.session_id)
  const { submissions, saveSubmission } = useSubmissions(id, profile?.id)
  const { markComplete } = useProgress()

  // Find next exercise in the same session
  const currentIndex = sessionExercises.findIndex(e => e.id === id)
  const nextExercise = currentIndex >= 0 ? sessionExercises[currentIndex + 1] : null

  const [query, setQuery] = useState('')
  const [matchSelections, setMatchSelections] = useState<string[]>([])
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

  async function handleMatchSubmit() {
    if (!exercise || !profile) return
    setSubmitting(true)
    const testCases = (exercise.test_cases ?? []) as Parameters<typeof evaluateExercise>[1]
    const answer = JSON.stringify(matchSelections)
    const { results, allPassed: passed, score } = await evaluateExercise(answer, testCases, lang)
    setTestResults(results)
    setAllPassed(passed)
    await saveSubmission({ user_id: profile.id, exercise_id: exercise.id, submitted_code: answer, passed, test_results: results, attempt_number: attemptCount + 1, score })
    if (passed && exercise.session_id) {
      await markComplete(exercise.session_id)
      await supabase.from('user_activity_logs').insert({ user_id: profile.id, action_type: 'exercise_complete' as const, metadata: { exercise_id: exercise.id, score } })
    }
    setSubmitting(false)
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

  // Light-theme difficulty styles (header sits on white page bg)
  const DIFF_STYLE: Record<string, { text: string; bg: string; border: string; dot: string; iconEl: string }> = {
    easy:   { text: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', dot: 'bg-emerald-400', iconEl: 'zap'   },
    medium: { text: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   dot: 'bg-amber-400',   iconEl: 'flame' },
    hard:   { text: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200',     dot: 'bg-red-400',     iconEl: 'skull' },
  }

  const TYPE_LABEL: Record<string, string> = {
    sql: 'SQL', matching: 'Matching', quiz: 'Quiz', multiple_choice: 'MCQ',
  }

  const diff = DIFF_STYLE[exercise.difficulty] ?? DIFF_STYLE.easy

  function ExerciseHeader({ onBack }: { onBack: () => void }) {
    return (
      <div className="mb-8">
        {/* Back breadcrumb */}
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-5 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          {lang === 'id' ? 'Kembali ke sesi' : 'Back to session'}
        </button>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Difficulty */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${diff.text} ${diff.bg} ${diff.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
            {diff.iconEl === 'zap'   && <Zap   size={11} />}
            {diff.iconEl === 'flame' && <Flame size={11} />}
            {diff.iconEl === 'skull' && <Skull size={11} />}
            {exercise!.difficulty}
          </span>

          {/* Separator dot */}
          <span className="w-1 h-1 rounded-full bg-gray-300" />

          {/* Type */}
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200">
            {TYPE_LABEL[exercise!.type] ?? exercise!.type}
          </span>

          {/* Attempt count */}
          {attemptCount > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-gray-500 bg-gray-100 border border-gray-200">
                <RotateCcw size={10} />
                {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug tracking-tight">{title}</h1>
      </div>
    )
  }

  // ── Matching exercise layout ──────────────────────────────────
  if (exercise.type === 'matching') {
    let pairs: { left: string; right: string }[] = []
    try { pairs = JSON.parse(exercise.starter_code || '{}').pairs ?? [] } catch { pairs = [] }
    const allSelected = pairs.length > 0 && matchSelections.filter(Boolean).length === pairs.length

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExerciseHeader onBack={() => { const sid = location.state?.fromSessionId ?? exercise.session_id; navigate(sid ? `/session/${sid}` : '/curriculum', { state: { scrollTo: 'exercises' } }) }} />

        <div className="space-y-4">
          {/* Description */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-3">
              <BookOpen size={15} />
              {lang === 'id' ? 'Petunjuk' : 'Instructions'}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Matching UI */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <MatchingExercise
              pairs={pairs}
              selections={matchSelections}
              onChange={setMatchSelections}
              testResults={testResults}
              allPassed={allPassed}
              lang={lang}
            />

            {!allPassed && (
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleMatchSubmit}
                  disabled={submitting || !allSelected}
                  className="cursor-pointer flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                  {submitting ? (lang === 'id' ? 'Memeriksa…' : 'Checking…') : (lang === 'id' ? 'Periksa Jawaban' : 'Check Answers')}
                </button>
                {!allSelected && (
                  <span className="text-xs text-gray-500">
                    {lang === 'id' ? 'Pilih semua pasangan dulu' : 'Select all matches first'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Hints */}
          {hints.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <HintSystem hints={hints} lang={lang} />
            </div>
          )}

          {/* Success panel */}
          {allPassed && (
            <div className="bg-green-950/40 border border-green-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                <p className="text-green-300 font-semibold text-sm">
                  {lang === 'id' ? 'Semua pasangan cocok! 🎉' : 'All matches correct! 🎉'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {nextExercise && (
                  <button onClick={() => navigate(`/exercise/${nextExercise.id}`, { state: { fromSessionId: exercise.session_id } })} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    {lang === 'id' ? 'Latihan Berikutnya' : 'Next Exercise'} <ChevronRight size={15} />
                  </button>
                )}
                <button onClick={() => navigate(`/session/${exercise.session_id}`, { state: { scrollTo: 'exercises' } })} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <ArrowLeft size={15} /> {lang === 'id' ? 'Kembali ke Sesi' : 'Back to Session'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ExerciseHeader onBack={() => {
        const sessionId = location.state?.fromSessionId ?? exercise.session_id
        navigate(sessionId ? `/session/${sessionId}` : '/curriculum', { state: { scrollTo: 'exercises' } })
      }} />

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
            <div className="bg-green-950/40 border border-green-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                <p className="text-green-300 font-semibold text-sm">
                  {lang === 'id' ? 'Semua tes lulus! 🎉' : 'All tests passed! 🎉'}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {nextExercise && (
                  <button
                    onClick={() => navigate(`/exercise/${nextExercise.id}`, { state: { fromSessionId: exercise.session_id } })}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    {lang === 'id' ? 'Latihan Berikutnya' : 'Next Exercise'}
                    <ChevronRight size={15} />
                  </button>
                )}
                <button
                  onClick={() => navigate(`/session/${exercise.session_id}`, { state: { scrollTo: 'exercises' } })}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <ArrowLeft size={15} />
                  {lang === 'id' ? 'Kembali ke Sesi' : 'Back to Session'}
                </button>
              </div>
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
                className="cursor-pointer flex items-center gap-2 border border-gray-600 hover:border-gray-400 text-gray-200 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={14} />
                {running ? (lang === 'id' ? 'Menjalankan…' : 'Running…') : (lang === 'id' ? 'Jalankan' : 'Run')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="cursor-pointer flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
