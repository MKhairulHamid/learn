import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export type ReportReason =
  | 'incorrect_content'
  | 'outdated'
  | 'broken_exercise'
  | 'missing_content'
  | 'other'

export type ReportStatus = 'open' | 'resolved' | 'dismissed'

export interface ContentReport {
  id: string
  session_id: string
  user_id: string
  reason: ReportReason
  details: string
  status: ReportStatus
  created_at: string
  resolved_at: string | null
}

export interface ContentReportRow extends ContentReport {
  profile: { full_name: string | null; email: string | null } | null
  session_title_en: string
  session_number: string
}

// ── Student: submit a report ────────────────────────────────────────────

export function useSubmitReport(sessionId: string | undefined) {
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const submit = useCallback(async (reason: ReportReason, details: string) => {
    if (!sessionId || !user) return { error: 'Not ready' }
    setSubmitting(true)
    setError(null)
    const { error: err } = await supabase.from('content_reports').insert({
      session_id: sessionId,
      user_id: user.id,
      reason,
      details,
    })
    setSubmitting(false)
    if (err) { setError(err.message); return { error: err.message } }
    setSubmitted(true)
    return { error: null }
  }, [sessionId, user])

  return { submit, submitting, error, submitted }
}

// ── Admin: all reports ──────────────────────────────────────────────────

export function useContentReportsAdmin() {
  const [rows, setRows] = useState<ContentReportRow[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('content_reports')
      .select('*')
      .order('created_at', { ascending: false })

    const reports = (data as ContentReport[] | null) ?? []
    if (reports.length === 0) { setRows([]); setLoading(false); return }

    const userIds    = [...new Set(reports.map(r => r.user_id))]
    const sessionIds = [...new Set(reports.map(r => r.session_id))]

    const [{ data: profs }, { data: sessions }] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email').in('id', userIds),
      supabase.from('sessions').select('id, title_en, session_number').in('id', sessionIds),
    ])

    const profById = new Map(
      ((profs as { id: string; full_name: string | null; email: string | null }[] | null) ?? [])
        .map(p => [p.id, p]),
    )
    const sessionById = new Map(
      ((sessions as { id: string; title_en: string; session_number: string }[] | null) ?? [])
        .map(s => [s.id, s]),
    )

    setRows(reports.map(r => ({
      ...r,
      profile: profById.get(r.user_id) ?? null,
      session_title_en: sessionById.get(r.session_id)?.title_en ?? r.session_id,
      session_number: sessionById.get(r.session_id)?.session_number ?? '',
    })))
    setLoading(false)
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const updateStatus = useCallback(async (id: string, status: ReportStatus) => {
    await supabase.from('content_reports').update({
      status,
      resolved_at: status !== 'open' ? new Date().toISOString() : null,
    }).eq('id', id)
    await refetch()
  }, [refetch])

  const openCount = rows.filter(r => r.status === 'open').length

  return { rows, loading, openCount, updateStatus, refetch }
}
