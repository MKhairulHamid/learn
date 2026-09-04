import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Cohort, EnrollmentStatus, EnrollmentTier } from '../types'

// Everything the admin "Cohort Insights" tab needs, aggregated in one pass.
// The question this answers: how is this specific batch actually using the
// platform — who signed up, who showed up, and where do they drop off.

const DAY = 24 * 60 * 60 * 1000
const TREND_DAYS = 30

// ── Shapes ──────────────────────────────────────────────────────────

export interface LearnerInsight {
  userId: string
  name: string
  email: string | null
  status: EnrollmentStatus
  tier: EnrollmentTier
  appliedAt: string
  registeredAt: string | null
  onboarded: boolean
  sessionsCompleted: number
  attempts: number
  passed: number
  feedbackCount: number
  posts: number
  checkpointAnswers: number
  logins: number
  activeDays: number
  lastActive: string | null
  hasCertificate: boolean
}

export interface SessionInsight {
  sessionId: string
  number: string
  title: string
  order: number
  isExtension: boolean
  scheduledDate: string | null
  audience: number
  completions: number
  completionPct: number
  learnersAttempting: number
  attempts: number
  passRate: number
  feedbackCount: number
  avgRating: number | null
}

export interface PreapprovedRow {
  email: string
  fullName: string | null
  tier: EnrollmentTier
  registered: boolean
  enrolled: boolean
}

export interface DailyPoint { date: string; events: number; users: number }

export interface CohortInsights {
  cohort: Cohort
  programName: string

  preapproved: {
    total: number
    registered: number
    enrolled: number
    rows: PreapprovedRow[]
  }

  enrollment: {
    total: number
    active: number
    pending: number
    rejected: number
    removed: number
    essential: number
    extended: number
    seatsPct: number | null
    organic: number          // enrolled without being on the pre-approved list
  }

  engagement: {
    everActive: number
    active7: number
    active30: number
    dormant: number          // active once, but not in the last 14 days
    neverStarted: number     // zero sessions completed
    finishers: number        // completed every session for their tier
    avgSessions: number
    avgActiveDays: number
    completionPct: number    // avg progress against the tier curriculum
  }

  daily: DailyPoint[]
  hourly: number[]           // 24 buckets, learner-local browser time
  actionMix: { type: string; count: number }[]

  sessions: SessionInsight[]
  learners: LearnerInsight[]

  feedback: { count: number; responders: number; avgOverall: number | null; responsePct: number }
  discussion: { posts: number; participants: number }
  checkpoints: { responses: number; participants: number; correctPct: number | null }
  certificates: number
}

// ── Raw row types (local, minimal) ──────────────────────────────────

interface EnrollRow {
  user_id: string
  status: EnrollmentStatus
  enrollment_tier: EnrollmentTier
  applied_at: string
}
interface ProfileRow {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
  onboarding_completed_at: string | null
}
interface SessionRow {
  id: string
  session_number: string
  title_en: string
  order_num: number
  is_extension: boolean
}
interface LogRow { user_id: string; action_type: string; created_at: string }

const inc = <K,>(m: Map<K, number>, k: K, by = 1) => m.set(k, (m.get(k) ?? 0) + by)

// ── Hook ────────────────────────────────────────────────────────────

export function useCohortInsights(cohortId: string | null) {
  const [data, setData] = useState<CohortInsights | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!cohortId) { setData(null); setLoading(false); return }
    setLoading(true)

    // 1. Cohort + program, then the curriculum this cohort follows.
    const { data: cRow } = await supabase.from('cohorts').select('*').eq('id', cohortId).single()
    const cohort = cRow as Cohort | null
    if (!cohort) { setData(null); setLoading(false); return }

    const { data: programRow } = await supabase
      .from('programs').select('name_en').eq('id', cohort.program_id).single()

    const { data: phaseRows } = await supabase
      .from('phases').select('id').eq('program_id', cohort.program_id)
    const phaseIds = ((phaseRows ?? []) as { id: string }[]).map(p => p.id)

    // Same scoping as the cohort schedule editor: the program's phases plus
    // the shared orientation lesson, which has no phase.
    const sessionsQuery = phaseIds.length > 0
      ? supabase.from('sessions')
          .select('id, session_number, title_en, order_num, is_extension')
          .or(`phase_id.in.(${phaseIds.join(',')}),phase_id.is.null`)
          .order('order_num')
      : supabase.from('sessions')
          .select('id, session_number, title_en, order_num, is_extension')
          .is('phase_id', null).order('order_num')

    // 2. Everything scoped to this cohort, in parallel.
    const [
      { data: sessRows },
      { data: schedRows },
      { data: enrollRows },
      { data: preRows },
      { data: progressRows },
      { data: feedbackRows },
      { data: postRows },
      { data: checkpointRows },
      { data: certRows },
    ] = await Promise.all([
      sessionsQuery,
      supabase.from('cohort_lesson_schedule').select('session_id, scheduled_date').eq('cohort_id', cohortId),
      supabase.from('cohort_enrollments')
        .select('user_id, status, enrollment_tier, applied_at').eq('cohort_id', cohortId),
      supabase.from('cohort_preapproved_emails')
        .select('email, full_name, enrollment_tier').eq('cohort_id', cohortId),
      supabase.from('cohort_session_progress')
        .select('user_id, session_id, completed, completed_at').eq('cohort_id', cohortId),
      supabase.from('session_feedback')
        .select('user_id, session_id, rating_overall').eq('cohort_id', cohortId),
      supabase.from('discussion_posts').select('user_id').eq('cohort_id', cohortId),
      supabase.from('checkpoint_responses').select('user_id, is_correct').eq('cohort_id', cohortId),
      supabase.from('certificates').select('user_id').eq('cohort_id', cohortId),
    ])

    const sessions = (sessRows as SessionRow[] | null) ?? []
    const sessionIds = sessions.map(s => s.id)
    const enrollments = (enrollRows as EnrollRow[] | null) ?? []
    const userIds = [...new Set(enrollments.map(e => e.user_id))]

    // 3. Per-learner sources that key off the enrolled user list.
    const [
      { data: profileRows },
      { data: logRows },
      { data: submissionRows },
      { data: exerciseRows },
    ] = await Promise.all([
      userIds.length
        ? supabase.from('profiles')
            .select('id, full_name, email, created_at, onboarding_completed_at').in('id', userIds)
        : Promise.resolve({ data: [] as ProfileRow[] }),
      userIds.length
        ? supabase.from('user_activity_logs')
            .select('user_id, action_type, created_at')
            .in('user_id', userIds)
            .order('created_at', { ascending: false })
            .limit(20000)
        : Promise.resolve({ data: [] as LogRow[] }),
      supabase.from('exercise_submissions')
        .select('user_id, exercise_id, passed').eq('cohort_id', cohortId),
      sessionIds.length
        ? supabase.from('exercises').select('id, session_id').in('session_id', sessionIds)
        : Promise.resolve({ data: [] as { id: string; session_id: string }[] }),
    ])

    const profiles = (profileRows as ProfileRow[] | null) ?? []
    const logs = (logRows as LogRow[] | null) ?? []
    const submissions = (submissionRows as { user_id: string; exercise_id: string; passed: boolean }[] | null) ?? []
    const exercises = (exerciseRows as { id: string; session_id: string }[] | null) ?? []
    const progress = (progressRows as { user_id: string; session_id: string; completed: boolean }[] | null) ?? []
    const feedback = (feedbackRows as { user_id: string; session_id: string; rating_overall: number }[] | null) ?? []
    const posts = (postRows as { user_id: string }[] | null) ?? []
    const checkpoints = (checkpointRows as { user_id: string; is_correct: boolean }[] | null) ?? []
    const certs = (certRows as { user_id: string }[] | null) ?? []
    const preapproved = (preRows as { email: string; full_name: string | null; enrollment_tier: EnrollmentTier }[] | null) ?? []

    const profileById = new Map(profiles.map(p => [p.id, p]))
    const exerciseSession = new Map(exercises.map(e => [e.id, e.session_id]))
    const scheduleBySession = new Map(
      ((schedRows as { session_id: string; scheduled_date: string }[] | null) ?? [])
        .map(s => [s.session_id, s.scheduled_date]),
    )

    // ── Enrollment breakdown ───────────────────────────────────────
    const byStatus = new Map<EnrollmentStatus, number>()
    const byTier = new Map<EnrollmentTier, number>()
    for (const e of enrollments) {
      inc(byStatus, e.status)
      if (e.status === 'active') inc(byTier, e.enrollment_tier)
    }
    const activeEnrollments = enrollments.filter(e => e.status === 'active')
    const activeCount = activeEnrollments.length
    const extendedCount = byTier.get('extended') ?? 0

    // ── Pre-approval funnel ────────────────────────────────────────
    const emailToUser = new Map(
      profiles.filter(p => p.email).map(p => [p.email!.toLowerCase(), p.id]),
    )
    // Registered-but-not-enrolled pre-approvals need a lookup beyond the
    // cohort roster, so resolve the remaining emails against profiles.
    const unmatched = preapproved
      .map(p => p.email.toLowerCase())
      .filter(e => !emailToUser.has(e))
    const { data: extraProfiles } = unmatched.length
      ? await supabase.from('profiles').select('id, email').in('email', unmatched)
      : { data: [] }
    const registeredEmails = new Set([
      ...emailToUser.keys(),
      ...(((extraProfiles ?? []) as { email: string | null }[])
        .map(p => (p.email ?? '').toLowerCase())),
    ])
    const enrolledUserIds = new Set(enrollments.map(e => e.user_id))

    const preRowsOut: PreapprovedRow[] = preapproved.map(p => {
      const email = p.email.toLowerCase()
      const uid = emailToUser.get(email)
      return {
        email,
        fullName: p.full_name,
        tier: p.enrollment_tier,
        registered: registeredEmails.has(email),
        enrolled: !!uid && enrolledUserIds.has(uid),
      }
    }).sort((a, b) => Number(a.registered) - Number(b.registered) || a.email.localeCompare(b.email))

    const preapprovedEmailSet = new Set(preRowsOut.map(p => p.email))
    const organic = enrollments.filter(e => {
      const em = profileById.get(e.user_id)?.email?.toLowerCase()
      return !em || !preapprovedEmailSet.has(em)
    }).length

    // ── Per-learner rollups ────────────────────────────────────────
    const sessionsDone = new Map<string, number>()
    const doneSessionsByUser = new Map<string, Set<string>>()
    for (const p of progress) {
      if (!p.completed) continue
      inc(sessionsDone, p.user_id)
      if (!doneSessionsByUser.has(p.user_id)) doneSessionsByUser.set(p.user_id, new Set())
      doneSessionsByUser.get(p.user_id)!.add(p.session_id)
    }

    const attemptsByUser = new Map<string, number>()
    const passedByUser = new Map<string, number>()
    const passedExerciseByUser = new Map<string, Set<string>>()
    for (const s of submissions) {
      inc(attemptsByUser, s.user_id)
      if (s.passed) {
        if (!passedExerciseByUser.has(s.user_id)) passedExerciseByUser.set(s.user_id, new Set())
        passedExerciseByUser.get(s.user_id)!.add(s.exercise_id)
      }
    }
    for (const [uid, set] of passedExerciseByUser) passedByUser.set(uid, set.size)

    const feedbackByUser = new Map<string, number>()
    for (const f of feedback) inc(feedbackByUser, f.user_id)
    const postsByUser = new Map<string, number>()
    for (const p of posts) inc(postsByUser, p.user_id)
    const checkpointByUser = new Map<string, number>()
    for (const c of checkpoints) inc(checkpointByUser, c.user_id)
    const certUsers = new Set(certs.map(c => c.user_id))

    const loginsByUser = new Map<string, number>()
    const lastActiveByUser = new Map<string, string>()
    const activeDaysByUser = new Map<string, Set<string>>()
    const actionMix = new Map<string, number>()
    const hourly = new Array(24).fill(0) as number[]
    const dayEvents = new Map<string, number>()
    const dayUsers = new Map<string, Set<string>>()

    const now = Date.now()
    const trendStart = now - (TREND_DAYS - 1) * DAY
    for (const l of logs) {
      const t = new Date(l.created_at)
      if (l.action_type === 'login') inc(loginsByUser, l.user_id)
      if (!lastActiveByUser.has(l.user_id)) lastActiveByUser.set(l.user_id, l.created_at)
      const day = t.toLocaleDateString('en-CA')
      if (!activeDaysByUser.has(l.user_id)) activeDaysByUser.set(l.user_id, new Set())
      activeDaysByUser.get(l.user_id)!.add(day)
      inc(actionMix, l.action_type)
      hourly[t.getHours()] += 1
      if (t.getTime() >= trendStart) {
        inc(dayEvents, day)
        if (!dayUsers.has(day)) dayUsers.set(day, new Set())
        dayUsers.get(day)!.add(l.user_id)
      }
    }

    const learners: LearnerInsight[] = enrollments.map(e => {
      const p = profileById.get(e.user_id)
      return {
        userId: e.user_id,
        name: p?.full_name ?? p?.email ?? 'Unknown learner',
        email: p?.email ?? null,
        status: e.status,
        tier: e.enrollment_tier,
        appliedAt: e.applied_at,
        registeredAt: p?.created_at ?? null,
        onboarded: !!p?.onboarding_completed_at,
        sessionsCompleted: sessionsDone.get(e.user_id) ?? 0,
        attempts: attemptsByUser.get(e.user_id) ?? 0,
        passed: passedByUser.get(e.user_id) ?? 0,
        feedbackCount: feedbackByUser.get(e.user_id) ?? 0,
        posts: postsByUser.get(e.user_id) ?? 0,
        checkpointAnswers: checkpointByUser.get(e.user_id) ?? 0,
        logins: loginsByUser.get(e.user_id) ?? 0,
        activeDays: activeDaysByUser.get(e.user_id)?.size ?? 0,
        lastActive: lastActiveByUser.get(e.user_id) ?? null,
        hasCertificate: certUsers.has(e.user_id),
      }
    }).sort((a, b) => b.sessionsCompleted - a.sessionsCompleted || a.name.localeCompare(b.name))

    // ── Engagement summary (active learners only) ──────────────────
    const activeLearners = learners.filter(l => l.status === 'active')
    const coreCount = sessions.filter(s => !s.is_extension).length
    const curriculumFor = (tier: EnrollmentTier) =>
      tier === 'extended' ? sessions.length : coreCount

    const since = (days: number) => now - days * DAY
    const wasActive = (l: LearnerInsight, days: number) =>
      !!l.lastActive && new Date(l.lastActive).getTime() >= since(days)

    const everActive = activeLearners.filter(l => l.lastActive).length
    const active7 = activeLearners.filter(l => wasActive(l, 7)).length
    const active30 = activeLearners.filter(l => wasActive(l, 30)).length
    const dormant = activeLearners.filter(l => l.lastActive && !wasActive(l, 14)).length
    const neverStarted = activeLearners.filter(l => l.sessionsCompleted === 0).length
    const finishers = activeLearners.filter(l => {
      const target = curriculumFor(l.tier)
      return target > 0 && l.sessionsCompleted >= target
    }).length
    const avg = (nums: number[]) => nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
    const completionPct = activeLearners.length
      ? Math.round(avg(activeLearners.map(l => {
          const target = curriculumFor(l.tier)
          return target > 0 ? Math.min(100, (l.sessionsCompleted / target) * 100) : 0
        })))
      : 0

    // ── Per-session funnel ─────────────────────────────────────────
    const completionsBySession = new Map<string, number>()
    for (const p of progress) if (p.completed) inc(completionsBySession, p.session_id)

    const subsBySession = new Map<string, { attempts: number; passed: number; users: Set<string> }>()
    for (const s of submissions) {
      const sid = exerciseSession.get(s.exercise_id)
      if (!sid) continue
      if (!subsBySession.has(sid)) subsBySession.set(sid, { attempts: 0, passed: 0, users: new Set() })
      const b = subsBySession.get(sid)!
      b.attempts += 1
      if (s.passed) b.passed += 1
      b.users.add(s.user_id)
    }

    const fbBySession = new Map<string, number[]>()
    for (const f of feedback) {
      if (!fbBySession.has(f.session_id)) fbBySession.set(f.session_id, [])
      fbBySession.get(f.session_id)!.push(f.rating_overall)
    }

    const sessionInsights: SessionInsight[] = sessions.map(s => {
      const audience = s.is_extension ? extendedCount : activeCount
      const completions = completionsBySession.get(s.id) ?? 0
      const sub = subsBySession.get(s.id)
      const ratings = fbBySession.get(s.id) ?? []
      return {
        sessionId: s.id,
        number: s.session_number,
        title: s.title_en,
        order: s.order_num,
        isExtension: s.is_extension,
        scheduledDate: scheduleBySession.get(s.id) ?? null,
        audience,
        completions,
        completionPct: audience > 0 ? Math.round((completions / audience) * 100) : 0,
        learnersAttempting: sub?.users.size ?? 0,
        attempts: sub?.attempts ?? 0,
        passRate: sub && sub.attempts > 0 ? Math.round((sub.passed / sub.attempts) * 100) : 0,
        feedbackCount: ratings.length,
        avgRating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
      }
    })

    // ── Daily trend (dense, so gaps read as gaps) ──────────────────
    const daily: DailyPoint[] = []
    for (let i = TREND_DAYS - 1; i >= 0; i--) {
      const date = new Date(now - i * DAY).toLocaleDateString('en-CA')
      daily.push({ date, events: dayEvents.get(date) ?? 0, users: dayUsers.get(date)?.size ?? 0 })
    }

    // ── Cross-cutting counters ─────────────────────────────────────
    const feedbackResponders = new Set(feedback.map(f => f.user_id)).size
    const ratedSessions = sessionInsights.filter(s => s.feedbackCount > 0)
    const scheduledCount = sessionInsights.filter(s => s.scheduledDate).length || sessions.length
    const correct = checkpoints.filter(c => c.is_correct).length

    setData({
      cohort,
      programName: (programRow as { name_en: string } | null)?.name_en ?? '',
      preapproved: {
        total: preRowsOut.length,
        registered: preRowsOut.filter(p => p.registered).length,
        enrolled: preRowsOut.filter(p => p.enrolled).length,
        rows: preRowsOut,
      },
      enrollment: {
        total: enrollments.length,
        active: activeCount,
        pending: byStatus.get('pending') ?? 0,
        rejected: byStatus.get('rejected') ?? 0,
        removed: byStatus.get('removed') ?? 0,
        essential: byTier.get('essential') ?? 0,
        extended: extendedCount,
        seatsPct: cohort.max_seats ? Math.round((activeCount / cohort.max_seats) * 100) : null,
        organic,
      },
      engagement: {
        everActive, active7, active30, dormant, neverStarted, finishers,
        avgSessions: Math.round(avg(activeLearners.map(l => l.sessionsCompleted)) * 10) / 10,
        avgActiveDays: Math.round(avg(activeLearners.map(l => l.activeDays)) * 10) / 10,
        completionPct,
      },
      daily,
      hourly,
      actionMix: [...actionMix.entries()]
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      sessions: sessionInsights,
      learners,
      feedback: {
        count: feedback.length,
        responders: feedbackResponders,
        avgOverall: ratedSessions.length
          ? feedback.reduce((a, f) => a + f.rating_overall, 0) / feedback.length
          : null,
        responsePct: activeCount > 0 && scheduledCount > 0
          ? Math.round((feedback.length / (activeCount * scheduledCount)) * 100)
          : 0,
      },
      discussion: { posts: posts.length, participants: new Set(posts.map(p => p.user_id)).size },
      checkpoints: {
        responses: checkpoints.length,
        participants: new Set(checkpoints.map(c => c.user_id)).size,
        correctPct: checkpoints.length ? Math.round((correct / checkpoints.length) * 100) : null,
      },
      certificates: certs.length,
    })
    setLoading(false)
  }, [cohortId])

  useEffect(() => { load() }, [load])

  return { insights: data, loading, refetch: load }
}
