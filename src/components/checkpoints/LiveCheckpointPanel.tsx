import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Radio, CheckCircle2, XCircle, ChevronDown, ChevronUp, Circle, Minimize2, Loader2,
} from 'lucide-react'
import { useLiveCheckpoints, useCheckpointPresence } from '../../hooks/useCheckpoints'
import type { CheckpointQuestion, Language, SessionCheckpoint } from '../../types'

/** Mirrors the mentor's presenter accents so "the blue one" means the same thing. */
const OPTION_ACCENTS = [
  { badge: 'bg-rose-500',   idle: 'hover:border-rose-300',   on: 'border-rose-400 bg-rose-50' },
  { badge: 'bg-sky-500',    idle: 'hover:border-sky-300',    on: 'border-sky-400 bg-sky-50' },
  { badge: 'bg-amber-500',  idle: 'hover:border-amber-300',  on: 'border-amber-400 bg-amber-50' },
  { badge: 'bg-violet-500', idle: 'hover:border-violet-300', on: 'border-violet-400 bg-violet-50' },
  { badge: 'bg-teal-500',   idle: 'hover:border-teal-300',   on: 'border-teal-400 bg-teal-50' },
]

/**
 * Learner-facing live checkpoint.
 *
 *  - Mentor is running a checkpoint → a focused overlay with the current
 *    question, a countdown, and one final answer. Minimizable to a pill so
 *    the lesson underneath stays reachable.
 *  - Just finished → the result stays on screen until dismissed, instead of
 *    vanishing the moment the mentor closes.
 *  - Idle → the checkpoints as a review list; questions already covered in
 *    class show their correct answer (RLS hands back only those keys).
 */
export function LiveCheckpointPanel({
  sessionId, cohortId, lang,
}: { sessionId: string; cohortId: string | null; lang: Language }) {
  const live = useLiveCheckpoints(sessionId, cohortId)
  const [minimized, setMinimized] = useState(false)
  const [dismissed, setDismissed] = useState<string | null>(null)

  // Report presence so the mentor's "answered 12 of 14" counts who is here.
  useCheckpointPresence(cohortId, sessionId, { asLearner: true })

  const activationId = live.activation?.id ?? null

  // A new checkpoint always comes back to the front.
  useEffect(() => { setMinimized(false) }, [activationId])
  useEffect(() => { setMinimized(false) }, [live.activation?.current_question_id])

  if (live.loading || live.checkpoints.length === 0) return null

  const showOverlay = live.showLive
    && !!live.activeCheckpoint
    && !!live.currentQuestion
    && dismissed !== activationId

  if (showOverlay && minimized) {
    return (
      <>
        <button
          onClick={() => setMinimized(false)}
          className="fixed bottom-20 sm:bottom-6 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <ReturnLabel answered={!!live.myAnswer} />
        </button>
        <ReviewList checkpoints={live.checkpoints} reviewKey={live.reviewKey} lang={lang} />
      </>
    )
  }

  if (showOverlay) {
    return (
      <LiveOverlay
        live={live} lang={lang}
        onMinimize={() => setMinimized(true)}
        onDismiss={() => setDismissed(activationId)}
      />
    )
  }

  return <ReviewList checkpoints={live.checkpoints} reviewKey={live.reviewKey} lang={lang} />
}

function ReturnLabel({ answered }: { answered: boolean }) {
  const { t } = useTranslation('common')
  return (
    <span className="text-sm font-semibold">
      {answered ? t('checkpoint.back_to_results') : t('checkpoint.back_to_question')}
    </span>
  )
}

// ── The live overlay ────────────────────────────────────────────────
function LiveOverlay({
  live, lang, onMinimize, onDismiss,
}: {
  live: ReturnType<typeof useLiveCheckpoints>
  lang: Language
  onMinimize: () => void
  onDismiss: () => void
}) {
  const { t } = useTranslation('common')
  const [sending, setSending] = useState<string | null>(null)
  const {
    activeCheckpoint: cp, currentQuestion: q, activation, myAnswer,
    currentRevealed, revealedKey, isLive, canAnswer, secondsLeft, locked,
  } = live

  if (!cp || !q || !activation) return null

  const questions = cp.questions ?? []
  const index = questions.findIndex(x => x.id === q.id)
  const key = revealedKey[q.id]
  const myPick = myAnswer?.selected_option_id
  const iWasRight = currentRevealed && key && myPick === key

  const answer = async (optionId: string) => {
    if (!canAnswer) return
    setSending(optionId)
    const res = await live.submitAnswer(q.id, optionId)
    setSending(null)
    if (res.error) alert(res.error)
  }

  const limit = activation.time_limit_seconds
  const ringPct = secondsLeft !== null && limit > 0
    ? Math.max(0, Math.min(1, secondsLeft / limit)) : null

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-3.5 bg-primary-600 text-white shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            {isLive && !locked && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
            )}
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="text-sm font-semibold">
            {isLive ? t('checkpoint.live_now') : t('checkpoint.finished')}
          </span>
          {questions.length > 1 && index >= 0 && (
            <span className="text-xs text-primary-100">
              {t('checkpoint.question_n_of_m', { n: index + 1, m: questions.length })}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {ringPct !== null && isLive && !currentRevealed && (
              <CountdownRing seconds={secondsLeft ?? 0} pct={ringPct} />
            )}
            <button
              onClick={onMinimize}
              title={t('checkpoint.minimize')}
              className="p-1.5 rounded-lg hover:bg-white/15 cursor-pointer"
            >
              <Minimize2 size={16} />
            </button>
          </div>
        </div>

        {/* Question + options */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
            {lang === 'id' ? q.prompt_id : q.prompt_en}
          </p>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const accent = OPTION_ACCENTS[i % OPTION_ACCENTS.length]
              const selected = myPick === opt.id
              const isKeyCorrect = currentRevealed && key === opt.id
              const isMyWrongPick = currentRevealed && selected && key !== opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => answer(opt.id)}
                  disabled={!canAnswer}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-colors ${
                    isKeyCorrect ? 'border-green-400 bg-green-50'
                      : isMyWrongPick ? 'border-red-300 bg-red-50'
                      : selected ? accent.on
                      : currentRevealed ? 'border-gray-100 bg-white opacity-60'
                      : `border-gray-200 bg-white ${canAnswer ? accent.idle : ''}`
                  } ${canAnswer ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className={`shrink-0 w-8 h-8 rounded-xl grid place-items-center text-sm font-bold text-white uppercase ${
                    isKeyCorrect ? 'bg-green-500' : isMyWrongPick ? 'bg-red-400' : accent.badge
                  }`}>
                    {sending === opt.id ? <Loader2 size={15} className="animate-spin" />
                      : isKeyCorrect ? <CheckCircle2 size={17} />
                      : isMyWrongPick ? <XCircle size={17} />
                      : opt.id}
                  </span>
                  <span className="flex-1 text-sm sm:text-base text-gray-800">
                    {lang === 'id' ? opt.label_id : opt.label_en}
                  </span>
                  {selected && !currentRevealed && (
                    <CheckCircle2 size={18} className="shrink-0 text-primary-600" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Status line */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            {currentRevealed ? (
              <p className={`text-sm font-medium flex items-center gap-1.5 ${
                iWasRight ? 'text-green-700' : myPick ? 'text-red-600' : 'text-gray-500'
              }`}>
                {iWasRight ? <><CheckCircle2 size={15} /> {t('checkpoint.you_got_it')}</>
                  : myPick ? <><XCircle size={15} /> {t('checkpoint.not_quite')}</>
                  : t('checkpoint.no_answer_recorded')}
              </p>
            ) : myAnswer ? (
              <p className="text-sm text-primary-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 size={15} /> {t('checkpoint.answer_locked')}
              </p>
            ) : locked ? (
              <p className="text-sm text-gray-500">{t('checkpoint.time_up')}</p>
            ) : (
              <p className="text-sm text-gray-500">{t('checkpoint.pick_one')}</p>
            )}
          </div>

          {!isLive && (
            <button
              onClick={onDismiss}
              className="mt-4 w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 cursor-pointer"
            >
              {t('checkpoint.done')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function CountdownRing({ seconds, pct }: { seconds: number; pct: number }) {
  const r = 13
  const c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex items-center justify-center w-9 h-9">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-white/25" />
        <circle
          cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth="3"
          strokeLinecap="round" className={seconds <= 5 ? 'text-rose-300' : 'text-white'}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 250ms linear' }}
        />
      </svg>
      <span className="text-[11px] font-bold tabular-nums">{seconds}</span>
    </span>
  )
}

// ── Idle: review list ───────────────────────────────────────────────
function ReviewList({
  checkpoints, reviewKey, lang,
}: {
  checkpoints: SessionCheckpoint[]
  reviewKey: Record<string, string>
  lang: Language
}) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [picks, setPicks] = useState<Record<string, string>>({})

  const covered = Object.keys(reviewKey).length

  return (
    <div className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Radio size={16} className="text-primary-600" />
        <span className="text-sm font-semibold text-gray-800">{t('checkpoint.section_title')}</span>
        <span className="text-xs text-gray-400">
          {checkpoints.length} {t('checkpoint.count_label')}
        </span>
        {open ? <ChevronUp size={16} className="ml-auto text-gray-400" />
          : <ChevronDown size={16} className="ml-auto text-gray-400" />}
      </button>
      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-6">
          <p className="text-xs text-gray-500">
            {covered > 0 ? t('checkpoint.review_hint') : t('checkpoint.practice_hint')}
          </p>
          {checkpoints.map(cp => (
            <div key={cp.id}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {lang === 'id' ? cp.title_id : cp.title_en}
              </p>
              <div className="space-y-4">
                {(cp.questions ?? []).map((q, i) => (
                  <ReviewQuestion
                    key={q.id}
                    q={q} index={i} total={cp.questions?.length ?? 0}
                    correctOptionId={reviewKey[q.id]}
                    pick={picks[q.id]}
                    onPick={id => setPicks(p => ({ ...p, [q.id]: id }))}
                    lang={lang}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewQuestion({
  q, index, total, correctOptionId, pick, onPick, lang,
}: {
  q: CheckpointQuestion; index: number; total: number
  correctOptionId?: string; pick?: string
  onPick: (optionId: string) => void; lang: Language
}) {
  const { t } = useTranslation('common')
  // The key is readable only for questions the mentor already revealed in
  // class, so feedback appears exactly when it is no longer a spoiler.
  const graded = !!correctOptionId && !!pick

  return (
    <div>
      <p className="text-sm font-medium text-gray-800 mb-2">
        {total > 1 && <span className="text-gray-400 mr-1">{index + 1}.</span>}
        {lang === 'id' ? q.prompt_id : q.prompt_en}
      </p>
      <div className="space-y-1.5">
        {q.options.map(opt => {
          const selected = pick === opt.id
          const isCorrect = graded && correctOptionId === opt.id
          const isWrongPick = graded && selected && correctOptionId !== opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onPick(opt.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left text-sm transition-colors cursor-pointer ${
                isCorrect ? 'border-green-400 bg-green-50 text-green-800'
                  : isWrongPick ? 'border-red-300 bg-red-50 text-red-700'
                  : selected ? 'border-primary-400 bg-primary-50 text-primary-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
              }`}
            >
              {isCorrect ? <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                : isWrongPick ? <XCircle size={15} className="text-red-500 shrink-0" />
                : selected ? <Radio size={15} className="text-primary-600 shrink-0" />
                : <Circle size={15} className="text-gray-300 shrink-0" />}
              <span>{lang === 'id' ? opt.label_id : opt.label_en}</span>
            </button>
          )
        })}
      </div>
      {pick && !correctOptionId && (
        <p className="mt-1.5 text-xs text-gray-400">{t('checkpoint.not_covered_yet')}</p>
      )}
    </div>
  )
}
