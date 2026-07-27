import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Radio, CheckCircle2, XCircle, ChevronDown, ChevronUp, Circle } from 'lucide-react'
import { useLiveCheckpoints } from '../../hooks/useCheckpoints'
import type { CheckpointQuestion, Language, SessionCheckpoint } from '../../types'

/**
 * Student-facing live checkpoint panel.
 *  - When the mentor has a checkpoint OPEN, answers are recorded live and, once
 *    the mentor reveals, the correct option is shown.
 *  - Otherwise the checkpoints are a local practice preview only — selections
 *    are never sent to the server.
 */
export function LiveCheckpointPanel({
  sessionId, cohortId, lang,
}: { sessionId: string; cohortId: string | null; lang: Language }) {
  const { t } = useTranslation('common')
  const {
    checkpoints, loading, openActivation, activeCheckpoint,
    myResponses, revealed, revealedKey, submitAnswer,
  } = useLiveCheckpoints(sessionId, cohortId)

  if (loading || checkpoints.length === 0) return null

  const pick = (q: CheckpointQuestion) => (lang === 'id' ? q.prompt_id : q.prompt_en)
  const title = (cp: SessionCheckpoint) => (lang === 'id' ? cp.title_id : cp.title_en)

  // ── Live mode: the mentor has opened a checkpoint ──────────────────
  if (openActivation && activeCheckpoint) {
    return (
      <div className="mb-8 rounded-2xl border-2 border-primary-300 bg-primary-50/60 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="text-sm font-semibold">{t('checkpoint.live_now')}</span>
          <span className="ml-auto text-xs text-primary-100">{title(activeCheckpoint)}</span>
        </div>
        <div className="p-5 space-y-6">
          {(activeCheckpoint.questions ?? []).map((q, i) => {
            const mine = myResponses.find(r => r.question_id === q.id)
            return (
              <div key={q.id}>
                <p className="text-sm font-semibold text-gray-900 mb-2.5">
                  {activeCheckpoint.questions!.length > 1 && (
                    <span className="text-primary-600 mr-1">{i + 1}.</span>
                  )}
                  {pick(q)}
                </p>
                <div className="space-y-2">
                  {q.options.map(opt => {
                    const selected = mine?.selected_option_id === opt.id
                    const isKeyCorrect = revealed && revealedKey[q.id] === opt.id
                    const isKeyWrongPick = revealed && selected && revealedKey[q.id] !== opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => !revealed && submitAnswer(q.id, opt.id)}
                        disabled={revealed}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left text-sm transition-colors ${
                          isKeyCorrect
                            ? 'border-green-400 bg-green-50 text-green-800'
                            : isKeyWrongPick
                              ? 'border-red-300 bg-red-50 text-red-700'
                              : selected
                                ? 'border-primary-500 bg-white text-primary-800 ring-1 ring-primary-300'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                        } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {isKeyCorrect ? <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                          : isKeyWrongPick ? <XCircle size={16} className="text-red-500 shrink-0" />
                          : selected ? <Radio size={16} className="text-primary-600 shrink-0" />
                          : <Circle size={16} className="text-gray-300 shrink-0" />}
                        <span>{lang === 'id' ? opt.label_id : opt.label_en}</span>
                      </button>
                    )
                  })}
                </div>
                {mine && !revealed && (
                  <p className="mt-1.5 text-xs text-primary-600 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {t('checkpoint.answer_recorded')}
                  </p>
                )}
              </div>
            )
          })}
          <p className="text-xs text-gray-500 pt-1 border-t border-primary-100">
            {revealed ? t('checkpoint.revealed_hint') : t('checkpoint.live_hint')}
          </p>
        </div>
      </div>
    )
  }

  // ── Idle mode: practice preview (never recorded) ───────────────────
  return <SelfCheckList checkpoints={checkpoints} lang={lang} />
}

function SelfCheckList({ checkpoints, lang }: { checkpoints: SessionCheckpoint[]; lang: Language }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const [picks, setPicks] = useState<Record<string, string>>({})

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
          <p className="text-xs text-gray-500">{t('checkpoint.practice_hint')}</p>
          {checkpoints.map(cp => (
            <div key={cp.id}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {lang === 'id' ? cp.title_id : cp.title_en}
              </p>
              <div className="space-y-4">
                {(cp.questions ?? []).map((q, i) => (
                  <div key={q.id}>
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      {(cp.questions?.length ?? 0) > 1 && <span className="text-gray-400 mr-1">{i + 1}.</span>}
                      {lang === 'id' ? q.prompt_id : q.prompt_en}
                    </p>
                    <div className="space-y-1.5">
                      {q.options.map(opt => {
                        const selected = picks[q.id] === opt.id
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setPicks(p => ({ ...p, [q.id]: opt.id }))}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left text-sm transition-colors cursor-pointer ${
                              selected
                                ? 'border-primary-400 bg-primary-50 text-primary-800'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                            }`}
                          >
                            {selected ? <Radio size={15} className="text-primary-600 shrink-0" />
                              : <Circle size={15} className="text-gray-300 shrink-0" />}
                            <span>{lang === 'id' ? opt.label_id : opt.label_en}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
