import { useState } from 'react'
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

export function FeedbackPanel({ feedbackOpen, submission, loading, submitting, error, submitFeedback }: FeedbackPanelProps) {
  if (loading) return null
  if (!feedbackOpen) return null

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquarePlus size={16} className="text-primary-600" />
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Session Feedback
        </h2>
      </div>

      {submission ? (
        <SubmittedState />
      ) : (
        <FeedbackForm
          submitting={submitting}
          error={error}
          onSubmit={submitFeedback}
        />
      )}
    </div>
  )
}

function SubmittedState() {
  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex items-center gap-4">
      <CheckCircle2 size={32} className="text-green-500 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-green-800">Thanks for your feedback!</p>
        <p className="text-xs text-green-600 mt-0.5">
          Your response has been recorded. It helps us improve future sessions.
        </p>
      </div>
    </div>
  )
}

// ── Star rating input ──────────────────────────────────────────────────

function StarRating({ value, onChange, label }: {
  value: number
  onChange: (v: number) => void
  label: string
}) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

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
              size={22}
              className={n <= display ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-1 text-xs text-gray-400">{STAR_LABELS[value - 1]}</span>
        )}
      </div>
    </div>
  )
}

const STAR_LABELS = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']

// ── Form ───────────────────────────────────────────────────────────────

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

function FeedbackForm({ submitting, error, onSubmit }: {
  submitting: boolean
  error: string | null
  onSubmit: (d: FeedbackDraft) => Promise<{ error: string | null }>
}) {
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
      setValidationError('Please rate all categories before submitting.')
      return
    }
    if (!draft.comment_highlight.trim()) {
      setValidationError('Please share what was most valuable about the session.')
      return
    }
    setValidationError(null)
    await onSubmit(draft)
  }

  const inputCls =
    'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-800 ' +
    'placeholder:text-gray-400 focus:outline-none focus:border-primary-400 resize-none'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section 1: Materials */}
      <div className="p-5 border-b border-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Session Materials
        </p>
        <div className="space-y-4">
          <StarRating
            label="How would you rate the quality of the session content?"
            value={draft.rating_materials}
            onChange={v => setRating('rating_materials', v)}
          />
          <StarRating
            label="How useful were the exercises and activities?"
            value={draft.rating_exercises}
            onChange={v => setRating('rating_exercises', v)}
          />
        </div>
      </div>

      {/* Section 2: Mentor */}
      <div className="p-5 border-b border-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Mentor
        </p>
        <div className="space-y-4">
          <StarRating
            label="How clearly did the mentor explain the concepts?"
            value={draft.rating_mentor_clarity}
            onChange={v => setRating('rating_mentor_clarity', v)}
          />
          <StarRating
            label="How well did the mentor manage the class and pacing?"
            value={draft.rating_mentor_management}
            onChange={v => setRating('rating_mentor_management', v)}
          />
          <StarRating
            label="How responsive was the mentor to questions?"
            value={draft.rating_mentor_engagement}
            onChange={v => setRating('rating_mentor_engagement', v)}
          />
        </div>
      </div>

      {/* Section 3: Overall */}
      <div className="p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Overall
        </p>
        <div className="space-y-4">
          <StarRating
            label="Overall, how satisfied are you with this session?"
            value={draft.rating_overall}
            onChange={v => setRating('rating_overall', v)}
          />

          <div>
            <label className="text-xs text-gray-600 mb-1.5 block">
              What was the most valuable part of this session? <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={2}
              value={draft.comment_highlight}
              onChange={e => setText('comment_highlight', e.target.value)}
              placeholder="What stood out to you? What will you apply?"
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1.5 block">
              What could be improved?
            </label>
            <textarea
              rows={2}
              value={draft.comment_improve}
              onChange={e => setText('comment_improve', e.target.value)}
              placeholder="Pace, content depth, exercises, delivery…"
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1.5 block">
              Any other comments?
            </label>
            <textarea
              rows={2}
              value={draft.comment_other}
              onChange={e => setText('comment_other', e.target.value)}
              placeholder="Anything else you'd like to share…"
              className={inputCls}
            />
          </div>
        </div>

        {(validationError || error) && (
          <p className="mt-3 text-xs text-red-500">
            {validationError ?? error}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 transition-colors"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            Submit Feedback
          </button>
        </div>
      </div>
    </form>
  )
}
