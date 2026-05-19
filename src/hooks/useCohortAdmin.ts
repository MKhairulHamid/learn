import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type {
  Cohort, CohortEnrollment, CohortLessonSchedule, EnrollmentStatus,
} from '../types'

// ── Shared shapes ───────────────────────────────────────────────────

// A cohort row enriched with live enrollment tallies for the list view.
export interface CohortWithCounts extends Cohort {
  activeCount: number
  pendingCount: number
}

// One curriculum session, flattened — used to build the schedule editor.
export interface SessionRef {
  id: string
  session_number: string
  title_en: string
  title_id: string
  order_num: number
}

// An enrollment joined with the learner's profile.
export interface EnrollmentWithProfile extends CohortEnrollment {
  profile: { id: string; full_name: string | null; email: string | null } | null
}

// New-cohort form payload.
export interface CohortDraft {
  name: string
  description: string
  admission_open_at: string
  course_start_at: string
  course_close_at: string
  access_duration_months: number
  max_seats: number | null
}

// Add `months` calendar months to an ISO timestamp.
function addMonths(iso: string, months: number): string {
  const d = new Date(iso)
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
}

// ── Cohort list (admin) ─────────────────────────────────────────────

export function useCohortAdmin() {
  const { user } = useAuth()
  const [cohorts, setCohorts] = useState<CohortWithCounts[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('cohorts')
      .select('*')
      .order('course_start_at', { ascending: false })

    const rows = (data as Cohort[] | null) ?? []
    const enriched = await Promise.all(rows.map(async c => {
      const [{ count: active }, { count: pending }] = await Promise.all([
        supabase.from('cohort_enrollments').select('*', { count: 'exact', head: true })
          .eq('cohort_id', c.id).eq('status', 'active'),
        supabase.from('cohort_enrollments').select('*', { count: 'exact', head: true })
          .eq('cohort_id', c.id).eq('status', 'pending'),
      ])
      return { ...c, activeCount: active ?? 0, pendingCount: pending ?? 0 }
    }))
    setCohorts(enriched)
    setLoading(false)
  }, [])

  useEffect(() => { refetch() }, [refetch])

  // Create a cohort. Admission/publish stay off until the admin opts in.
  const createCohort = useCallback(async (draft: CohortDraft) => {
    const { error } = await supabase.from('cohorts').insert({
      ...draft,
      admission_open: false,
      is_published: false,
      created_by: user?.id ?? null,
    })
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [user, refetch])

  return { cohorts, loading, refetch, createCohort }
}

// ── Single cohort detail (schedule + enrollments) ───────────────────

export function useCohortDetail(cohortId: string | null) {
  const [cohort, setCohort] = useState<Cohort | null>(null)
  const [sessions, setSessions] = useState<SessionRef[]>([])
  const [schedule, setSchedule] = useState<CohortLessonSchedule[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!cohortId) { setLoading(false); return }
    setLoading(true)
    const [{ data: c }, { data: sess }, { data: sched }, { data: enr }] = await Promise.all([
      supabase.from('cohorts').select('*').eq('id', cohortId).single(),
      supabase.from('sessions').select('id, session_number, title_en, title_id, order_num')
        .order('order_num', { ascending: true }),
      supabase.from('cohort_lesson_schedule').select('*').eq('cohort_id', cohortId),
      supabase.from('cohort_enrollments')
        .select('*, profile:profiles(id, full_name, email)')
        .eq('cohort_id', cohortId)
        .order('applied_at', { ascending: true }),
    ])
    setCohort((c as Cohort | null) ?? null)
    setSessions((sess as SessionRef[] | null) ?? [])
    setSchedule((sched as CohortLessonSchedule[] | null) ?? [])
    setEnrollments((enr as EnrollmentWithProfile[] | null) ?? [])
    setLoading(false)
  }, [cohortId])

  useEffect(() => { refetch() }, [refetch])

  // ── Cohort field updates ──────────────────────────────────────────

  const updateCohort = useCallback(async (patch: Partial<Cohort>) => {
    if (!cohortId) return { error: 'No cohort' }
    const { error } = await supabase.from('cohorts').update(patch).eq('id', cohortId)
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [cohortId, refetch])

  // Opening admission must close any other open cohort first
  // (a partial unique index allows only one open at a time).
  const setAdmissionOpen = useCallback(async (open: boolean) => {
    if (!cohortId) return { error: 'No cohort' }
    if (open) {
      await supabase.from('cohorts').update({ admission_open: false })
        .eq('admission_open', true).neq('id', cohortId)
    }
    return updateCohort({ admission_open: open })
  }, [cohortId, updateCohort])

  // ── Schedule editor ───────────────────────────────────────────────

  // Upsert one lesson's schedule row (date / links / override / notes).
  const saveScheduleRow = useCallback(async (
    sessionId: string,
    fields: Partial<Pick<CohortLessonSchedule,
      'scheduled_date' | 'zoom_link' | 'recording_url' | 'unlock_override' | 'notes'>>,
  ) => {
    if (!cohortId) return { error: 'No cohort' }
    const existing = schedule.find(s => s.session_id === sessionId)
    if (existing) {
      const { error } = await supabase.from('cohort_lesson_schedule')
        .update(fields).eq('id', existing.id)
      if (!error) await refetch()
      return { error: error?.message ?? null }
    }
    const { error } = await supabase.from('cohort_lesson_schedule').insert({
      cohort_id: cohortId,
      session_id: sessionId,
      scheduled_date: fields.scheduled_date ?? new Date().toLocaleDateString('en-CA'),
      zoom_link: fields.zoom_link ?? null,
      recording_url: fields.recording_url ?? null,
      unlock_override: fields.unlock_override ?? null,
      notes: fields.notes ?? null,
    })
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [cohortId, schedule, refetch])

  const removeScheduleRow = useCallback(async (sessionId: string) => {
    const existing = schedule.find(s => s.session_id === sessionId)
    if (!existing) return { error: null }
    const { error } = await supabase.from('cohort_lesson_schedule')
      .delete().eq('id', existing.id)
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [schedule, refetch])

  // Bulk-generate the whole schedule: lesson 0 on `firstDate`, every
  // following lesson `stepDays` later. Replaces any existing rows.
  const generateSchedule = useCallback(async (firstDate: string, stepDays: number) => {
    if (!cohortId) return { error: 'No cohort' }
    await supabase.from('cohort_lesson_schedule').delete().eq('cohort_id', cohortId)
    const ordered = [...sessions].sort((a, b) => a.order_num - b.order_num)
    const rows = ordered.map((s, i) => {
      const d = new Date(firstDate + 'T00:00:00')
      d.setDate(d.getDate() + i * stepDays)
      return {
        cohort_id: cohortId,
        session_id: s.id,
        scheduled_date: d.toLocaleDateString('en-CA'),
        unlock_override: null,
      }
    })
    const { error } = await supabase.from('cohort_lesson_schedule').insert(rows)
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [cohortId, sessions, refetch])

  // ── Enrollment management ─────────────────────────────────────────

  // Approve a pending applicant → active, with an access window that
  // ends `access_duration_months` after the course start.
  const approveEnrollment = useCallback(async (enrollmentId: string) => {
    if (!cohort) return { error: 'No cohort' }
    const expires = addMonths(cohort.course_start_at, cohort.access_duration_months)
    const { data: { user: admin } } = await supabase.auth.getUser()
    const { error } = await supabase.from('cohort_enrollments').update({
      status: 'active',
      approved_at: new Date().toISOString(),
      approved_by: admin?.id ?? null,
      access_expires_at: expires,
    }).eq('id', enrollmentId)
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [cohort, refetch])

  const setEnrollmentStatus = useCallback(async (
    enrollmentId: string, status: EnrollmentStatus,
  ) => {
    const { error } = await supabase.from('cohort_enrollments')
      .update({ status }).eq('id', enrollmentId)
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [refetch])

  const removeEnrollment = useCallback(async (enrollmentId: string) => {
    const { error } = await supabase.from('cohort_enrollments')
      .delete().eq('id', enrollmentId)
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [refetch])

  // Admin directly adds a learner — lands as active immediately.
  const addUser = useCallback(async (userId: string) => {
    if (!cohort) return { error: 'No cohort' }
    const expires = addMonths(cohort.course_start_at, cohort.access_duration_months)
    const { data: { user: admin } } = await supabase.auth.getUser()
    const { error } = await supabase.from('cohort_enrollments').insert({
      cohort_id: cohort.id,
      user_id: userId,
      status: 'active',
      approved_at: new Date().toISOString(),
      approved_by: admin?.id ?? null,
      access_expires_at: expires,
    })
    if (!error) await refetch()
    return { error: error?.message ?? null }
  }, [cohort, refetch])

  return {
    cohort, sessions, schedule, enrollments, loading, refetch,
    updateCohort, setAdmissionOpen,
    saveScheduleRow, removeScheduleRow, generateSchedule,
    approveEnrollment, setEnrollmentStatus, removeEnrollment, addUser,
  }
}

// ── All profiles (for the "add learner" picker) ─────────────────────

export function useAllProfiles() {
  const [profiles, setProfiles] = useState<
    { id: string; full_name: string | null; email: string | null }[]
  >([])

  useEffect(() => {
    supabase.from('profiles').select('id, full_name, email')
      .order('full_name', { ascending: true })
      .then(({ data }) => setProfiles(data ?? []))
  }, [])

  return profiles
}
