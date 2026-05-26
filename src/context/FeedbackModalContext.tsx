import { createContext, useContext, useState, useCallback } from 'react'
import { FeedbackModal } from '../components/feedback/FeedbackModal'

interface OpenFeedbackParams {
  sessionId: string
  cohortId: string
  sessionTitle?: string
  /** Called after the student successfully submits the form */
  onSubmitted?: () => void
}

interface FeedbackModalContextValue {
  openFeedback: (params: OpenFeedbackParams) => void
}

const FeedbackModalContext = createContext<FeedbackModalContextValue>({
  openFeedback: () => {},
})

export function useFeedbackModal() {
  return useContext(FeedbackModalContext)
}

export function FeedbackModalProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<OpenFeedbackParams | null>(null)

  const openFeedback = useCallback((p: OpenFeedbackParams) => setParams(p), [])
  const handleClose = useCallback(() => setParams(null), [])

  const handleSubmitted = useCallback(() => {
    params?.onSubmitted?.()
    setParams(null)
  }, [params])

  return (
    <FeedbackModalContext.Provider value={{ openFeedback }}>
      {children}
      {params && (
        <FeedbackModal
          sessionId={params.sessionId}
          cohortId={params.cohortId}
          sessionTitle={params.sessionTitle}
          onClose={handleClose}
          onSubmitted={handleSubmitted}
        />
      )}
    </FeedbackModalContext.Provider>
  )
}
