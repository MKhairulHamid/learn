import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useCohort } from './useCohort'
import type { UserProgress } from '../types'

/**
 * Session-completion progress.
 *
 * Progress is tracked **per cohort**: an active cohort member reads and writes
 * `cohort_session_progress` scoped to their cohort, so the same learner in two
 * cohorts keeps independent progress. Users with no active cohort (admins, or
 * learners before approval) fall back to the legacy `user_progress` table.
 */
export function useProgress() {
  const { user } = useAuth()
  const { cohortId, status, loading: cohortLoading } = useCohort()

  // Only an active membership routes progress into the per-cohort table.
  const activeCohortId = status === 'active' ? cohortId : null

  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    if (!user) { setProgress([]); setLoading(false); return }
    // Wait for the cohort to resolve so we query the right table.
    if (cohortLoading) return
    setLoading(true)

    if (activeCohortId) {
      const { data } = await supabase
        .from('cohort_session_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('cohort_id', activeCohortId)
      setProgress((data as UserProgress[]) ?? [])
    } else {
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
      setProgress((data as UserProgress[]) ?? [])
    }
    setLoading(false)
  }, [user, activeCohortId, cohortLoading])

  useEffect(() => { fetchProgress() }, [fetchProgress])

  const isCompleted = useCallback(
    (sessionId: string) => progress.some(p => p.session_id === sessionId && p.completed),
    [progress]
  )

  const completedCount = progress.filter(p => p.completed).length

  const markComplete = useCallback(async (sessionId: string) => {
    if (!user) return

    const completed_at = new Date().toISOString()
    const result = activeCohortId
      ? await supabase
          .from('cohort_session_progress')
          .upsert(
            { cohort_id: activeCohortId, user_id: user.id, session_id: sessionId, completed: true, completed_at },
            { onConflict: 'cohort_id,user_id,session_id' },
          )
          .select()
          .single()
      : await supabase
          .from('user_progress')
          .upsert(
            { user_id: user.id, session_id: sessionId, completed: true, completed_at },
            { onConflict: 'user_id,session_id' },
          )
          .select()
          .single()
    const { data, error } = result

    if (!error && data) {
      setProgress(prev => {
        const exists = prev.findIndex(p => p.session_id === sessionId)
        const updated = data as UserProgress
        return exists >= 0
          ? prev.map((p, i) => (i === exists ? updated : p))
          : [...prev, updated]
      })
      await supabase.from('user_activity_logs').insert({
        user_id: user.id,
        action_type: 'session_complete',
        metadata: { session_id: sessionId, cohort_id: activeCohortId },
      })
    }
  }, [user, activeCohortId])

  return { progress, loading, isCompleted, completedCount, markComplete, refetch: fetchProgress }
}
