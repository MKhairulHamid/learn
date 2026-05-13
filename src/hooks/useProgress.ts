import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { UserProgress } from '../types'

export function useProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProgress = useCallback(async () => {
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
    setProgress((data as UserProgress[]) ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchProgress() }, [fetchProgress])

  const isCompleted = useCallback(
    (sessionId: string) => progress.some(p => p.session_id === sessionId && p.completed),
    [progress]
  )

  const completedCount = progress.filter(p => p.completed).length

  const markComplete = useCallback(async (sessionId: string) => {
    if (!user) return
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        session_id: sessionId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,session_id' })
      .select()
      .single()

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
        metadata: { session_id: sessionId },
      })
    }
  }, [user])

  return { progress, loading, isCompleted, completedCount, markComplete, refetch: fetchProgress }
}
