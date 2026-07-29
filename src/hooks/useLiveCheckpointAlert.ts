import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useCohort } from './useCohort'
import type { CheckpointActivation } from '../types'

export interface LiveCheckpointAlert {
  activation: CheckpointActivation
  sessionId: string
  sessionNumber: string
  titleId: string
  titleEn: string
}

// Realtime filters take one value each, so we open one listener per cohort.
// Learners are in a handful of cohorts at most; this caps the pathological case.
const MAX_WATCHED_COHORTS = 6

/**
 * Watches every cohort the learner belongs to for a checkpoint going live,
 * anywhere in the app.
 *
 * Without this the only way to discover a live checkpoint is to already be
 * sitting on the right session page — which is why a mentor otherwise has to
 * read a lesson URL out loud before every question.
 */
export function useLiveCheckpointAlert(): LiveCheckpointAlert | null {
  const { enrollments, isEditor, loading } = useCohort()
  const [activation, setActivation] = useState<CheckpointActivation | null>(null)
  const [session, setSession] = useState<Omit<LiveCheckpointAlert, 'activation'> | null>(null)

  const cohortIds = useMemo(() => {
    if (isEditor) return []          // mentors drive checkpoints, they don't join them
    return enrollments
      .filter(e => e.status === 'active')
      .map(e => e.cohort_id)
      .slice(0, MAX_WATCHED_COHORTS)
  }, [enrollments, isEditor])

  const cohortKey = cohortIds.join(',')

  const refresh = useCallback(async () => {
    if (cohortIds.length === 0) { setActivation(null); return }
    const { data } = await supabase
      .from('checkpoint_activations')
      .select('*')
      .in('cohort_id', cohortIds)
      .eq('status', 'open')
      .order('opened_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setActivation((data as CheckpointActivation | null) ?? null)
  }, [cohortKey])   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) return
    refresh()
  }, [loading, refresh])

  // Any change to an activation in one of these cohorts re-resolves "what is
  // open right now" — cheap, since it is one indexed row.
  useEffect(() => {
    if (cohortIds.length === 0) return
    const channel = supabase.channel(`ckpt-alert:${cohortKey}`)
    for (const id of cohortIds) {
      channel.on('postgres_changes', {
        event: '*', schema: 'public', table: 'checkpoint_activations',
        filter: `cohort_id=eq.${id}`,
      }, () => refresh())
    }
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [cohortKey, refresh])   // eslint-disable-line react-hooks/exhaustive-deps

  // Resolve the lesson so the banner can name where it is sending them.
  useEffect(() => {
    if (!activation) { setSession(null); return }
    let cancelled = false
    supabase
      .from('sessions')
      .select('id, session_number, title_id, title_en')
      .eq('id', activation.session_id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return
        const s = data as { id: string; session_number: string; title_id: string; title_en: string }
        setSession({
          sessionId: s.id, sessionNumber: s.session_number,
          titleId: s.title_id, titleEn: s.title_en,
        })
      })
    return () => { cancelled = true }
  }, [activation?.session_id])   // eslint-disable-line react-hooks/exhaustive-deps

  if (!activation || !session) return null
  return { activation, ...session }
}
