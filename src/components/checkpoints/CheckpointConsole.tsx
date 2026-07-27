import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, Play, Eye, Square, CheckCircle2, Users, Loader2, BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useCheckpointConsole, useCheckpointSummary, tallyQuestion } from '../../hooks/useCheckpoints'
import type { Language } from '../../types'

/**
 * Mentor-facing live console for one session. The mentor picks the cohort they
 * are teaching, opens a checkpoint (which lets students answer), watches the
 * answered count climb, then Reveals the distribution and Closes.
 */
export function CheckpointConsole({
  sessionId, programId, lang,
}: { sessionId: string; programId: string | null; lang: Language }) {
  const { t } = useTranslation('common')
  const [cohorts, setCohorts] = useState<{ id: string; name: string }[]>([])
  const [cohortId, setCohortId] = useState<string | null>(null)

  useEffect(() => {
    if (!programId) return
    supabase
      .from('cohorts')
      .select('id, name')
      .eq('program_id', programId)
      .eq('is_published', true)
      .order('course_start_at', { ascending: false })
      .then(({ data }) => {
        const rows = (data as { id: string; name: string }[] | null) ?? []
        setCohorts(rows)
        setCohortId(prev => prev ?? rows[0]?.id ?? null)
      })
  }, [programId])

  const {
    checkpoints, answerKeys, currentActivation, currentCheckpoint,
    responses, memberCount, loading, openCheckpoint, reveal, close,
  } = useCheckpointConsole(cohortId, sessionId)

  const [busy, setBusy] = useState(false)
  const run = async (fn: () => Promise<{ error?: string }>) => {
    setBusy(true); await fn(); setBusy(false)
  }

  const summary = useCheckpointSummary(cohortId, sessionId)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const cpTitle = (id: string) => {
    const cp = checkpoints.find(c => c.id === id)
    return cp ? (lang === 'id' ? cp.title_id : cp.title_en) : id
  }

  if (!loading && checkpoints.length === 0) return null

  const isOpen = currentActivation?.status === 'open'
  const isRevealed = !!currentActivation?.revealed_at
  // Answered = distinct students who answered any question in the current activation.
  const answeredStudents = new Set(responses.map(r => r.user_id)).size

  return (
    <div className="mb-8 rounded-2xl border border-violet-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white flex-wrap">
        <Radio size={16} />
        <span className="text-sm font-semibold">{t('checkpoint.console_title')}</span>
        <div className="ml-auto flex items-center gap-2">
          <Users size={13} className="text-violet-200" />
          <select
            value={cohortId ?? ''}
            onChange={e => setCohortId(e.target.value)}
            className="text-xs rounded-lg bg-violet-700 text-white border border-violet-400/50 px-2 py-1 max-w-[16rem] cursor-pointer"
          >
            {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Checkpoint list */}
        <div className="grid gap-2 sm:grid-cols-2">
          {checkpoints.map(cp => {
            const isCurrent = currentCheckpoint?.id === cp.id
            return (
              <button
                key={cp.id}
                disabled={busy || (isCurrent && isOpen)}
                onClick={() => run(() => openCheckpoint(cp.id))}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-left text-sm transition-colors ${
                  isCurrent
                    ? 'border-violet-400 bg-violet-50 text-violet-800'
                    : 'border-gray-200 hover:border-violet-300 text-gray-700 cursor-pointer'
                } ${busy ? 'opacity-60' : ''}`}
              >
                <Play size={14} className="shrink-0 text-violet-600" />
                <span className="flex-1 min-w-0 truncate">{lang === 'id' ? cp.title_id : cp.title_en}</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {(cp.questions?.length ?? 0)}Q
                </span>
                {isCurrent && isOpen && (
                  <span className="text-[10px] font-semibold text-green-600 uppercase">{t('checkpoint.live_tag')}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Current activation control + results */}
        {currentActivation && currentCheckpoint && (
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">
                {lang === 'id' ? currentCheckpoint.title_id : currentCheckpoint.title_en}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isOpen ? 'bg-green-50 text-green-700 border border-green-200'
                       : 'bg-gray-100 text-gray-500'
              }`}>
                {isOpen ? t('checkpoint.status_open') : t('checkpoint.status_closed')}
              </span>
              <span className="ml-auto flex items-center gap-1.5 text-sm text-gray-600">
                <Users size={14} className="text-gray-400" />
                <span className="font-semibold text-gray-900">{answeredStudents}</span>
                {t('checkpoint.of')} {memberCount} {t('checkpoint.answered')}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              {isOpen && !isRevealed && (
                <button
                  disabled={busy}
                  onClick={() => run(reveal)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors cursor-pointer disabled:opacity-60"
                >
                  {busy ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                  {t('checkpoint.reveal')}
                </button>
              )}
              {isOpen && (
                <button
                  disabled={busy}
                  onClick={() => run(close)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Square size={14} /> {t('checkpoint.close')}
                </button>
              )}
            </div>

            {/* Results — hidden until reveal (or after close) */}
            {(isRevealed || !isOpen) ? (
              <div className="mt-4 space-y-5">
                {(currentCheckpoint.questions ?? []).map((q, i) => {
                  const key = answerKeys[q.id]
                  const { counts, answered, correct } = tallyQuestion(q, responses, key)
                  return (
                    <div key={q.id}>
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        {(currentCheckpoint.questions?.length ?? 0) > 1 && (
                          <span className="text-violet-600 mr-1">{i + 1}.</span>
                        )}
                        {lang === 'id' ? q.prompt_id : q.prompt_en}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map(opt => {
                          const n = counts[opt.id] ?? 0
                          const pct = answered ? Math.round((n / answered) * 100) : 0
                          const isCorrect = key === opt.id
                          return (
                            <div key={opt.id} className="flex items-center gap-2">
                              <div className="flex-1 h-7 rounded-lg bg-gray-100 overflow-hidden relative">
                                <div
                                  className={`h-full ${isCorrect ? 'bg-green-400/70' : 'bg-violet-300/70'}`}
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
                      {key && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          {t('checkpoint.correct_rate')}: <span className="font-semibold text-green-600">
                            {answered ? Math.round((correct / answered) * 100) : 0}%
                          </span> ({correct}/{answered})
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 text-xs text-gray-500">{t('checkpoint.hidden_until_reveal')}</p>
            )}
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
  )
}
