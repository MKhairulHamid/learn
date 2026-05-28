import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, CheckCircle2, MessageSquarePlus, Loader2 } from 'lucide-react'
import type { FeedbackDraft } from '../../hooks/useFeedback'
import type { SessionFeedback } from '../../types'

export interface FeedbackPanelProps {
  feedbackOpen: boolean
  submission: SessionFeedback | null
  loading: boolean
  submitting: boolean
  error: string | null
  submitFeedback: (d: FeedbackDraft) => Promise<{ error: string | null }>
}

// Thin wrapper — now just used on the session page as a fallback inline view.
// The primary UX is the modal (FeedbackModal) opened from multiple places.
export function FeedbackPanel({ feedbackOpen, submission, loading, submitting, error, submitFeedback }: FeedbackPanelProps) {
  const { t } = useTranslation('common')
  if (loading) return null
  if (!feedbackOpen) return null

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquarePlus size={16} className="text-primary-600" />
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {t('feedback.modal_title')}
        </h2>
      </div>
      {submission ? <SubmittedState /> : (
        <FeedbackForm submitting={submitting} error={error} onSubmit={submitFeedback} />
      )}
    </div>
  )
}

export function SubmittedState() {
  const { t } = useTranslation('common')
  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex items-center gap-4">
      <CheckCircle2 size={32} className="text-green-500 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-green-800">{t('feedback.submitted_title')}</p>
        <p className="text-xs text-green-600 mt-0.5">{t('feedback.submitted_desc')}</p>
      </div>
    </div>
  )
}

// ── Star rating ────────────────────────────────────────────────────────

export function StarRating({ value, onChange, label, size = 22 }: {
  value: number
  onChange: (v: number) => void
  label: string
  size?: number
}) {
  const { t } = useTranslation('common')
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  const starLabels = [
    t('feedback.star_poor'),
    t('feedback.star_fair'),
    t('feedback.star_good'),
    t('feedback.star_great'),
    t('feedback.star_excellent'),
  ]

  return (
    <div>
      <p className="text-xs text-gray-600 mb-1.5">{label}</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={size}
              className={n <= display ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-1 text-xs text-gray-400">{starLabels[value - 1]}</span>
        )}
      </div>
    </div>
  )
}

// ── Shared form ────────────────────────────────────────────────────────

const EMPTY: FeedbackDraft = {
  rating_materials: 0,
  rating_exercises: 0,
  rating_mentor_clarity: 0,
  rating_mentor_management: 0,
  rating_mentor_engagement: 0,
  rating_overall: 0,
  comment_highlight: '',
  comment_improve: '',
  comment_other: '',
}

export function FeedbackForm({ submitting, error, onSubmit }: {
  submitting: boolean
  error: string | null
  onSubmit: (d: FeedbackDraft) => Promise<{ error: string | null }>
}) {
  const { t } = useTranslation('common')
  const [draft, setDraft] = useState<FeedbackDraft>(EMPTY)
  const [validationError, setValidationError] = useState<string | null>(null)

  function setRating(key: keyof FeedbackDraft, value: number) {
    setDraft(d => ({ ...d, [key]: value }))
    setValidationError(null)
  }

  function setText(key: keyof FeedbackDraft, value: string) {
    setDraft(d => ({ ...d, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ratingFields: (keyof FeedbackDraft)[] = [
      'rating_materials', 'rating_exercises',
      'rating_mentor_clarity', 'rating_mentor_management', 'rating_mentor_engagement',
      'rating_overall',
    ]
    if (ratingFields.some(k => (draft[k] as number) === 0)) {
      setValidationError(t('feedback.validation_rate_all'))
      return
    }
    if (!draft.comment_highlight.trim()) {
      setValidationError(t('feedback.validation_highlight_required'))
      return
    }
    setValidationError(null)
    await onSubmit(draft)
  }

  const inputCls =
    'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 ' +
    'placeholder:text-gray-400 focus:outline-none focus:border-primary-400 resize-none'

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden">
      {/* Section 1: Live Session Materials */}
      <div className="pb-5 mb-5 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {t('feedback.section_materials')}
        </p>
        <p className="text-[11px] text-gray-400 mb-4">{t('feedback.section_materials_desc')}</p>
        <div className="space-y-4">
          <StarRating label={t('feedback.label_materials')}
            value={draft.rating_materials} onChange={v => setRating('rating_materials', v)} />
          <StarRating label={t('feedback.label_exercises')}
            value={draft.rating_exercises} onChange={v => setRating('rating_exercises', v)} />
        </div>
      </div>

      {/* Section 2: Mentor */}
      <div className="pb-5 mb-5 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {t('feedback.section_mentor')}
        </p>
        <p className="text-[11px] text-gray-400 mb-4">{t('feedback.section_mentor_desc')}</p>
        <div className="space-y-4">
          <StarRating label={t('feedback.label_mentor_clarity')}
            value={draft.rating_mentor_clarity} onChange={v => setRating('rating_mentor_clarity', v)} />
          <StarRating label={t('feedback.label_mentor_management')}
            value={draft.rating_mentor_management} onChange={v => setRating('rating_mentor_management', v)} />
          <StarRating label={t('feedback.label_mentor_engagement')}
            value={draft.rating_mentor_engagement} onChange={v => setRating('rating_mentor_engagement', v)} />
        </div>
      </div>

      {/* Section 3: Overall */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {t('feedback.section_overall')}
        </p>
        <p className="text-[11px] text-gray-400 mb-4">{t('feedback.section_overall_desc')}</p>
        <div className="space-y-4">
          <StarRating label={t('feedback.label_overall')}
            value={draft.rating_overall} onChange={v => setRating('rating_overall', v)} />
          <div>
            <label className="text-xs text-gray-600 mb-1.5 block">
              {t('feedback.label_highlight')} <span className="text-red-400">*</span>
            </label>
            <textarea rows={2} value={draft.comment_highlight}
              onChange={e => setText('comment_highlight', e.target.value)}
              placeholder={t('feedback.placeholder_highlight')}
              className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1.5 block">{t('feedback.label_improve')}</label>
            <textarea rows={2} value={draft.comment_improve}
              onChange={e => setText('comment_improve', e.target.value)}
              placeholder={t('feedback.placeholder_improve')}
              className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1.5 block">{t('feedback.label_other')}</label>
            <textarea rows={2} value={draft.comment_other}
              onChange={e => setText('comment_other', e.target.value)}
              placeholder={t('feedback.placeholder_other')}
              className={inputCls} />
          </div>
        </div>

        {(validationError || error) && (
          <p className="mt-3 text-xs text-red-500">{validationError ?? error}</p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 transition-colors"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {t('feedback.submit')}
          </button>
        </div>
      </div>
    </form>
  )
}
