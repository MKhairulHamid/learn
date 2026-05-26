import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { SessionFeedback } from '../types'

// ── Student: check window + fetch own submission ────────────────────

export interface FeedbackDraft {
  rating_materials: number
  rating_exercises: number
  rating_mentor_clarity: number
  rating_mentor_management: number
  rating_mentor_engagement: number
  rating_overall: number
  comment_highlight: string
  comment_improve: string
  comment_other: string
}

export function useFeedback(sessionId: string | undefined, cohortId: string | null) {
  const { user } = useAuth()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [submission, setSubmission] = useState<SessionFeedback | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!sessionId || !cohortId || !user) { setLoading(false); return }
    setLoading(true)

    const [{ data: sched }, { data: sub }] = await Promise.all([
      supabase.from('cohort_lesson_schedule')
        .select('feedback_open')
        .eq('cohort_id', cohortId)
        .eq('session_id', sessionId)
        .maybeSingle(),
      supabase.from('session_feedback')
        .select('*')
        .eq('cohort_id', cohortId)
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    setFeedbackOpen((sched as { feedback_open: boolean } | null)?.feedback_open ?? false)
    setSubmission(sub as SessionFeedback | null)
    setLoading(false)
  }, [sessionId, cohortId, user])

  useEffect(() => { refetch() }, [refetch])

  const submitFeedback = useCallback(async (draft: FeedbackDraft) => {
    if (!sessionId || !cohortId || !user) return { error: 'Not ready' }
    setSubmitting(true)
    setError(null)
    const { error: err } = await supabase.from('session_feedback').insert({
      cohort_id: cohortId,
      session_id: sessionId,
      user_id: user.id,
      ...draft,
    })
    setSubmitting(false)
    if (err) { setError(err.message); return { error: err.message } }
    await refetch()
    return { error: null }
  }, [sessionId, cohortId, user, refetch])

  return { feedbackOpen, submission, loading, submitting, error, submitFeedback }
}

// ── Admin: all submissions for a given cohort (+ optional session filter) ──

export interface FeedbackRow extends SessionFeedback {
  profile: { full_name: string | null; email: string | null } | null
  session_title: string
}

export interface FeedbackStats {
  count: number
  avg_materials: number
  avg_exercises: number
  avg_mentor_clarity: number
  avg_mentor_management: number
  avg_mentor_engagement: number
  avg_overall: number
}

export function useFeedbackAdmin(cohortId: string | null, sessionId?: string | null) {
  const [rows, setRows] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!cohortId) { setLoading(false); return }
    setLoading(true)

    let q = supabase.from('session_feedback').select('*').eq('cohort_id', cohortId)
    if (sessionId) q = q.eq('session_id', sessionId)
    const { data } = await q.order('submitted_at', { ascending: false })

    const feedbackRows = (data as SessionFeedback[] | null) ?? []
    if (feedbackRows.length === 0) { setRows([]); setLoading(false); return }

    const userIds = [...new Set(feedbackRows.map(r => r.user_id))]
    const sessionIds = [...new Set(feedbackRows.map(r => r.session_id))]

    const [{ data: profs }, { data: sessions }] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email').in('id', userIds),
      supabase.from('sessions').select('id, title_en').in('id', sessionIds),
    ])

    const profById = new Map(
      ((profs as { id: string; full_name: string | null; email: string | null }[] | null) ?? [])
        .map(p => [p.id, p]),
    )
    const sessionById = new Map(
      ((sessions as { id: string; title_en: string }[] | null) ?? [])
        .map(s => [s.id, s.title_en]),
    )

    setRows(feedbackRows.map(r => ({
      ...r,
      profile: profById.get(r.user_id) ?? null,
      session_title: sessionById.get(r.session_id) ?? r.session_id,
    })))
    setLoading(false)
  }, [cohortId, sessionId])

  useEffect(() => { refetch() }, [refetch])

  const stats: FeedbackStats | null = rows.length === 0 ? null : {
    count: rows.length,
    avg_materials: avg(rows, 'rating_materials'),
    avg_exercises: avg(rows, 'rating_exercises'),
    avg_mentor_clarity: avg(rows, 'rating_mentor_clarity'),
    avg_mentor_management: avg(rows, 'rating_mentor_management'),
    avg_mentor_engagement: avg(rows, 'rating_mentor_engagement'),
    avg_overall: avg(rows, 'rating_overall'),
  }

  return { rows, stats, loading, refetch }
}

// ── Student: sessions with open feedback window not yet submitted ───

export interface PendingFeedbackSession {
  id: string
  title_en: string
  title_id: string
}

export function usePendingFeedback(cohortId: string | null) {
  const { user } = useAuth()
  const [pendingSessionIds, setPendingSessionIds] = useState<Set<string>>(new Set())
  const [pendingSessions, setPendingSessions] = useState<PendingFeedbackSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cohortId || !user) { setLoading(false); return }
    let cancelled = false

    async function load() {
      const { data: openSchedules } = await supabase
        .from('cohort_lesson_schedule')
        .select('session_id')
        .eq('cohort_id', cohortId)
        .eq('feedback_open', true)

      const openIds = ((openSchedules ?? []) as { session_id: string }[]).map(r => r.session_id)
      if (openIds.length === 0) {
        if (!cancelled) { setPendingSessionIds(new Set()); setPendingSessions([]); setLoading(false) }
        return
      }

      const { data: submitted } = await supabase
        .from('session_feedback')
        .select('session_id')
        .eq('cohort_id', cohortId)
        .eq('user_id', user.id)
        .in('session_id', openIds)

      const submittedIds = new Set(((submitted ?? []) as { session_id: string }[]).map(r => r.session_id))
      const pendingIds = openIds.filter(id => !submittedIds.has(id))

      let sessions: PendingFeedbackSession[] = []
      if (pendingIds.length > 0) {
        const { data } = await supabase
          .from('sessions')
          .select('id, title_en, title_id')
          .in('id', pendingIds)
        sessions = (data as PendingFeedbackSession[] | null) ?? []
      }

      if (!cancelled) {
        setPendingSessionIds(new Set(pendingIds))
        setPendingSessions(sessions)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [cohortId, user])

  return { pendingSessionIds, pendingSessions, loading }
}

function avg(rows: SessionFeedback[], key: keyof SessionFeedback): number {
  const vals = rows.map(r => r[key] as number).filter(v => typeof v === 'number')
  return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0
}
