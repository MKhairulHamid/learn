import { useEffect } from 'react'
import { X, MessageSquarePlus, Loader2 } from 'lucide-react'
import { useFeedback } from '../../hooks/useFeedback'
import { FeedbackForm, SubmittedState } from './FeedbackPanel'

interface Props {
  sessionId: string
  cohortId: string
  sessionTitle?: string
  onClose: () => void
  onSubmitted: () => void
}

export function FeedbackModal({ sessionId, cohortId, sessionTitle, onClose, onSubmitted }: Props) {
  const { submission, submitting, error, submitFeedback, loading } = useFeedback(sessionId, cohortId)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function handleSubmit(draft: Parameters<typeof submitFeedback>[0]) {
    const { error } = await submitFeedback(draft)
    if (!error) onSubmitted()
    return { error }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <MessageSquarePlus size={16} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Live Session Feedback</h2>
              {sessionTitle && (
                <p className="text-xs text-gray-500 truncate max-w-[280px]">{sessionTitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="text-primary-500 animate-spin" />
            </div>
          ) : submission ? (
            <SubmittedState />
          ) : (
            <FeedbackForm submitting={submitting} error={error} onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  )
}
