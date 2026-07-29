import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X, Eye, EyeOff, Lock, ChevronRight, Square, Users, CheckCircle2, Loader2, Timer,
} from 'lucide-react'
import { tallyQuestion } from '../../hooks/useCheckpoints'
import type { useCheckpointConsole } from '../../hooks/useCheckpoints'
import type { Language } from '../../types'

/** Per-option accent, so the projected options read as distinct at a glance. */
const OPTION_ACCENTS = [
  { badge: 'bg-rose-500',   bar: 'bg-rose-500/30',   ring: 'ring-rose-400/40' },
  { badge: 'bg-sky-500',    bar: 'bg-sky-500/30',    ring: 'ring-sky-400/40' },
  { badge: 'bg-amber-500',  bar: 'bg-amber-500/30',  ring: 'ring-amber-400/40' },
  { badge: 'bg-violet-500', bar: 'bg-violet-500/30', ring: 'ring-violet-400/40' },
  { badge: 'bg-teal-500',   bar: 'bg-teal-500/30',   ring: 'ring-teal-400/40' },
]

type Console = ReturnType<typeof useCheckpointConsole>

/**
 * Full-screen mentor view, built to be screen-shared during a live class.
 *
 * Everything on this surface is visible to the cohort, so it deliberately
 * never renders the answer key before the reveal, and per-option counts are
 * off by default — showing them mid-question tells the room which answer is
 * popular and pulls the undecided toward it. The mentor's own console keeps
 * the live breakdown for them.
 */
export function CheckpointPresenter({
  con, lang, cohortName, onExit,
}: { con: Console; lang: Language; cohortName: string | null; onExit: () => void }) {
  const { t } = useTranslation('common')
  const [busy, setBusy] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const {
    currentActivation: act, currentCheckpoint: cp, questions, currentQuestion: q,
    currentIndex, nextQuestion, currentRevealed, secondsLeft,
    responses, answerKeys, presentCount, memberCount,
  } = con

  const run = async (fn: () => Promise<{ error?: string }>) => {
    setBusy(true)
    const res = await fn()
    setBusy(false)
    if (res.error) alert(res.error)
  }

  // Esc leaves presenting without touching the activation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onExit])

  if (!act || !cp || !q) return null

  const key = answerKeys[q.id]
  const { counts, answered } = tallyQuestion(q, responses, key)
  const denominator = presentCount || memberCount
  const isOpen = act.status === 'open'
  const locked = act.locked || (secondsLeft !== null && secondsLeft <= 0)
  // Counts stay hidden until the mentor opts in or the answer is revealed.
  const barsVisible = showStats || currentRevealed
  const timeIsShort = secondsLeft !== null && secondsLeft <= 5

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      {/* ── Top bar ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 flex-wrap">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          {isOpen && !locked && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400/70" />
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? 'bg-green-400' : 'bg-slate-500'}`} />
        </span>
        <span className="text-sm font-semibold tracking-wide">
          {lang === 'id' ? cp.title_id : cp.title_en}
        </span>
        {questions.length > 1 && (
          <span className="text-sm text-slate-400">
            {t('checkpoint.question_n_of_m', { n: currentIndex + 1, m: questions.length })}
          </span>
        )}
        {cohortName && (
          <span className="text-sm text-slate-500 hidden sm:inline">· {cohortName}</span>
        )}

        <div className="ml-auto flex items-center gap-4">
          <span className="flex items-center gap-2 text-lg font-semibold tabular-nums">
            <Users size={18} className="text-slate-400" />
            {answered}
            <span className="text-slate-500 text-base font-normal">/ {denominator}</span>
          </span>
          {secondsLeft !== null && (
            <span className={`flex items-center gap-1.5 text-2xl font-bold tabular-nums px-3 py-1 rounded-xl ${
              timeIsShort ? 'bg-rose-500/20 text-rose-300' : 'bg-white/5 text-slate-200'
            }`}>
              <Timer size={20} />{secondsLeft}
            </span>
          )}
          <button
            onClick={onExit}
            title={t('checkpoint.exit_presenting')}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Question + options ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-10">
        <h2 className="text-2xl sm:text-4xl font-bold leading-snug max-w-5xl mx-auto text-center mb-8 sm:mb-12">
          {lang === 'id' ? q.prompt_id : q.prompt_en}
        </h2>

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 max-w-5xl mx-auto">
          {q.options.map((opt, i) => {
            const accent = OPTION_ACCENTS[i % OPTION_ACCENTS.length]
            const n = counts[opt.id] ?? 0
            const pct = answered ? Math.round((n / answered) * 100) : 0
            const isCorrect = currentRevealed && key === opt.id
            return (
              <div
                key={opt.id}
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 sm:py-5 transition-all ${
                  isCorrect
                    ? 'border-green-400 bg-green-400/10 ring-2 ring-green-400/50'
                    : currentRevealed
                      ? 'border-white/10 bg-white/[0.03] opacity-60'
                      : `border-white/15 bg-white/[0.06] ring-1 ${accent.ring}`
                }`}
              >
                {/* Fill bar — only once counts are allowed on screen. */}
                {barsVisible && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-[width] duration-500 ${
                      isCorrect ? 'bg-green-400/25' : accent.bar
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center gap-3.5">
                  <span className={`shrink-0 w-9 h-9 rounded-xl grid place-items-center text-base font-bold uppercase ${
                    isCorrect ? 'bg-green-500' : accent.badge
                  }`}>
                    {isCorrect ? <CheckCircle2 size={20} /> : opt.id}
                  </span>
                  <span className="flex-1 text-lg sm:text-2xl font-medium">
                    {lang === 'id' ? opt.label_id : opt.label_en}
                  </span>
                  {barsVisible && (
                    <span className="shrink-0 text-base sm:text-xl font-semibold tabular-nums text-slate-300">
                      {n} · {pct}%
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {!barsVisible && (
          <p className="text-center text-slate-500 text-sm mt-8">
            {locked ? t('checkpoint.locked_hint') : t('checkpoint.answering_hint')}
          </p>
        )}
      </div>

      {/* ── Controls ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-6 py-4 border-t border-white/10 flex-wrap">
        <button
          onClick={() => setShowStats(s => !s)}
          disabled={currentRevealed}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer disabled:opacity-40 disabled:cursor-default"
        >
          {showStats ? <EyeOff size={15} /> : <Eye size={15} />}
          {showStats ? t('checkpoint.hide_stats') : t('checkpoint.show_stats')}
        </button>

        {isOpen && !locked && (
          <button
            onClick={() => run(con.lockQuestion)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer disabled:opacity-60"
          >
            <Lock size={15} /> {t('checkpoint.lock')}
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {isOpen && !currentRevealed && (
            <button
              onClick={() => run(() => con.revealQuestion())}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-base font-semibold px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white cursor-pointer disabled:opacity-60"
            >
              {busy ? <Loader2 size={17} className="animate-spin" /> : <CheckCircle2 size={17} />}
              {t('checkpoint.reveal')}
            </button>
          )}
          {isOpen && nextQuestion && (
            <button
              onClick={() => run(() => con.setQuestion(nextQuestion.id))}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-base font-semibold px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 cursor-pointer disabled:opacity-60"
            >
              {t('checkpoint.next_question')} <ChevronRight size={17} />
            </button>
          )}
          {isOpen && !nextQuestion && (
            <button
              onClick={() => run(con.close)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-base font-semibold px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 cursor-pointer disabled:opacity-60"
            >
              <Square size={16} /> {t('checkpoint.finish')}
            </button>
          )}
          {!isOpen && (
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-base font-semibold px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 cursor-pointer"
            >
              {t('checkpoint.done')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
