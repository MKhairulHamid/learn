import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Program, Session, Cohort, CohortEnrollment, CohortLessonSchedule, SessionFeedback } from '../types'

// ── Shared shapes ────────────────────────────────────────────────────

export interface MentorProfile {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
}

export interface MentorPerformance {
  mentor: MentorProfile
  sessionCount: number
  feedbackCount: number
  avgClarity: number
  avgManagement: number
  avgEngagement: number
  avgOverall: number
}

export interface EnrollmentWithProfile extends CohortEnrollment {
  profile: { id: string; full_name: string | null; username: string | null } | null
  cohortName: string
}

export interface SessionWithMentor extends Session {
  mentor: MentorProfile | null
  phaseName: string
}

// ── Assigned programs list ───────────────────────────────────────────

export function usePMPrograms() {
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    if (isAdmin) {
      const { data } = await supabase
        .from('programs')
        .select('*')
        .order('order_num')
      setPrograms((data as Program[] | null) ?? [])
    } else {
      const { data } = await supabase
        .from('program_manager_assignments')
        .select('program:programs(*)')
        .eq('user_id', profile?.id ?? '')
      const rows = (data as { program: Program }[] | null) ?? []
      setPrograms(rows.map(r => r.program).filter(Boolean))
    }
    setLoading(false)
  }, [isAdmin, profile?.id])

  useEffect(() => { refetch() }, [refetch])

  return { programs, loading, refetch }
}

// ── Program details editor ───────────────────────────────────────────

export function usePMProgramDetail(programId: string | undefined) {
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refetch = useCallback(async () => {
    if (!programId) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .single()
    setProgram(data as Program | null)
    setLoading(false)
  }, [programId])

  useEffect(() => { refetch() }, [refetch])

  const updateProgram = useCallback(async (patch: Partial<Program>) => {
    if (!programId) return false
    setSaving(true)
    const { error } = await supabase
      .from('programs')
      .update(patch)
      .eq('id', programId)
    setSaving(false)
    if (!error) { setProgram(p => p ? { ...p, ...patch } : p) }
    return !error
  }, [programId])

  return { program, loading, saving, refetch, updateProgram }
}

// ── Sessions with mentor assignment ─────────────────────────────────

export function usePMSessions(programId: string | undefined) {
  const [sessions, setSessions] = useState<SessionWithMentor[]>([])
  const [mentors, setMentors] = useState<MentorProfile[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!programId) { setLoading(false); return }
    setLoading(true)
    const [{ data: phaseData }, { data: mentorData }] = await Promise.all([
      supabase
        .from('phases')
        .select('id, name_en, sessions(*, mentor:profiles(id, full_name, username, avatar_url))')
        .eq('program_id', programId)
        .order('order_num'),
      supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .eq('role', 'mentor'),
    ])

    const rows: SessionWithMentor[] = []
    for (const phase of (phaseData ?? []) as {
      id: string; name_en: string;
      sessions: (Session & { mentor: MentorProfile | null })[]
    }[]) {
      for (const s of (phase.sessions ?? []).sort((a, b) => a.order_num - b.order_num)) {
        rows.push({ ...s, mentor: s.mentor ?? null, phaseName: phase.name_en })
      }
    }

    setSessions(rows)
    setMentors((mentorData as MentorProfile[] | null) ?? [])
    setLoading(false)
  }, [programId])

  useEffect(() => { refetch() }, [refetch])

  const assignMentor = useCallback(async (sessionId: string, mentorId: string | null) => {
    const { error } = await supabase
      .from('sessions')
      .update({ mentor_id: mentorId })
      .eq('id', sessionId)
    if (!error) {
      const mentor = mentorId ? mentors.find(m => m.id === mentorId) ?? null : null
      setSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, mentor_id: mentorId, mentor } : s
      ))
    }
    return !error
  }, [mentors])

  return { sessions, mentors, loading, refetch, assignMentor }
}

// ── Cohort + schedule management ────────────────────────────────────

export interface CohortWithSchedule extends Cohort {
  schedule: CohortLessonSchedule[]
}

export function usePMCohorts(programId: string | undefined) {
  const { profile } = useAuth()
  const [cohorts, setCohorts] = useState<CohortWithSchedule[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!programId) { setLoading(false); return }
    setLoading(true)
    const { data: cohortData } = await supabase
      .from('cohorts')
      .select('*')
      .eq('program_id', programId)
      .order('course_start_at', { ascending: false })

    const rows = (cohortData as Cohort[] | null) ?? []
    const enriched = await Promise.all(rows.map(async c => {
      const { data: schedData } = await supabase
        .from('cohort_lesson_schedule')
        .select('*')
        .eq('cohort_id', c.id)
        .order('scheduled_date')
      return { ...c, schedule: (schedData as CohortLessonSchedule[] | null) ?? [] }
    }))
    setCohorts(enriched)
    setLoading(false)
  }, [programId])

  useEffect(() => { refetch() }, [refetch])

  const createCohort = useCallback(async (draft: Omit<Cohort, 'id' | 'created_at' | 'created_by'>) => {
    const { data, error } = await supabase
      .from('cohorts')
      .insert({ ...draft, created_by: profile?.id })
      .select()
      .single()
    if (!error && data) await refetch()
    return { data: data as Cohort | null, error }
  }, [profile?.id, refetch])

  const updateCohort = useCallback(async (cohortId: string, patch: Partial<Cohort>) => {
    const { error } = await supabase.from('cohorts').update(patch).eq('id', cohortId)
    if (!error) setCohorts(prev => prev.map(c => c.id === cohortId ? { ...c, ...patch } : c))
    return !error
  }, [])

  const upsertScheduleRow = useCallback(async (
    cohortId: string,
    sessionId: string,
    patch: Partial<CohortLessonSchedule>,
  ) => {
    const { error } = await supabase
      .from('cohort_lesson_schedule')
      .upsert({ cohort_id: cohortId, session_id: sessionId, ...patch }, { onConflict: 'cohort_id,session_id' })
    if (!error) await refetch()
    return !error
  }, [refetch])

  return { cohorts, loading, refetch, createCohort, updateCohort, upsertScheduleRow }
}

// ── Student enrollment management ────────────────────────────────────

export function usePMStudents(programId: string | undefined) {
  const [enrollments, setEnrollments] = useState<EnrollmentWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!programId) { setLoading(false); return }
    setLoading(true)
    const { data: cohortData } = await supabase
      .from('cohorts')
      .select('id, name')
      .eq('program_id', programId)

    const cohortNames = Object.fromEntries(
      ((cohortData as { id: string; name: string }[] | null) ?? []).map(c => [c.id, c.name])
    )
    const cohortIds = Object.keys(cohortNames)
    if (cohortIds.length === 0) { setEnrollments([]); setLoading(false); return }

    // No FK from cohort_enrollments → profiles (user_id points at auth.users),
    // so profiles can't be embedded — fetch and join them separately.
    const { data: enrollmentData } = await supabase
      .from('cohort_enrollments')
      .select('*')
      .in('cohort_id', cohortIds)
      .order('applied_at', { ascending: false })

    const rawEnrollments = (enrollmentData as CohortEnrollment[] | null) ?? []
    const userIds = [...new Set(rawEnrollments.map(e => e.user_id))]
    const { data: profileData } = userIds.length > 0
      ? await supabase.from('profiles').select('id, full_name, username').in('id', userIds)
      : { data: [] }

    const profileById = new Map(
      ((profileData as { id: string; full_name: string | null; username: string | null }[] | null) ?? [])
        .map(p => [p.id, p])
    )

    const rows = rawEnrollments.map(r => ({
      ...r,
      profile: profileById.get(r.user_id) ?? null,
      cohortName: cohortNames[r.cohort_id] ?? '',
    }))

    setEnrollments(rows)
    setLoading(false)
  }, [programId])

  useEffect(() => { refetch() }, [refetch])

  const updateEnrollment = useCallback(async (
    enrollmentId: string,
    patch: { status: CohortEnrollment['status']; approved_by?: string | null; approved_at?: string | null; notes?: string | null },
  ) => {
    const { error } = await supabase
      .from('cohort_enrollments')
      .update(patch)
      .eq('id', enrollmentId)
    if (!error) {
      setEnrollments(prev => prev.map(e => e.id === enrollmentId ? { ...e, ...patch } : e))
    }
    return !error
  }, [])

  return { enrollments, loading, refetch, updateEnrollment }
}

// ── Mentor performance ───────────────────────────────────────────────

export function useMentorPerformance(programId: string | undefined) {
  const [performance, setPerformance] = useState<MentorPerformance[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!programId) { setLoading(false); return }
    setLoading(true)

    // Fetch sessions with mentor info for this program
    const { data: phaseData } = await supabase
      .from('phases')
      .select('id, sessions(id, mentor_id, mentor:profiles(id, full_name, username, avatar_url))')
      .eq('program_id', programId)

    const sessionMentorMap = new Map<string, MentorProfile>()
    const mentorMap = new Map<string, MentorProfile>()

    type PhaseWithSessions = {
      sessions: (Pick<Session, 'id' | 'mentor_id'> & { mentor: MentorProfile | null })[]
    }
    for (const phase of (phaseData ?? []) as unknown as PhaseWithSessions[]) {
      for (const s of phase.sessions ?? []) {
        if (s.mentor_id && s.mentor) {
          sessionMentorMap.set(s.id, s.mentor)
          mentorMap.set(s.mentor_id, s.mentor)
        }
      }
    }

    if (mentorMap.size === 0) { setPerformance([]); setLoading(false); return }

    // Fetch cohort ids for this program
    const { data: cohortData } = await supabase
      .from('cohorts')
      .select('id')
      .eq('program_id', programId)
    const cohortIds = ((cohortData as { id: string }[] | null) ?? []).map(c => c.id)

    if (cohortIds.length === 0) { setPerformance([]); setLoading(false); return }

    // Fetch all feedback for this program's cohorts
    const { data: feedbackData } = await supabase
      .from('session_feedback')
      .select('session_id, rating_mentor_clarity, rating_mentor_management, rating_mentor_engagement, rating_overall')
      .in('cohort_id', cohortIds)

    const feedback = (feedbackData as Pick<SessionFeedback,
      'session_id' | 'rating_mentor_clarity' | 'rating_mentor_management' | 'rating_mentor_engagement' | 'rating_overall'
    >[] | null) ?? []

    // Aggregate per mentor
    const mentorStats = new Map<string, {
      mentor: MentorProfile
      sessionIds: Set<string>
      clarity: number[]
      management: number[]
      engagement: number[]
      overall: number[]
    }>()

    for (const [mentorId, mentor] of mentorMap) {
      mentorStats.set(mentorId, {
        mentor,
        sessionIds: new Set(
          [...sessionMentorMap.entries()]
            .filter(([, m]) => m.id === mentorId)
            .map(([sid]) => sid)
        ),
        clarity: [], management: [], engagement: [], overall: [],
      })
    }

    for (const fb of feedback) {
      const mentor = sessionMentorMap.get(fb.session_id)
      if (!mentor) continue
      const stats = mentorStats.get(mentor.id)
      if (!stats) continue
      stats.clarity.push(fb.rating_mentor_clarity)
      stats.management.push(fb.rating_mentor_management)
      stats.engagement.push(fb.rating_mentor_engagement)
      stats.overall.push(fb.rating_overall)
    }

    const avg = (nums: number[]) => nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0

    const result: MentorPerformance[] = [...mentorStats.values()].map(s => ({
      mentor: s.mentor,
      sessionCount: s.sessionIds.size,
      feedbackCount: s.clarity.length,
      avgClarity: avg(s.clarity),
      avgManagement: avg(s.management),
      avgEngagement: avg(s.engagement),
      avgOverall: avg(s.overall),
    }))

    setPerformance(result.sort((a, b) => b.feedbackCount - a.feedbackCount))
    setLoading(false)
  }, [programId])

  useEffect(() => { refetch() }, [refetch])

  return { performance, loading, refetch }
}
