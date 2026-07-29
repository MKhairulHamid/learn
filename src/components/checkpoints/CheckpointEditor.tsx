import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Pencil, Plus, Trash2, ChevronDown, ChevronUp, Save, X, CheckCircle2,
} from 'lucide-react'
import { useCheckpointEditor, validateDraft } from '../../hooks/useCheckpoints'
import type { QuestionDraft } from '../../hooks/useCheckpoints'
import type { CheckpointQuestion, SessionCheckpoint } from '../../types'

const OPTION_IDS = ['a', 'b', 'c', 'd', 'e']
const MAX_QUESTIONS = 3   // matches the order_num check constraint

/** First unused slot in 1..3, so deleting a middle question doesn't collide. */
function nextFreeOrder(questions: CheckpointQuestion[]): number {
  const taken = new Set(questions.map(q => q.order_num))
  for (let i = 1; i <= MAX_QUESTIONS; i++) if (!taken.has(i)) return i
  return MAX_QUESTIONS
}

function blankDraft(order_num: number): QuestionDraft {
  return {
    order_num,
    prompt_id: '', prompt_en: '',
    options: [
      { id: 'a', label_id: '', label_en: '' },
      { id: 'b', label_id: '', label_en: '' },
    ],
    correct_option_id: 'a',
  }
}

/** Editor-only panel to author checkpoints & MCQs for a session. */
export function CheckpointEditor({ sessionId }: { sessionId: string }) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  const ed = useCheckpointEditor(sessionId)

  return (
    <div className="mb-8 rounded-2xl border border-amber-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-5 py-3.5 text-left hover:bg-amber-50/50 transition-colors cursor-pointer"
      >
        <Pencil size={16} className="text-amber-600" />
        <span className="text-sm font-semibold text-gray-800">{t('checkpoint.editor_title')}</span>
        <span className="text-xs text-gray-400">{ed.checkpoints.length} {t('checkpoint.count_label')}</span>
        {open ? <ChevronUp size={16} className="ml-auto text-gray-400" />
          : <ChevronDown size={16} className="ml-auto text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          {ed.checkpoints.map(cp => (
            <CheckpointBlock key={cp.id} cp={cp} ed={ed} />
          ))}
          <button
            onClick={() => ed.createCheckpoint()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            <Plus size={15} /> {t('checkpoint.add_checkpoint')}
          </button>
        </div>
      )}
    </div>
  )
}

function CheckpointBlock({
  cp, ed,
}: { cp: SessionCheckpoint; ed: ReturnType<typeof useCheckpointEditor> }) {
  const { t } = useTranslation('common')
  const [titleEn, setTitleEn] = useState(cp.title_en)
  const [titleId, setTitleId] = useState(cp.title_id)
  const [adding, setAdding] = useState(false)
  const questions = cp.questions ?? []
  const canAdd = questions.length < MAX_QUESTIONS

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={titleEn} onChange={e => setTitleEn(e.target.value)}
          onBlur={() => titleEn !== cp.title_en && ed.updateCheckpoint(cp.id, { title_en: titleEn })}
          className="text-sm font-semibold border border-gray-200 rounded-lg px-2.5 py-1.5 flex-1 min-w-[10rem]"
          placeholder="Title (EN)"
        />
        <input
          value={titleId} onChange={e => setTitleId(e.target.value)}
          onBlur={() => titleId !== cp.title_id && ed.updateCheckpoint(cp.id, { title_id: titleId })}
          className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 flex-1 min-w-[10rem]"
          placeholder="Judul (ID)"
        />
        <button
          onClick={() => confirm(t('checkpoint.confirm_delete_cp')) && ed.deleteCheckpoint(cp.id)}
          className="text-gray-400 hover:text-red-500 cursor-pointer p-1"
          title={t('checkpoint.delete')}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {questions.map(q => (
          <QuestionForm
            key={q.id}
            checkpointId={cp.id}
            ed={ed}
            initial={{
              id: q.id, order_num: q.order_num,
              prompt_id: q.prompt_id, prompt_en: q.prompt_en,
              options: q.options.map(o => ({ ...o })),
              correct_option_id: ed.keys[q.id] ?? 'a',
            }}
          />
        ))}

        {adding && (
          <QuestionForm
            checkpointId={cp.id}
            ed={ed}
            initial={blankDraft(nextFreeOrder(questions))}
            onDone={() => setAdding(false)}
          />
        )}

        {canAdd && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 cursor-pointer"
          >
            <Plus size={14} /> {t('checkpoint.add_question')}
          </button>
        )}
      </div>
    </div>
  )
}

function QuestionForm({
  checkpointId, ed, initial, onDone,
}: {
  checkpointId: string
  ed: ReturnType<typeof useCheckpointEditor>
  initial: QuestionDraft
  onDone?: () => void
}) {
  const { t } = useTranslation('common')
  const [d, setD] = useState<QuestionDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const isNew = !initial.id

  const setOpt = (i: number, patch: Partial<QuestionDraft['options'][number]>) =>
    setD(prev => ({ ...prev, options: prev.options.map((o, j) => j === i ? { ...o, ...patch } : o) }))

  const addOption = () => setD(prev => prev.options.length >= 5 ? prev : ({
    ...prev,
    options: [...prev.options, { id: OPTION_IDS[prev.options.length], label_id: '', label_en: '' }],
  }))

  const removeOption = (i: number) => setD(prev => {
    if (prev.options.length <= 2) return prev
    const kept = prev.options.filter((_, j) => j !== i).map((o, j) => ({ ...o, id: OPTION_IDS[j] }))
    const correct = kept.some(o => o.id === prev.correct_option_id) ? prev.correct_option_id : kept[0].id
    return { ...prev, options: kept, correct_option_id: correct }
  })

  const save = async () => {
    const problems = validateDraft(d)
    setErrors(problems)
    if (problems.length > 0) return
    setSaving(true)
    const res = await ed.saveQuestion(checkpointId, d)
    setSaving(false)
    if (res.error) { setErrors([res.error]); return }
    if (isNew) onDone?.()
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2">
      <input
        value={d.prompt_en} onChange={e => setD({ ...d, prompt_en: e.target.value })}
        className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5" placeholder="Question (EN)"
      />
      <input
        value={d.prompt_id} onChange={e => setD({ ...d, prompt_id: e.target.value })}
        className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5" placeholder="Pertanyaan (ID)"
      />
      <div className="space-y-1.5">
        {d.options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setD({ ...d, correct_option_id: o.id })}
              title={t('checkpoint.mark_correct')}
              className={`shrink-0 cursor-pointer ${d.correct_option_id === o.id ? 'text-green-600' : 'text-gray-300 hover:text-green-500'}`}
            >
              <CheckCircle2 size={17} />
            </button>
            <span className="text-xs font-semibold text-gray-400 w-4 shrink-0 uppercase">{o.id}</span>
            <input
              value={o.label_en} onChange={e => setOpt(i, { label_en: e.target.value })}
              className="flex-1 min-w-0 text-sm border border-gray-200 rounded px-2 py-1" placeholder="Option (EN)"
            />
            <input
              value={o.label_id} onChange={e => setOpt(i, { label_id: e.target.value })}
              className="flex-1 min-w-0 text-sm border border-gray-200 rounded px-2 py-1" placeholder="Opsi (ID)"
            />
            {d.options.length > 2 && (
              <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      {errors.length > 0 && (
        <ul className="text-xs text-red-600 space-y-0.5 pt-0.5">
          {errors.map(e => <li key={e}>· {t(e, { defaultValue: e })}</li>)}
        </ul>
      )}
      <div className="flex items-center gap-3 pt-1">
        {d.options.length < 5 && (
          <button onClick={addOption} className="text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer inline-flex items-center gap-1">
            <Plus size={13} /> {t('checkpoint.add_option')}
          </button>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white cursor-pointer disabled:opacity-60"
        >
          <Save size={13} /> {t('checkpoint.save')}
        </button>
        {initial.id && (
          <button
            onClick={() => confirm(t('checkpoint.confirm_delete_q')) && ed.deleteQuestion(initial.id!)}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        )}
        {isNew && (
          <button onClick={onDone} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
