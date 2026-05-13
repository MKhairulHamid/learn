import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Phase, Session } from '../types'

export function usePhases() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('phases')
        .select('*, sessions(*)')
        .order('order_num')

      if (error) { setError(error.message); setLoading(false); return }

      const sorted = (data as (Phase & { sessions: Session[] })[]).map(p => ({
        ...p,
        sessions: [...(p.sessions ?? [])].sort((a, b) => a.order_num - b.order_num),
      }))
      setPhases(sorted)
      setLoading(false)
    }
    fetch()
  }, [])

  return { phases, loading, error }
}

export function useSession(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }
    supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
      .then(({ data }) => {
        setSession(data as Session | null)
        setLoading(false)
      })
  }, [sessionId])

  return { session, loading }
}
