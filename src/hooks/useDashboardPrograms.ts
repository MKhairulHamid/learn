import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { deriveStatus, isSessionAccessibleFor } from '../lib/cohortAccess'
import type { CohortStatus } from '../lib/cohortAccess'
import type {
  Cohort, CohortEnrollment, CohortLessonSchedule, CohortSessionProgress,
  Phase, Program, Session,
} from '../types'

type EnrollmentWithCohort = CohortEnrollment & { cohort: Cohort }
type PhaseWithSessions = Phase & { sessions: Session[] }

export interface EnrolledProgram {
  program: Program
  cohort: Cohort
  status: CohortStatus
  courseStarted: boolean
  phases: PhaseWithSessions[]
  schedule: CohortLessonSchedule[]
  completedSessionIds: Set<string>
  totalSessions: number
  completedCount: number
  currentPhase: PhaseWithSessions | null
  nextSession: Session | null
  recent: { session: Session; completedAt: string }[]
}

export interface AvailableProgram {
  program: Program
  openCohort: Cohort | null
  enrollable: boolean
}

/**
 * Dashboard data, grouped by program.
 *
 * `enrolled` lists every program the user has an active/pending/expired
 * relationship with (each carries its own progress, next lesson, and recent
 * activity). `available` lists the remaining published programs, marking which
 * can be enrolled into right now (a published cohort with admission open).
 */
export function useDashboardPrograms() {
  const { user, profile } = useAuth()
  const isEditor = profile?.role === 'admin' || profile?.role === 'mentor'

  const [programs, setPrograms] = useState<Program[]>([])
  const [enrolled, setEnrolled] = useState<EnrolledProgram[]>([])
  const [available, setAvailable] = useState<AvailableProgram[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!user) { setPrograms([]); setEnrolled([]); setAvailable([]); setLoading(false); return }
    setLoading(true)

    const [{ data: progData }, { data: enrData }, { data: openData }] = await Promise.all([
      supabase.from('programs').select('*').eq('is_published', true).order('order_num'),
      supabase.from('cohort_enrollments').select('*, cohort:cohorts(*)').eq('user_id', user.id),
      supabase.from('cohorts').select('*').eq('is_published', true).eq('admission_open', true),
    ])

    const allPrograms = (progData as Program[] | null) ?? []
    const enrollments = (enrData as EnrollmentWithCohort[] | null) ?? []
    const openCohorts = (openData as Cohort[] | null) ?? []
    setPrograms(allPrograms)

    // Best enrollment per program (active > pending > expired > rejected/removed).
    const rank = (s: CohortStatus) =>
      s === 'active' ? 0 : s === 'pending' ? 1 : s === 'expired' ? 2 : 3
    const bestByProgram = new Map<string, { enr: EnrollmentWithCohort; status: CohortStatus }>()
    for (const e of enrollments) {
      if (!e.cohort) continue
      const status = deriveStatus(e)
      const prev = bestByProgram.get(e.cohort.program_id)
      if (!prev || rank(status) < rank(prev.status)) {
        bestByProgram.set(e.cohort.program_id, { enr: e, status })
      }
    }

    const enrolledEntries = allPrograms
      .map(p => ({ program: p, best: bestByProgram.get(p.id) }))
      .filter((x): x is { program: Program; best: { enr: EnrollmentWithCohort; status: CohortStatus } } =>
        !!x.best && ['active', 'pending', 'expired'].includes(x.best.status))

    const enrolledProgramIds = enrolledEntries.map(x => x.program.id)
    const enrolledCohortIds = enrolledEntries.map(x => x.best.enr.cohort.id)

    const phasesByProgram = new Map<string, PhaseWithSessions[]>()
    const schedByCohort = new Map<string, CohortLessonSchedule[]>()
    const progByCohort = new Map<string, CohortSessionProgress[]>()

    if (enrolledCohortIds.length > 0) {
      const [{ data: phaseData }, { data: schedData }, { data: progRows }] = await Promise.all([
        supabase.from('phases').select('*, sessions(*)').in('program_id', enrolledProgramIds),
        supabase.from('cohort_lesson_schedule').select('*').in('cohort_id', enrolledCohortIds),
        supabase.from('cohort_session_progress').select('*')
          .eq('user_id', user.id).in('cohort_id', enrolledCohortIds),
      ])

      for (const ph of (phaseData as PhaseWithSessions[] | null) ?? []) {
        const arr = phasesByProgram.get(ph.program_id) ?? []
        arr.push({ ...ph, sessions: [...(ph.sessions ?? [])].sort((a, b) => a.order_num - b.order_num) })
        phasesByProgram.set(ph.program_id, arr)
      }
      for (const arr of phasesByProgram.values()) arr.sort((a, b) => a.order_num - b.order_num)

      for (const s of (schedData as CohortLessonSchedule[] | null) ?? []) {
        const arr = schedByCohort.get(s.cohort_id) ?? []; arr.push(s); schedByCohort.set(s.cohort_id, arr)
      }
      for (const pr of (progRows as CohortSessionProgress[] | null) ?? []) {
        const arr = progByCohort.get(pr.cohort_id) ?? []; arr.push(pr); progByCohort.set(pr.cohort_id, arr)
      }
    }

    const enrolledResult: EnrolledProgram[] = enrolledEntries.map(({ program, best }) => {
      const { cohort } = best.enr
      const { status } = best
      const phases = phasesByProgram.get(program.id) ?? []
      const schedule = schedByCohort.get(cohort.id) ?? []
      const prog = progByCohort.get(cohort.id) ?? []

      const completedSet = new Set(prog.filter(p => p.completed).map(p => p.session_id))
      const allSessions = phases.flatMap(p => p.sessions)
      const sessionById = new Map(allSessions.map(s => [s.id, s]))

      const currentPhase = phases.find(p => p.sessions.some(s => !completedSet.has(s.id))) ?? phases[0] ?? null
      const nextSession = allSessions.find(s => !completedSet.has(s.id) && isSessionAccessibleFor(s, status, schedule)) ?? null

      const recent = prog
        .filter(p => p.completed && p.completed_at)
        .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
        .slice(0, 3)
        .map(p => ({ session: sessionById.get(p.session_id), completedAt: p.completed_at! }))
        .filter((r): r is { session: Session; completedAt: string } => !!r.session)

      return {
        program, cohort, status,
        courseStarted: new Date(cohort.course_start_at) <= new Date(),
        phases,
        schedule,
        completedSessionIds: completedSet,
        totalSessions: allSessions.length,
        completedCount: allSessions.filter(s => completedSet.has(s.id)).length,
        currentPhase,
        nextSession,
        recent,
      }
    })
    setEnrolled(enrolledResult)

    const enrolledProgramIdSet = new Set(enrolledProgramIds)
    const openByProgram = new Map<string, Cohort>()
    for (const c of openCohorts) if (!openByProgram.has(c.program_id)) openByProgram.set(c.program_id, c)

    setAvailable(
      allPrograms
        .filter(p => !enrolledProgramIdSet.has(p.id))
        .map(p => {
          const openCohort = openByProgram.get(p.id) ?? null
          return { program: p, openCohort, enrollable: !!openCohort && !isEditor }
        }),
    )

    setLoading(false)
  }, [user, isEditor])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Self-service application: places a pending enrollment in the open cohort.
  const enroll = useCallback(async (cohortId: string): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not signed in' }
    const { error } = await supabase.from('cohort_enrollments').insert({
      cohort_id: cohortId, user_id: user.id, status: 'pending',
    })
    if (!error) await fetchAll()
    return { error: error?.message ?? null }
  }, [user, fetchAll])

  return { programs, enrolled, available, loading, isEditor, enroll, refetch: fetchAll }
}
