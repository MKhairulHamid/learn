import {
  createContext, useContext, useState, useEffect, useCallback,
} from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Cohort, CohortEnrollment, CohortLessonSchedule, Session } from '../types'

// Derived, UI-facing status for the user's current cohort relationship.
export type CohortStatus =
  | 'none'      // no enrollment record at all
  | 'pending'   // applied, awaiting admin approval
  | 'active'    // approved and within access window
  | 'expired'   // approved but access window has passed
  | 'rejected'  // application was rejected
  | 'removed'   // removed from the cohort by an admin

export type EnrollmentWithCohort = CohortEnrollment & { cohort: Cohort }

// Local date as yyyy-mm-dd (matches the `date` column format for lexical compare).
const todayStr = () => new Date().toLocaleDateString('en-CA')

interface CohortContextValue {
  loading: boolean
  isAdmin: boolean
  isEditor: boolean
  enrollment: EnrollmentWithCohort | null
  cohort: Cohort | null
  cohortId: string | null
  schedule: CohortLessonSchedule[]
  status: CohortStatus
  courseStarted: boolean
  isSessionAccessible: (s: Pick<Session, 'id' | 'session_number'>) => boolean
  getScheduleFor: (sessionId: string) => CohortLessonSchedule | undefined
  refetch: () => Promise<void>
}

const CohortContext = createContext<CohortContextValue | null>(null)

/**
 * Resolves the current user's cohort, enrollment status, and lesson schedule,
 * and exposes the lesson access rules:
 *   - Lesson 0 is open to pending + active members
 *   - other lessons need an active (non-expired) enrollment AND the lesson
 *     unlocked — by admin override, else by scheduled date
 *   - admins bypass every gate
 *
 * Provided once at the app root so every page shares a single fetch.
 */
export function CohortProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  // Mentors and admins bypass cohort gating so they can review/edit any lesson.
  const isEditor = profile?.role === 'admin' || profile?.role === 'mentor'

  const [enrollment, setEnrollment] = useState<EnrollmentWithCohort | null>(null)
  const [schedule, setSchedule] = useState<CohortLessonSchedule[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCohort = useCallback(async () => {
    if (!user) { setEnrollment(null); setSchedule([]); setLoading(false); return }
    setLoading(true)

    const loadEnrollments = () => supabase
      .from('cohort_enrollments')
      .select('*, cohort:cohorts(*)')
      .eq('user_id', user.id)

    let { data } = await loadEnrollments()
    let rows = (data as EnrollmentWithCohort[] | null) ?? []

    // Auto-apply: a learner with no enrollment history is placed into the
    // cohort that currently has admission open (pending admin approval).
    // Skipped for admins, and for anyone who already has any enrollment
    // record (rejected/removed users do not get re-applied).
    if (rows.length === 0 && !isEditor) {
      const { data: open } = await supabase
        .from('cohorts')
        .select('id')
        .eq('admission_open', true)
        .limit(1)
        .maybeSingle()

      if (open) {
        await supabase.from('cohort_enrollments').insert({
          cohort_id: open.id,
          user_id: user.id,
          status: 'pending',
        })
        const reload = await loadEnrollments()
        data = reload.data
        rows = (data as EnrollmentWithCohort[] | null) ?? []
      }
    }

    if (rows.length === 0) {
      setEnrollment(null); setSchedule([]); setLoading(false); return
    }

    // Pick the "current" enrollment: active first, then pending, then the rest;
    // tie-break by most recent course start.
    const rank = (s: string) => (s === 'active' ? 0 : s === 'pending' ? 1 : 2)
    const current = [...rows].sort((a, b) => {
      if (rank(a.status) !== rank(b.status)) return rank(a.status) - rank(b.status)
      return new Date(b.cohort.course_start_at).getTime() -
             new Date(a.cohort.course_start_at).getTime()
    })[0]
    setEnrollment(current)

    const { data: sched } = await supabase
      .from('cohort_lesson_schedule')
      .select('*')
      .eq('cohort_id', current.cohort_id)
    setSchedule((sched as CohortLessonSchedule[] | null) ?? [])
    setLoading(false)
  }, [user, isEditor])

  useEffect(() => { fetchCohort() }, [fetchCohort])

  const cohort = enrollment?.cohort ?? null

  const status: CohortStatus = (() => {
    if (!enrollment) return 'none'
    if (enrollment.status === 'active') {
      if (enrollment.access_expires_at &&
          new Date(enrollment.access_expires_at) < new Date()) return 'expired'
      return 'active'
    }
    return enrollment.status as CohortStatus
  })()

  const courseStarted = cohort ? new Date(cohort.course_start_at) <= new Date() : false

  const getScheduleFor = useCallback(
    (sessionId: string) => schedule.find(s => s.session_id === sessionId),
    [schedule],
  )

  const isSessionAccessible = useCallback(
    (session: Pick<Session, 'id' | 'session_number'>): boolean => {
      if (isEditor) return true
      // Lesson 0 — orientation, open to pending + active members.
      if (session.session_number === '00') {
        return status === 'pending' || status === 'active'
      }
      // Every other lesson needs an active, non-expired enrollment.
      if (status !== 'active') return false
      const sched = getScheduleFor(session.id)
      if (!sched) return false                        // not part of this cohort's plan
      if (sched.unlock_override === true) return true  // admin force-opened
      if (sched.unlock_override === false) return false // admin force-locked
      return sched.scheduled_date <= todayStr()        // auto: unlocked once the date arrives
    },
    [isEditor, status, getScheduleFor],
  )

  const value: CohortContextValue = {
    loading,
    isAdmin,
    isEditor,
    enrollment,
    cohort,
    cohortId: cohort?.id ?? null,
    schedule,
    status,
    courseStarted,
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
