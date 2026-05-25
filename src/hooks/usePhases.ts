import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LESSON_ZERO_ID } from '../lib/constants'
import type { Phase, Program, Session } from '../types'

/** All published programs, ordered for display. */
export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .eq('is_published', true)
      .order('order_num')
      .then(({ data }) => {
        setPrograms((data as Program[] | null) ?? [])
        setLoading(false)
      })
  }, [])

  return { programs, loading }
}

/** Phases (with sessions) for one program, plus the shared orientation lesson. */
export function usePhases(programId?: string) {
  const [phases, setPhases] = useState<Phase[]>([])
  const [orientation, setOrientation] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!programId) { setPhases([]); setLoading(false); return }
    setLoading(true)
    async function fetch() {
      const [{ data, error }, { data: orient }] = await Promise.all([
        supabase.from('phases').select('*, sessions(*)')
          .eq('program_id', programId).order('order_num'),
        supabase.from('sessions').select('*').eq('id', LESSON_ZERO_ID).maybeSingle(),
      ])

      if (error) { setError(error.message); setLoading(false); return }

      const sorted = (data as (Phase & { sessions: Session[] })[]).map(p => ({
        ...p,
        sessions: [...(p.sessions ?? [])].sort((a, b) => a.order_num - b.order_num),
      }))
      setPhases(sorted)
      setOrientation((orient as Session | null) ?? null)
      setLoading(false)
    }
    fetch()
  }, [programId])

  return { phases, orientation, loading, error }
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
