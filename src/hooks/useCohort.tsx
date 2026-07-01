import {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
} from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { addMonths, deriveStatus, isSessionAccessibleFor } from '../lib/cohortAccess'
import type { CohortStatus } from '../lib/cohortAccess'
import type { Cohort, CohortEnrollment, CohortLessonSchedule, Session } from '../types'

export type { CohortStatus } from '../lib/cohortAccess'

export type EnrollmentWithCohort = CohortEnrollment & { cohort: Cohort }

interface CohortContextValue {
  loading: boolean
  isAdmin: boolean
  isProgramManager: boolean
  isEditor: boolean
  enrollments: EnrollmentWithCohort[]
  enrolledProgramIds: string[]
  enrollment: EnrollmentWithCohort | null
  cohort: Cohort | null
  cohortId: string | null
  schedule: CohortLessonSchedule[]
  status: CohortStatus
  courseStarted: boolean
  activeProgramId: string | null
  setActiveProgram: (programId: string | null) => void
  isSessionAccessible: (s: Pick<Session, 'id' | 'session_number'>) => boolean
  getScheduleFor: (sessionId: string) => CohortLessonSchedule | undefined
  refetch: () => Promise<void>
}

const CohortContext = createContext<CohortContextValue | null>(null)

/**
 * Resolves the current user's cohort enrollments and lesson access rules.
 *
 * A learner may be enrolled in more than one program; `setActiveProgram`
 * selects which one this context resolves to (cohort, schedule, status).
 * With no active program set, it falls back to the best overall enrollment —
 * identical to the original single-program behavior.
 *
 * Provided once at the app root so every page shares a single fetch.
 */
export function CohortProvider({ children }: { children: ReactNode }) {
  const { user, profile, loading: authLoading } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const isProgramManager = profile?.role === 'program_manager'
  // Mentors, admins, and program managers bypass cohort gating.
  const isEditor = profile?.role === 'admin' || profile?.role === 'mentor' || isProgramManager

  const [enrollments, setEnrollments] = useState<EnrollmentWithCohort[]>([])
  const [schedule, setSchedule] = useState<CohortLessonSchedule[]>([])
  const [activeProgramId, setActiveProgram] = useState<string | null>(null)
  const [enrollLoading, setEnrollLoading] = useState(true)
  const [scheduleLoading, setScheduleLoading] = useState(true)

  const fetchCohort = useCallback(async () => {
    if (!user) { setEnrollments([]); setEnrollLoading(false); setScheduleLoading(false); return }
    setEnrollLoading(true)

    const loadEnrollments = () => supabase
      .from('cohort_enrollments')
      .select('*, cohort:cohorts(*)')
      .eq('user_id', user.id)

    let { data } = await loadEnrollments()
    let rows = (data as EnrollmentWithCohort[] | null) ?? []

    // Auto-apply: a learner with no enrollment history is placed into the
    // cohort that currently has admission open (pending admin approval).
    // Skipped for editors and for anyone who already has any enrollment record.
    if (rows.length === 0 && !isEditor) {
      const { data: open } = await supabase
        .from('cohorts')
        .select('id, auto_approve_signups, course_start_at, access_duration_months')
        .eq('admission_open', true)
        .limit(1)
        .maybeSingle()

      if (open) {
        const autoActive = open.auto_approve_signups
        const { error: insertError } = await supabase.from('cohort_enrollments').insert({
          cohort_id: open.id,
          user_id: user.id,
          status: autoActive ? 'active' : 'pending',
          ...(autoActive && {
            approved_at: new Date().toISOString(),
            access_expires_at: addMonths(open.course_start_at, open.access_duration_months),
          }),
        })
        if (insertError) {
          // Could be a duplicate (race between two tabs) — reload regardless
          // so we pick up any existing enrollment rather than staying empty.
          console.warn('[CohortProvider] auto-enroll insert failed:', insertError.message)
        }
        const reload = await loadEnrollments()
        data = reload.data
        rows = (data as EnrollmentWithCohort[] | null) ?? []
      }
    }

    setEnrollments(rows)
    setEnrollLoading(false)
  }, [user, isEditor])

  // Don't run until auth has fully resolved — otherwise profile?.role is
  // still null and isEditor is false, which causes admins/mentors/PMs to
  // get incorrectly auto-enrolled as pending students.
  useEffect(() => {
    if (authLoading) return
    fetchCohort()
  }, [authLoading, fetchCohort])

  // The "current" enrollment: prefer the active program's enrollment, else the
  // best overall (active > pending > the rest; tie-break by most recent start).
  const enrollment = useMemo<EnrollmentWithCohort | null>(() => {
    if (enrollments.length === 0) return null
    const rank = (s: string) => (s === 'active' ? 0 : s === 'pending' ? 1 : 2)
    const sorted = [...enrollments].sort((a, b) => {
      if (rank(a.status) !== rank(b.status)) return rank(a.status) - rank(b.status)
      return new Date(b.cohort.course_start_at).getTime() -
             new Date(a.cohort.course_start_at).getTime()
    })
    if (activeProgramId) {
      const forProgram = sorted.filter(e => e.cohort.program_id === activeProgramId)
      if (forProgram.length) return forProgram[0]
    }
    return sorted[0]
  }, [enrollments, activeProgramId])

  // Load the lesson schedule for whichever cohort is currently resolved.
  useEffect(() => {
    let cancelled = false
    const cohortId = enrollment?.cohort_id
    if (!cohortId) { setSchedule([]); setScheduleLoading(false); return }
    setScheduleLoading(true)
    supabase
      .from('cohort_lesson_schedule')
      .select('*')
      .eq('cohort_id', cohortId)
      .then(({ data }) => {
        if (cancelled) return
        setSchedule((data as CohortLessonSchedule[] | null) ?? [])
        setScheduleLoading(false)
      })
    return () => { cancelled = true }
  }, [enrollment?.cohort_id])

  const cohort = enrollment?.cohort ?? null
  const status: CohortStatus = enrollment ? deriveStatus(enrollment) : 'none'
  const courseStarted = cohort ? new Date(cohort.course_start_at) <= new Date() : false

  const enrolledProgramIds = useMemo(() => {
    const ids = new Set<string>()
    for (const e of enrollments) {
      const st = deriveStatus(e)
      if (st === 'active' || st === 'pending' || st === 'expired') ids.add(e.cohort.program_id)
    }
    return [...ids]
  }, [enrollments])

  const getScheduleFor = useCallback(
    (sessionId: string) => schedule.find(s => s.session_id === sessionId),
    [schedule],
  )

  const isSessionAccessible = useCallback(
    (session: Pick<Session, 'id' | 'session_number'>): boolean => {
      if (isEditor) return true
      return isSessionAccessibleFor(session, status, schedule)
    },
    [isEditor, status, schedule],
  )

  const value: CohortContextValue = {
    loading: enrollLoading || scheduleLoading,
    isAdmin,
    isProgramManager,
    isEditor,
    enrollments,
    enrolledProgramIds,
    enrollment,
    cohort,
    cohortId: cohort?.id ?? null,
    schedule,
    status,
    courseStarted,
    activeProgramId,
    setActiveProgram,
    isSessionAccessible,
    getScheduleFor,
    refetch: fetchCohort,
  }

  return <CohortContext.Provider value={value}>{children}</CohortContext.Provider>
}

export function useCohort() {
  const ctx = useContext(CohortContext)
  if (!ctx) throw new Error('useCohort must be used within CohortProvider')
  return ctx
}
