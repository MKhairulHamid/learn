import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Certificate } from '../types'

// ── Shared types ─────────────────────────────────────────────────────

export interface StudentReviewEntry {
  userId: string
  fullName: string
  username: string | null
  completedSessions: number
  totalSessions: number
  completionPct: number
  avgScore: number          // 0–100 from cohort_session_progress.score
  exercisesSubmitted: number
  feedbackRating: number    // 1–5 avg overall rating given by student
  feedbackCount: number
  reviewId: string | null
  reviewStatus: 'pending' | 'pass' | 'fail'
  reviewNotes: string | null
}

// ── PM review hook ────────────────────────────────────────────────────

export function useCohortReview(cohortId: string | null) {
  const { profile } = useAuth()
  const [students, setStudents] = useState<StudentReviewEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [graduating, setGraduating] = useState(false)

  const load = useCallback(async () => {
    if (!cohortId) return
    setLoading(true)

    // All five queries in parallel — no N+1
    const [
      { data: enrollData },
      { data: schedData },
      { data: progressData },
      { data: feedbackData },
      { data: reviewData },
      { data: submissionData },
    ] = await Promise.all([
      supabase
        .from('cohort_enrollments')
        .select('user_id')
        .eq('cohort_id', cohortId)
        .eq('status', 'active'),
      supabase
        .from('cohort_lesson_schedule')
        .select('session_id')
        .eq('cohort_id', cohortId),
      supabase
        .from('cohort_session_progress')
        .select('user_id, completed, score')
        .eq('cohort_id', cohortId),
      supabase
        .from('session_feedback')
        .select('user_id, rating_overall')
        .eq('cohort_id', cohortId),
      supabase
        .from('cohort_student_reviews')
        .select('id, user_id, status, notes')
        .eq('cohort_id', cohortId),
      supabase
        .from('exercise_submissions')
        .select('user_id')
        .eq('cohort_id', cohortId),
    ])

    const userIds = (enrollData ?? []).map((e: { user_id: string }) => e.user_id)
    if (userIds.length === 0) {
      setStudents([])
      setLoading(false)
      return
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, full_name, username')
      .in('id', userIds)

    const totalSessions = (schedData ?? []).length

    // Build O(1) lookup maps from bulk data
    const progressByUser = new Map<string, { completed: number; scoreSum: number; scoreCount: number }>()
    for (const p of (progressData ?? []) as { user_id: string; completed: boolean; score: number }[]) {
      const cur = progressByUser.get(p.user_id) ?? { completed: 0, scoreSum: 0, scoreCount: 0 }
      if (p.completed) {
        cur.completed++
        if (p.score != null) { cur.scoreSum += p.score; cur.scoreCount++ }
      }
      progressByUser.set(p.user_id, cur)
    }

    const feedbackByUser = new Map<string, { sum: number; count: number }>()
    for (const f of (feedbackData ?? []) as { user_id: string; rating_overall: number }[]) {
      const cur = feedbackByUser.get(f.user_id) ?? { sum: 0, count: 0 }
      cur.sum += f.rating_overall
      cur.count++
      feedbackByUser.set(f.user_id, cur)
    }

    const reviewByUser = new Map<string, { id: string; status: string; notes: string | null }>()
    for (const r of (reviewData ?? []) as { id: string; user_id: string; status: string; notes: string | null }[]) {
      reviewByUser.set(r.user_id, { id: r.id, status: r.status, notes: r.notes })
    }

    const submissionsByUser = new Map<string, number>()
    for (const s of (submissionData ?? []) as { user_id: string }[]) {
      submissionsByUser.set(s.user_id, (submissionsByUser.get(s.user_id) ?? 0) + 1)
    }

    const profileById = new Map(
      ((profileData ?? []) as { id: string; full_name: string | null; username: string | null }[])
        .map(p => [p.id, p])
    )

    const entries: StudentReviewEntry[] = userIds.map(userId => {
      const p = profileById.get(userId)
      const progress = progressByUser.get(userId)
      const feedback = feedbackByUser.get(userId)
      const review = reviewByUser.get(userId)

      const completedSessions = progress?.completed ?? 0
      const avgScore =
        progress && progress.scoreCount > 0
          ? Math.round(progress.scoreSum / progress.scoreCount)
          : 0
      const feedbackRating =
        feedback && feedback.count > 0
          ? Math.round((feedback.sum / feedback.count) * 10) / 10
          : 0

      return {
        userId,
        fullName: p?.full_name ?? p?.username ?? userId.slice(0, 8),
        username: p?.username ?? null,
        completedSessions,
        totalSessions,
        completionPct:
          totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
        avgScore,
        exercisesSubmitted: submissionsByUser.get(userId) ?? 0,
        feedbackRating,
        feedbackCount: feedback?.count ?? 0,
        reviewId: review?.id ?? null,
        reviewStatus: (review?.status as 'pending' | 'pass' | 'fail') ?? 'pending',
        reviewNotes: review?.notes ?? null,
      }
    })

    setStudents(entries)
    setLoading(false)
  }, [cohortId])

  const setReview = useCallback(
    async (userId: string, status: 'pass' | 'fail' | 'pending', notes?: string) => {
      if (!cohortId || !profile?.id) return false
      const { error } = await supabase.from('cohort_student_reviews').upsert(
        {
          cohort_id: cohortId,
          user_id: userId,
          reviewed_by: profile.id,
          status,
          notes: notes ?? null,
          reviewed_at: status !== 'pending' ? new Date().toISOString() : null,
        },
        { onConflict: 'cohort_id,user_id' }
      )
      if (!error) {
        setStudents(prev =>
          prev.map(s =>
            s.userId === userId
              ? { ...s, reviewStatus: status, reviewNotes: notes ?? null }
              : s
          )
        )
      }
      return !error
    },
    [cohortId, profile?.id]
  )

  const setBulkReview = useCallback(
    async (userIds: string[], status: 'pass' | 'fail', notes?: string) => {
      if (!cohortId || !profile?.id || userIds.length === 0) return false
      const rows = userIds.map(userId => ({
        cohort_id: cohortId,
        user_id: userId,
        reviewed_by: profile.id,
        status,
        notes: notes ?? null,
        reviewed_at: new Date().toISOString(),
      }))
      const { error } = await supabase
        .from('cohort_student_reviews')
        .upsert(rows, { onConflict: 'cohort_id,user_id' })
      if (!error) {
        setStudents(prev =>
          prev.map(s =>
            userIds.includes(s.userId)
              ? { ...s, reviewStatus: status, reviewNotes: notes ?? null }
              : s
          )
        )
      }
      return !error
    },
    [cohortId, profile?.id]
  )

  const graduateCohort = useCallback(
    async (courseTitle: string) => {
      if (!cohortId || !profile?.id) return { success: false, count: 0 }
      const passing = students.filter(s => s.reviewStatus === 'pass')
      if (passing.length === 0) return { success: false, count: 0 }

      setGraduating(true)

      // Get default template id
      const { data: templateData } = await supabase
        .from('certificate_templates')
        .select('id')
        .eq('is_default', true)
        .maybeSingle()

      const rows = passing.map(s => ({
        user_id: s.userId,
        cohort_id: cohortId,
        template_id: templateData?.id ?? null,
        course_title: courseTitle,
        recipient_name: s.fullName,
        score: s.avgScore || null,
        issued_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('certificates')
        .upsert(rows, { onConflict: 'user_id,cohort_id' })

      setGraduating(false)
      return { success: !error, count: rows.length }
    },
    [cohortId, profile?.id, students]
  )

  return { students, loading, graduating, load, setReview, setBulkReview, graduateCohort }
}

// ── User certificates hook (profile page) ────────────────────────────

export interface CertificateWithCohort extends Certificate {
  cohort: { name: string } | null
}

export function useUserCertificates(userId: string | undefined) {
  const [certificates, setCertificates] = useState<CertificateWithCohort[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('certificates')
      .select('*, cohort:cohorts(name)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })
    setCertificates((data as CertificateWithCohort[] | null) ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  return { certificates, loading, refetch: load }
}

// ── Single certificate hook (verify / print pages) ───────────────────

export function useCertificate(certId: string | undefined) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!certId) { setLoading(false); return }
    setLoading(true)
    setNotFound(false)
    supabase
      .from('certificates')
      .select('*')
      .eq('id', certId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true)
        setCertificate(data as Certificate | null)
        setLoading(false)
      })
  }, [certId])

  return { certificate, loading, notFound }
}

// ── Certificate template management hook ─────────────────────────────

import type { CertificateTemplate } from '../types'

export function useCertificateTemplates() {
  const { profile } = useAuth()
  const [templates, setTemplates] = useState<CertificateTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('certificate_templates')
      .select('*')
      .order('created_at')
    setTemplates((data as CertificateTemplate[] | null) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const saveTemplate = useCallback(
    async (patch: Partial<CertificateTemplate> & { id?: string }) => {
      if (!profile?.id) return false
      setSaving(true)
      let error
      if (patch.id) {
        ;({ error } = await supabase
          .from('certificate_templates')
          .update({ ...patch, updated_at: new Date().toISOString() })
          .eq('id', patch.id))
      } else {
        ;({ error } = await supabase
          .from('certificate_templates')
          .insert({ ...patch, created_by: profile.id }))
      }
      setSaving(false)
      if (!error) await load()
      return !error
    },
    [profile?.id, load]
  )

  const deleteTemplate = useCallback(async (id: string) => {
    const { error } = await supabase.from('certificate_templates').delete().eq('id', id)
    if (!error) setTemplates(prev => prev.filter(t => t.id !== id))
    return !error
  }, [])

  const setDefault = useCallback(
    async (id: string) => {
      // Clear all defaults, then set the chosen one
      await supabase
        .from('certificate_templates')
        .update({ is_default: false })
        .neq('id', id)
      const { error } = await supabase
        .from('certificate_templates')
        .update({ is_default: true })
        .eq('id', id)
      if (!error) {
        setTemplates(prev => prev.map(t => ({ ...t, is_default: t.id === id })))
      }
      return !error
    },
    []
  )

  return { templates, loading, saving, saveTemplate, deleteTemplate, setDefault, refetch: load }
}
