import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Radio, Play, MonitorPlay, Users, Loader2, BarChart3, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Minus, Timer, AlertTriangle,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useCheckpointConsole, useCheckpointSummary, tallyQuestion } from '../../hooks/useCheckpoints'
import { CheckpointPresenter } from './CheckpointPresenter'
import type { CheckpointQuestion, CheckpointResponse, Language } from '../../types'

const TIME_LIMITS = [0, 20, 30, 45, 60, 90]
const cohortPrefKey = (programId: string | null) => `ckpt:cohort:${programId ?? 'none'}`
const limitPrefKey = 'ckpt:timeLimit'

/**
 * Mentor-facing console for one session: pick the cohort being taught, start
 * presenting, and read the room.
 *
 * This surface is the mentor's own screen — not the one they share — so it
 * shows the live per-option breakdown and the per-learner grid while the
 * question is still running. The shared surface is CheckpointPresenter.
 */
export function CheckpointConsole({
  sessionId, programId, lang,
}: { sessionId: string; programId: string | null; lang: Language }) {
  const { t } = useTranslation('common')
  const [cohorts, setCohorts] = useState<{ id: string; name: string }[]>([])
  const [cohortId, setCohortId] = useState<string | null>(null)
  const [presenting, setPresenting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [timeLimit, setTimeLimit] = useState<number>(() => {
    const saved = Number(localStorage.getItem(limitPrefKey))
    return TIME_LIMITS.includes(saved) ? saved : 30
  })

  // Cohorts for this program, defaulting to the one actually being taught
  // today (by lesson schedule), then the mentor's last choice.
  useEffect(() => {
    if (!programId) return
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('cohorts')
        .select('id, name')
        .eq('program_id', programId)
        .eq('is_published', true)
        .order('course_start_at', { ascending: false })
      const rows = (data as { id: string; name: string }[] | null) ?? []
      if (cancelled) return
      setCohorts(rows)

      const today = new Date().toISOString().slice(0, 10)
      const { data: sched } = await supabase
        .from('cohort_lesson_schedule')
        .select('cohort_id')
        .eq('session_id', sessionId)
        .eq('scheduled_date', today)
      const scheduledToday = (sched as { cohort_id: string }[] | null)?.[0]?.cohort_id
      const remembered = localStorage.getItem(cohortPrefKey(programId))
      const valid = (id?: string | null) => !!id && rows.some(r => r.id === id)

      if (cancelled) return
      setCohortId(prev => prev
        ?? (valid(scheduledToday) ? scheduledToday!
          : valid(remembered) ? remembered!
          : rows[0]?.id ?? null))
    })()
    return () => { cancelled = true }
  }, [programId, sessionId])

  const pickCohort = (id: string) => {
    setCohortId(id)
    localStorage.setItem(cohortPrefKey(programId), id)
  }

  const con = useCheckpointConsole(cohortId, sessionId)
  const summary = useCheckpointSummary(cohortId, sessionId)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const {
    checkpoints, answerKeys, currentActivation: act, currentCheckpoint: cp,
    questions, currentQuestion, currentIndex, currentRevealed, secondsLeft,
    responses, roster, memberCount, presentCount, loading,
  } = con

  const cohortName = cohorts.find(c => c.id === cohortId)?.name ?? null
  const isOpen = act?.status === 'open'

  const start = async (checkpointId: string) => {
    setBusy(true)
    const res = await con.openCheckpoint(checkpointId, timeLimit)
    setBusy(false)
    if (res.error) { alert(res.error); return }
    setPresenting(true)
  }

  const cpTitle = (id: string) => {
    const c = checkpoints.find(x => x.id === id)
    return c ? (lang === 'id' ? c.title_id : c.title_en) : id
  }

  if (!loading && checkpoints.length === 0) return null

  const answeredStudents = new Set(responses.map(r => r.user_id)).size
  const denominator = presentCount || memberCount

  return (
    <>
      {presenting && act && cp && currentQuestion && (
        <CheckpointPresenter
          con={con} lang={lang} cohortName={cohortName}
          onExit={() => setPresenting(false)}
        />
      )}

      <div className="mb-8 rounded-2xl border border-violet-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white flex-wrap">
          <Radio size={16} />
          <span className="text-sm font-semibold">{t('checkpoint.console_title')}</span>
          <div className="ml-auto flex items-center gap-2">
            <Users size={13} className="text-violet-200" />
            <select
              value={cohortId ?? ''}
              onChange={e => pickCohort(e.target.value)}
              className="text-xs rounded-lg bg-violet-700 text-white border border-violet-400/50 px-2 py-1 max-w-[16rem] cursor-pointer"
            >
              {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Timer preference for the next checkpoint opened */}
          <div className="flex items-center gap-2 flex-wrap">
            <Timer size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">{t('checkpoint.time_per_question')}</span>
            <select
              value={timeLimit}
              onChange={e => {
                const v = Number(e.target.value)
                setTimeLimit(v); localStorage.setItem(limitPrefKey, String(v))
              }}
              className="text-xs rounded-lg border border-gray-200 px-2 py-1 cursor-pointer"
            >
              {TIME_LIMITS.map(s => (
                <option key={s} value={s}>
                  {s === 0 ? t('checkpoint.no_timer') : `${s}s`}
                </option>
              ))}
            </select>
            {isOpen && (
              <button
                onClick={() => setPresenting(true)}
                className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
              >
                <MonitorPlay size={15} /> {t('checkpoint.resume_presenting')}
              </button>
            )}
          </div>

          {/* Checkpoint list */}
          <div className="grid gap-2 sm:grid-cols-2">
            {checkpoints.map(c => {
              const isCurrent = cp?.id === c.id
              const count = c.questions?.length ?? 0
              return (
                <button
                  key={c.id}
                  disabled={busy || count === 0}
                  onClick={() => start(c.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-left text-sm transition-colors ${
                    isCurrent && isOpen
                      ? 'border-violet-400 bg-violet-50 text-violet-800'
                      : 'border-gray-200 hover:border-violet-300 text-gray-700'
                  } ${busy || count === 0 ? 'opacity-60' : 'cursor-pointer'}`}
                  title={count === 0 ? t('checkpoint.no_questions') : t('checkpoint.start_presenting')}
                >
                  <Play size={14} className="shrink-0 text-violet-600" />
                  <span className="flex-1 min-w-0 truncate">{lang === 'id' ? c.title_id : c.title_en}</span>
                  <span className="text-xs text-gray-400 shrink-0">{count}Q</span>
                  {isCurrent && isOpen && (
                    <span className="text-[10px] font-semibold text-green-600 uppercase">{t('checkpoint.live_tag')}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Live read of the room — mentor's own screen, so counts show now */}
          {act && cp && (
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">
                  {lang === 'id' ? cp.title_id : cp.title_en}
                </span>
                {questions.length > 1 && currentIndex >= 0 && (
                  <span className="text-xs text-gray-500">
                    {t('checkpoint.question_n_of_m', { n: currentIndex + 1, m: questions.length })}
                  </span>
                )}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOpen ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'
                }`}>
                  {isOpen ? t('checkpoint.status_open') : t('checkpoint.status_closed')}
                </span>
                {secondsLeft !== null && isOpen && (
                  <span className="text-xs font-semibold text-gray-700 tabular-nums flex items-center gap-1">
                    <Timer size={13} className="text-gray-400" />{secondsLeft}s
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1.5 text-sm text-gray-600">
                  <Users size={14} className="text-gray-400" />
                  <span className="font-semibold text-gray-900">{answeredStudents}</span>
                  {t('checkpoint.of')} {denominator} {t('checkpoint.answered')}
                  {presentCount > 0 && (
                    <span className="text-xs text-gray-400">({t('checkpoint.present')})</span>
                  )}
                </span>
              </div>

              <div className="mt-4 space-y-5">
                {questions.map((q, i) => (
                  <QuestionTally
                    key={q.id}
                    q={q} index={i} total={questions.length}
                    responses={responses}
                    correctOptionId={answerKeys[q.id]}
                    isCurrent={q.id === act.current_question_id}
                    revealed={(act.revealed_question_ids ?? []).includes(q.id)}
                    lang={lang}
                  />
                ))}
              </div>

              <LearnerGrid
                questions={questions} responses={responses} roster={roster}
                answerKeys={answerKeys} revealedOnly={!currentRevealed && isOpen}
              />
            </div>
          )}

          {/* Post-session summary — correct-rate per checkpoint across all runs */}
          <div className="rounded-xl border border-gray-200">
            <button
              onClick={() => { const next = !summaryOpen; setSummaryOpen(next); if (next) summary.load() }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-left cursor-pointer"
            >
              <BarChart3 size={15} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t('checkpoint.summary_title')}</span>
              {summaryOpen ? <ChevronUp size={15} className="ml-auto text-gray-400" />
                : <ChevronDown size={15} className="ml-auto text-gray-400" />}
            </button>
            {summaryOpen && (
              <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                {summary.loading ? (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5"><Loader2 size={13} className="animate-spin" /> …</p>
                ) : summary.rows.length === 0 ? (
                  <p className="text-xs text-gray-400">{t('checkpoint.summary_empty')}</p>
                ) : summary.rows.map(r => (
                  <div key={r.checkpointId} className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 flex-1 min-w-0 truncate">{cpTitle(r.checkpointId)}</span>
                    <div className="w-28 h-2 rounded-full bg-gray-100 overflow-hidden shrink-0">
                      <div className="h-full bg-green-400" style={{ width: `${r.correctRate}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-24 text-right shrink-0">
                      {r.correctRate}% · {r.answered} {t('checkpoint.answered')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/** Live distribution for one question, with the key marked for the mentor. */
function QuestionTally({
  q, index, total, responses, correctOptionId, isCurrent, revealed, lang,
}: {
  q: CheckpointQuestion; index: number; total: number
  responses: CheckpointResponse[]; correctOptionId?: string
  isCurrent: boolean; revealed: boolean; lang: Language
}) {
  const { t } = useTranslation('common')
  const { counts, answered, correct } = tallyQuestion(q, responses, correctOptionId)

  return (
    <div className={isCurrent ? '' : 'opacity-70'}>
      <p className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
        {total > 1 && <span className="text-violet-600">{index + 1}.</span>}
        <span className="flex-1">{lang === 'id' ? q.prompt_id : q.prompt_en}</span>
        {isCurrent && (
          <span className="text-[10px] font-semibold uppercase text-green-600 shrink-0">
            {t('checkpoint.live_tag')}
          </span>
        )}
        {revealed && (
          <span className="text-[10px] font-semibold uppercase text-gray-400 shrink-0">
            {t('checkpoint.revealed_tag')}
          </span>
        )}
      </p>
      <div className="space-y-1.5">
        {q.options.map(opt => {
          const n = counts[opt.id] ?? 0
          const pct = answered ? Math.round((n / answered) * 100) : 0
          const isCorrect = correctOptionId === opt.id
          return (
            <div key={opt.id} className="flex items-center gap-2">
              <div className="flex-1 h-7 rounded-lg bg-gray-100 overflow-hidden relative">
                <div
                  className={`h-full transition-[width] duration-500 ${isCorrect ? 'bg-green-400/70' : 'bg-violet-300/70'}`}
                  style={{ width: `${pct}%` }}
                />
                <span className="absolute inset-0 flex items-center gap-1.5 px-2.5 text-xs text-gray-700">
                  {isCorrect && <CheckCircle2 size={12} className="text-green-600" />}
                  {lang === 'id' ? opt.label_id : opt.label_en}
                </span>
              </div>
              <span className="text-xs text-gray-500 w-14 text-right shrink-0">{n} · {pct}%</span>
            </div>
          )
        })}
      </div>
      {correctOptionId && answered > 0 && (
        <p className="mt-1.5 text-xs text-gray-500">
          {t('checkpoint.correct_rate')}: <span className={`font-semibold ${
            correct / answered >= 0.7 ? 'text-green-600' : 'text-amber-600'
          }`}>
            {Math.round((correct / answered) * 100)}%
          </span> ({correct}/{answered})
        </p>
      )}
    </div>
  )
}

/**
 * Who understood what — the half 035 was missing. One row per learner, one
 * column per question, so the mentor can name who needs a follow-up rather
 * than only knowing that "38% got it wrong".
 */
function LearnerGrid({
  questions, responses, roster, answerKeys, revealedOnly,
}: {
  questions: CheckpointQuestion[]
  responses: CheckpointResponse[]
  roster: { user_id: string; display_name: string }[]
  answerKeys: Record<string, string>
  revealedOnly: boolean
}) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  const rows = useMemo(() => {
    const byUser = new Map<string, Map<string, CheckpointResponse>>()
    for (const r of responses) {
      const m = byUser.get(r.user_id) ?? new Map()
      m.set(r.question_id, r)
      byUser.set(r.user_id, m)
    }
    // Anyone who answered but is not on the roster still deserves a row.
    const names = new Map(roster.map(r => [r.user_id, r.display_name]))
    const ids = new Set([...roster.map(r => r.user_id), ...byUser.keys()])
    return [...ids].map(id => {
      const answers = byUser.get(id) ?? new Map<string, CheckpointResponse>()
      const wrong = questions.filter(q => {
        const a = answers.get(q.id)
        const key = answerKeys[q.id]
        return a && key && a.selected_option_id !== key
      }).length
      return {
        id,
        name: names.get(id) ?? t('checkpoint.unknown_learner'),
        answers,
        wrong,
        answered: answers.size,
      }
    }).sort((a, b) => b.wrong - a.wrong || a.name.localeCompare(b.name))
  }, [questions, responses, roster, answerKeys, t])

  if (responses.length === 0) return null
  const struggling = rows.filter(r => r.wrong > 0).length

  return (
    <div className="mt-5 border-t border-gray-100 pt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 text-left cursor-pointer"
      >
        <Users size={14} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{t('checkpoint.by_learner')}</span>
        {struggling > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            <AlertTriangle size={11} /> {t('checkpoint.needs_followup', { count: struggling })}
          </span>
        )}
        {open ? <ChevronUp size={15} className="ml-auto text-gray-400" />
          : <ChevronDown size={15} className="ml-auto text-gray-400" />}
      </button>

      {open && (
        <div className="mt-2 overflow-x-auto">
          {revealedOnly && (
            <p className="text-xs text-gray-400 mb-2">{t('checkpoint.grid_live_hint')}</p>
          )}
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-xs text-gray-400">
                <th className="text-left font-medium pb-1">{t('checkpoint.learner')}</th>
                {questions.map((_, i) => (
                  <th key={i} className="w-10 font-medium pb-1">Q{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td className="text-gray-700 pr-3 max-w-[14rem] truncate">{row.name}</td>
                  {questions.map(q => {
                    const a = row.answers.get(q.id)
                    const key = answerKeys[q.id]
                    const correct = a && key ? a.selected_option_id === key : null
                    return (
                      <td key={q.id} className="text-center">
                        {!a ? <Minus size={14} className="inline text-gray-300" />
                          : correct ? <CheckCircle2 size={15} className="inline text-green-500" />
                          : <XCircle size={15} className="inline text-red-400" />}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
