import { useState, useMemo } from 'react'
import {
  Users, UserCheck, Activity, TrendingUp, Star, MessageSquare, Award,
  Search, Download, ChevronDown, ChevronUp, AlertTriangle, MailCheck,
  CalendarDays, Target, Zap, Clock, GraduationCap,
} from 'lucide-react'
import { useCohortAdmin } from '../../hooks/useCohortAdmin'
import { useCohortInsights } from '../../hooks/useCohortInsights'
import type { CohortInsights, LearnerInsight, SessionInsight } from '../../hooks/useCohortInsights'

// Program → cohort drill-down: everything about how one batch is using
// the platform, from pre-approval through weekly activity.

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

const daysAgoMs = (days: number) => Date.now() - days * 86_400_000

const relative = (iso: string | null) => {
  if (!iso) return 'never'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

const selectCls =
  'px-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-white/10 text-sm text-gray-200 ' +
  'focus:outline-none focus:border-primary-500/50 min-w-[200px]'

const card = 'bg-[#111827] border border-white/[0.06] rounded-2xl p-5'

// ── Root ────────────────────────────────────────────────────────────

export function CohortInsightsPanel() {
  const { cohorts, loading: cohortsLoading } = useCohortAdmin()
  const [programId, setProgramId] = useState<string | null>(null)
  const [cohortId, setCohortId] = useState<string | null>(null)

  // Program options come from the cohort list itself, so unpublished
  // programs stay reachable here.
  const programs = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of cohorts) m.set(c.program_id, c.programName || 'Untitled program')
    return [...m.entries()].map(([id, name]) => ({ id, name }))
  }, [cohorts])

  const activeProgramId = programId ?? programs[0]?.id ?? null
  const cohortsInProgram = cohorts.filter(c => c.program_id === activeProgramId)
  const activeCohortId = cohortsInProgram.some(c => c.id === cohortId)
    ? cohortId
    : cohortsInProgram[0]?.id ?? null

  const { insights, loading } = useCohortInsights(activeCohortId)

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-200">Cohort Insights</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Pick a program and batch to see who joined, who showed up, and how they use the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Program</label>
          {cohortsLoading ? (
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <select
              value={activeProgramId ?? ''}
              onChange={e => { setProgramId(e.target.value || null); setCohortId(null) }}
              className={selectCls}
            >
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Cohort</label>
          {cohortsLoading ? (
            <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <select
              value={activeCohortId ?? ''}
              onChange={e => setCohortId(e.target.value || null)}
              className={selectCls}
            >
              {cohortsInProgram.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.activeCount} active
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading cohort insights…</div>
      ) : !insights ? (
        <div className="text-gray-500 text-sm py-12 text-center border border-dashed border-white/10 rounded-2xl">
          No cohort selected.
        </div>
      ) : (
        <CohortReport i={insights} />
      )}
    </div>
  )
}

// ── Report body ─────────────────────────────────────────────────────

function CohortReport({ i }: { i: CohortInsights }) {
  const { cohort, enrollment: e, engagement: g } = i
  const submitters = i.learners.filter(l => l.attempts > 0).length

  return (
    <div className="space-y-5">
      {/* Cohort header */}
      <div className={card}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <GraduationCap size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-primary-400 mb-0.5">{i.programName}</p>
              <h3 className="text-base font-semibold text-white">{cohort.name}</h3>
              <p className="text-xs text-gray-500">
                {fmtDate(cohort.course_start_at)} → {fmtDate(cohort.course_close_at)}
                {' · '}{i.sessions.length} lessons
                {cohort.max_seats ? ` · ${e.active}/${cohort.max_seats} seats (${e.seatsPct}%)` : ''}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip on={cohort.is_published} onLabel="Published" offLabel="Draft" />
            <Chip on={cohort.admission_open} onLabel="Admission open" offLabel="Admission closed" />
            <Chip on={cohort.auto_approve_signups} onLabel="Auto-approve" offLabel="Manual approve" />
          </div>
        </div>
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Active learners" value={e.active} icon={<Users size={16} />} color="blue"
          sub={`${e.pending} pending · ${e.essential} essential / ${e.extended} extended`} />
        <Kpi label="Active last 7 days" value={g.active7} icon={<Activity size={16} />} color="green"
          sub={e.active ? `${pct(g.active7, e.active)}% of the batch` : '—'} />
        <Kpi label="Avg curriculum done" value={`${g.completionPct}%`} icon={<TrendingUp size={16} />}
          color="purple" sub={`${g.avgSessions} lessons per learner`} />
        <Kpi label="Avg session rating"
          value={i.feedback.avgOverall ? i.feedback.avgOverall.toFixed(1) : '—'}
          icon={<Star size={16} />} color="yellow"
          sub={`${i.feedback.count} responses from ${i.feedback.responders} learners`} />
      </div>

      {/* Funnel */}
      <div className={card}>
        <SectionTitle icon={<Target size={14} />} title="Registration → engagement funnel"
          hint="Where people fall out between paying, signing up, and actually learning." />
        <Funnel steps={[
          { label: 'Pre-approved', value: i.preapproved.total, hint: 'on the paid list' },
          { label: 'Signed up', value: i.preapproved.registered, hint: 'account created' },
          { label: 'Enrolled active', value: e.active, hint: `${e.organic} joined outside the list` },
          { label: 'Ever opened', value: g.everActive, hint: 'any tracked activity' },
          { label: 'Started learning', value: e.active - g.neverStarted, hint: '≥1 lesson done' },
          { label: 'Finished', value: g.finishers, hint: 'full tier curriculum' },
        ]} />
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`${card} lg:col-span-2`}>
          <SectionTitle icon={<CalendarDays size={14} />} title="Daily activity — last 30 days"
            hint="Tracked events (lesson completions, exercise runs, logins) and unique learners per day." />
          <DailyChart i={i} />
        </div>
        <div className={card}>
          <SectionTitle icon={<Clock size={14} />} title="When they study"
            hint="Events by hour of day, your local time." />
          <HourChart hourly={i.hourly} />
          <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2">
            {i.actionMix.slice(0, 5).map(a => (
              <div key={a.type} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{a.type.replace(/_/g, ' ')}</span>
                <span className="text-gray-200 font-medium">{a.count.toLocaleString()}</span>
              </div>
            ))}
            {i.actionMix.length === 0 && (
              <p className="text-xs text-gray-500">No activity logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Participation mix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniStat icon={<Zap size={14} />} label="Exercise submissions"
          value={i.learners.reduce((a, l) => a + l.attempts, 0)}
          sub={submitters > 0 ? `${submitters} learners submitted` : 'nobody submitted yet'} />
        <MiniStat icon={<MessageSquare size={14} />} label="Discussion posts"
          value={i.discussion.posts} sub={`${i.discussion.participants} learners posted`} />
        <MiniStat icon={<UserCheck size={14} />} label="Live checkpoint answers"
          value={i.checkpoints.responses}
          sub={i.checkpoints.correctPct !== null
            ? `${i.checkpoints.correctPct}% correct · ${i.checkpoints.participants} learners`
            : 'no checkpoints run'} />
        <MiniStat icon={<Award size={14} />} label="Certificates issued"
          value={i.certificates} sub={`${g.finishers} finished the curriculum`} />
      </div>

      {/* Risk */}
      <RiskPanel i={i} />

      {/* Session funnel */}
      <div className={card}>
        <SectionTitle icon={<TrendingUp size={14} />} title="Lesson-by-lesson drop-off"
          hint="Completion is measured against the learners entitled to that lesson." />
        <SessionTable sessions={i.sessions} />
      </div>

      {/* Learners */}
      <LearnerTable learners={i.learners} cohortName={i.cohort.name} />

      {/* Pre-approved list */}
      <PreapprovedPanel i={i} />
    </div>
  )
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0)

// ── Small building blocks ───────────────────────────────────────────

function SectionTitle({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <h3 className="text-xs font-semibold text-gray-300">{title}</h3>
      </div>
      {hint && <p className="text-[11px] text-gray-500 mt-0.5">{hint}</p>}
    </div>
  )
}

function Chip({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
      on ? 'bg-green-950/50 text-green-400 border-green-900'
         : 'bg-gray-800 text-gray-400 border-gray-700'
    }`}>
      {on ? onLabel : offLabel}
    </span>
  )
}

const kpiColors = {
  blue:   'bg-blue-950/40 border-blue-900 text-blue-400',
  green:  'bg-green-950/40 border-green-900 text-green-400',
  yellow: 'bg-yellow-950/40 border-yellow-900 text-yellow-400',
  purple: 'bg-purple-950/40 border-purple-900 text-purple-400',
}

function Kpi({ label, value, sub, icon, color }: {
  label: string; value: string | number; sub?: string
  icon: React.ReactNode; color: keyof typeof kpiColors
}) {
  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-[11px] text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center ${kpiColors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function MiniStat({ icon, label, value, sub }: {
  icon: React.ReactNode; label: string; value: number; sub: string
}) {
  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
    </div>
  )
}

// ── Funnel ──────────────────────────────────────────────────────────

function Funnel({ steps }: { steps: { label: string; value: number; hint: string }[] }) {
  const top = Math.max(...steps.map(s => s.value), 1)
  return (
    <div className="space-y-2.5">
      {steps.map((s, idx) => {
        const prev = idx > 0 ? steps[idx - 1].value : null
        const drop = prev !== null && prev > 0 ? prev - s.value : 0
        return (
          <div key={s.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-300">
                {s.label} <span className="text-gray-600">· {s.hint}</span>
              </span>
              <span className="text-gray-200 font-semibold tabular-nums">
                {s.value}
                {prev !== null && drop > 0 && (
                  <span className="ml-2 text-[11px] font-normal text-red-400">−{drop}</span>
                )}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-primary-500/80 transition-all"
                style={{ width: `${Math.max(2, (s.value / top) * 100)}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Charts ──────────────────────────────────────────────────────────

function DailyChart({ i }: { i: CohortInsights }) {
  const max = Math.max(...i.daily.map(d => d.events), 1)
  const totalEvents = i.daily.reduce((a, d) => a + d.events, 0)
  const peak = i.daily.reduce((a, d) => (d.events > a.events ? d : a), i.daily[0])

  return (
    <div>
      <div className="flex items-end gap-[3px] h-32">
        {i.daily.map(d => (
          <div key={d.date} className="flex-1 group relative flex flex-col justify-end h-full">
            <div
              className={`w-full rounded-t transition-colors ${
                d.events > 0 ? 'bg-primary-500/70 group-hover:bg-primary-400' : 'bg-white/[0.04]'
              }`}
              style={{ height: `${Math.max(2, (d.events / max) * 100)}%` }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block
                            whitespace-nowrap rounded-lg bg-[#0a0e1a] border border-white/10 px-2 py-1 text-[10px] text-gray-200 z-10">
              {d.date}: {d.events} events · {d.users} learners
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500">
        <span>{i.daily[0]?.date}</span>
        <span>
          {totalEvents.toLocaleString()} events in 30 days
          {peak && peak.events > 0 && ` · peak ${peak.events} on ${peak.date}`}
        </span>
        <span>{i.daily[i.daily.length - 1]?.date}</span>
      </div>
    </div>
  )
}

function HourChart({ hourly }: { hourly: number[] }) {
  const max = Math.max(...hourly, 1)
  return (
    <div>
      <div className="flex items-end gap-[2px] h-20">
        {hourly.map((n, h) => (
          <div key={h} className="flex-1 group relative flex flex-col justify-end h-full">
            <div className={`w-full rounded-t ${n > 0 ? 'bg-amber-500/60' : 'bg-white/[0.04]'}`}
              style={{ height: `${Math.max(2, (n / max) * 100)}%` }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block
                            whitespace-nowrap rounded-lg bg-[#0a0e1a] border border-white/10 px-2 py-1 text-[10px] text-gray-200 z-10">
              {String(h).padStart(2, '0')}:00 — {n}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
        <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
      </div>
    </div>
  )
}

// ── Risk panel ──────────────────────────────────────────────────────

function RiskPanel({ i }: { i: CohortInsights }) {
  const groups = useMemo(() => {
    const active = i.learners.filter(l => l.status === 'active')
    const cutoff = daysAgoMs(14)
    return [
      {
        label: 'Never opened the platform', tone: 'text-red-400',
        rows: active.filter(l => !l.lastActive),
      },
      {
        label: 'Signed in, no lesson finished', tone: 'text-amber-400',
        rows: active.filter(l => l.lastActive && l.sessionsCompleted === 0),
      },
      {
        label: 'Stalled 14+ days', tone: 'text-yellow-400',
        rows: active.filter(l => l.lastActive && l.sessionsCompleted > 0 &&
          new Date(l.lastActive).getTime() < cutoff),
      },
    ].filter(gr => gr.rows.length > 0)
  }, [i.learners])

  if (groups.length === 0) {
    return (
      <div className={card}>
        <SectionTitle icon={<AlertTriangle size={14} />} title="Needs attention" />
        <p className="text-xs text-gray-500">Every active learner has opened the platform recently. Nothing flagged.</p>
      </div>
    )
  }

  return (
    <div className={card}>
      <SectionTitle icon={<AlertTriangle size={14} />} title="Needs attention"
        hint="Active enrollments that are not converting into usage." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups.map(gr => (
          <div key={gr.label} className="bg-[#0a0e1a] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[11px] text-gray-400">{gr.label}</p>
              <span className={`text-lg font-bold ${gr.tone}`}>{gr.rows.length}</span>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {gr.rows.slice(0, 20).map(l => (
                <div key={l.userId} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-gray-300 truncate">{l.name}</span>
                  <span className="text-gray-600 shrink-0">{relative(l.lastActive)}</span>
                </div>
              ))}
              {gr.rows.length > 20 && (
                <p className="text-[11px] text-gray-600">+{gr.rows.length - 20} more</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Session table ───────────────────────────────────────────────────

function SessionTable({ sessions }: { sessions: SessionInsight[] }) {
  if (sessions.length === 0) {
    return <p className="text-xs text-gray-500">This program has no lessons yet.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500 border-b border-white/[0.06]">
            <th className="text-left font-medium py-2 pr-3">Lesson</th>
            <th className="text-left font-medium py-2 px-3">Scheduled</th>
            <th className="text-right font-medium py-2 px-3">Completed</th>
            <th className="text-left font-medium py-2 px-3 w-40">Progress</th>
            <th className="text-right font-medium py-2 px-3">Submissions</th>
            <th className="text-right font-medium py-2 px-3">Pass rate</th>
            <th className="text-right font-medium py-2 pl-3">Rating</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.sessionId} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
              <td className="py-2 pr-3">
                <span className="text-gray-500 mr-1.5">{s.number}</span>
                <span className="text-gray-200">{s.title}</span>
                {s.isExtension && (
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-purple-950/50 text-purple-400 border border-purple-900">
                    Extended
                  </span>
                )}
              </td>
              <td className="py-2 px-3 text-gray-500">
                {s.scheduledDate ? fmtDate(s.scheduledDate) : '—'}
              </td>
              <td className="py-2 px-3 text-right text-gray-300 tabular-nums">
                {s.completions}<span className="text-gray-600">/{s.audience}</span>
              </td>
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      s.completionPct >= 70 ? 'bg-green-500'
                      : s.completionPct >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${Math.min(100, s.completionPct)}%` }} />
                  </div>
                  <span className="text-gray-400 tabular-nums w-9 text-right">{s.completionPct}%</span>
                </div>
              </td>
              <td className="py-2 px-3 text-right text-gray-300 tabular-nums">
                {s.attempts}
                {s.learnersAttempting > 0 && (
                  <span className="text-gray-600"> · {s.learnersAttempting}p</span>
                )}
              </td>
              <td className="py-2 px-3 text-right tabular-nums">
                {s.attempts > 0 ? (
                  <span className={
                    s.passRate >= 70 ? 'text-green-400'
                    : s.passRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                  }>{s.passRate}%</span>
                ) : <span className="text-gray-600">—</span>}
              </td>
              <td className="py-2 pl-3 text-right tabular-nums">
                {s.avgRating !== null ? (
                  <span className="text-gray-200">
                    {s.avgRating.toFixed(1)}
                    <span className="text-gray-600"> ({s.feedbackCount})</span>
                  </span>
                ) : <span className="text-gray-600">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Learner table ───────────────────────────────────────────────────

type SortKey = 'name' | 'sessionsCompleted' | 'passed' | 'attempts' | 'activeDays' | 'lastActive' | 'posts' | 'feedbackCount'

const csvCell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function exportLearners(rows: LearnerInsight[], cohortName: string) {
  const cols: [string, (l: LearnerInsight) => unknown][] = [
    ['Name', l => l.name],
    ['Email', l => l.email],
    ['Status', l => l.status],
    ['Tier', l => l.tier],
    ['Registered', l => l.registeredAt],
    ['Onboarded', l => l.onboarded],
    ['Lessons completed', l => l.sessionsCompleted],
    ['Exercise attempts', l => l.attempts],
    ['Exercises passed', l => l.passed],
    ['Feedback given', l => l.feedbackCount],
    ['Discussion posts', l => l.posts],
    ['Checkpoint answers', l => l.checkpointAnswers],
    ['Logins', l => l.logins],
    ['Active days', l => l.activeDays],
    ['Last active', l => l.lastActive],
    ['Certificate', l => l.hasCertificate],
  ]
  const lines = [
    cols.map(c => csvCell(c[0])).join(','),
    ...rows.map(l => cols.map(c => csvCell(c[1](l))).join(',')),
  ]
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${cohortName.replace(/[^\w-]+/g, '-').toLowerCase()}-learners.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function SortHeader({ k, label, align = 'right', sort, asc, onSort }: {
  k: SortKey; label: string; align?: 'left' | 'right'
  sort: SortKey; asc: boolean; onSort: (k: SortKey) => void
}) {
  return (
    <th className={`font-medium py-2 px-3 ${align === 'left' ? 'text-left' : 'text-right'}`}>
      <button onClick={() => onSort(k)}
        className={`cursor-pointer inline-flex items-center gap-1 hover:text-gray-300 ${
          sort === k ? 'text-primary-400' : ''
        }`}>
        {label}
        {sort === k && (asc ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}
      </button>
    </th>
  )
}

function LearnerTable({ learners, cohortName }: { learners: LearnerInsight[]; cohortName: string }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('sessionsCompleted')
  const [asc, setAsc] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('active')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const filtered = learners.filter(l =>
      (statusFilter === 'all' || l.status === statusFilter) &&
      (!needle ||
        l.name.toLowerCase().includes(needle) ||
        (l.email ?? '').toLowerCase().includes(needle)))

    return [...filtered].sort((a, b) => {
      let d: number
      if (sort === 'name') d = a.name.localeCompare(b.name)
      else if (sort === 'lastActive') {
        d = (a.lastActive ? new Date(a.lastActive).getTime() : 0)
          - (b.lastActive ? new Date(b.lastActive).getTime() : 0)
      } else d = (a[sort] as number) - (b[sort] as number)
      return asc ? d : -d
    })
  }, [learners, q, sort, asc, statusFilter])

  const toggleSort = (key: SortKey) => {
    if (sort === key) setAsc(a => !a)
    else { setSort(key); setAsc(key === 'name') }
  }

  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <h3 className="text-xs font-semibold text-gray-300">Learner activity</h3>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {rows.length} of {learners.length} enrollments · click a column to sort
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className={`${selectCls} min-w-0`}>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="removed">Removed</option>
            <option value="all">All statuses</option>
          </select>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or email"
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-white/10 text-sm text-gray-200
                         placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 w-52" />
          </div>
          <button onClick={() => exportLearners(rows, cohortName)}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-750">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-gray-500 py-6 text-center">No learners match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-white/[0.06]">
                <SortHeader k="name" label="Learner" align="left" sort={sort} asc={asc} onSort={toggleSort} />
                <th className="font-medium py-2 px-3 text-left">Tier</th>
                <SortHeader k="sessionsCompleted" label="Lessons" sort={sort} asc={asc} onSort={toggleSort} />
                <SortHeader k="passed" label="Passed" sort={sort} asc={asc} onSort={toggleSort} />
                <SortHeader k="attempts" label="Attempts" sort={sort} asc={asc} onSort={toggleSort} />
                <SortHeader k="feedbackCount" label="Feedback" sort={sort} asc={asc} onSort={toggleSort} />
                <SortHeader k="posts" label="Posts" sort={sort} asc={asc} onSort={toggleSort} />
                <SortHeader k="activeDays" label="Active days" sort={sort} asc={asc} onSort={toggleSort} />
                <SortHeader k="lastActive" label="Last active" sort={sort} asc={asc} onSort={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {rows.map(l => (
                <tr key={l.userId} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-200">{l.name}</span>
                      {l.hasCertificate && <Award size={11} className="text-amber-400" />}
                      {!l.onboarded && (
                        <span className="text-[10px] text-gray-600">no onboarding</span>
                      )}
                    </div>
                    {l.email && <p className="text-[11px] text-gray-600">{l.email}</p>}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                      l.tier === 'extended'
                        ? 'bg-purple-950/50 text-purple-400 border-purple-900'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>{l.tier}</span>
                    {l.status !== 'active' && (
                      <span className="ml-1.5 text-[10px] text-amber-400">{l.status}</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-gray-200">{l.sessionsCompleted}</td>
                  <td className="py-2 px-3 text-right tabular-nums text-green-400">{l.passed}</td>
                  <td className="py-2 px-3 text-right tabular-nums text-gray-400">{l.attempts}</td>
                  <td className="py-2 px-3 text-right tabular-nums text-gray-400">{l.feedbackCount}</td>
                  <td className="py-2 px-3 text-right tabular-nums text-gray-400">{l.posts}</td>
                  <td className="py-2 px-3 text-right tabular-nums text-gray-400">{l.activeDays}</td>
                  <td className={`py-2 px-3 text-right ${l.lastActive ? 'text-gray-400' : 'text-red-400'}`}>
                    {relative(l.lastActive)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Pre-approval list ───────────────────────────────────────────────

function PreapprovedPanel({ i }: { i: CohortInsights }) {
  const [open, setOpen] = useState(false)
  const { total, registered, enrolled, rows } = i.preapproved
  const missing = rows.filter(r => !r.registered)

  if (total === 0) {
    return (
      <div className={card}>
        <SectionTitle icon={<MailCheck size={14} />} title="Pre-approved list" />
        <p className="text-xs text-gray-500">
          No pre-approved emails for this cohort — everyone here enrolled through signup.
        </p>
      </div>
    )
  }

  return (
    <div className={card}>
      <SectionTitle icon={<MailCheck size={14} />} title="Pre-approved list"
        hint="Paid seats loaded ahead of time, and whether they turned into real accounts." />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <MiniNumber label="On the list" value={total} />
        <MiniNumber label="Signed up" value={registered} tone="text-green-400"
          sub={`${pct(registered, total)}% claimed`} />
        <MiniNumber label="Not signed up yet" value={total - registered} tone="text-amber-400"
          sub={`${enrolled} auto-enrolled`} />
      </div>

      {missing.length > 0 && (
        <>
          <button onClick={() => setOpen(o => !o)}
            className="cursor-pointer flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300">
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {open ? 'Hide' : 'Show'} {missing.length} unclaimed seat{missing.length !== 1 ? 's' : ''}
          </button>
          {open && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {missing.map(m => (
                <div key={m.email} className="bg-[#0a0e1a] border border-white/[0.06] rounded-lg px-3 py-2">
                  <p className="text-[11px] text-gray-300 truncate">{m.fullName || m.email}</p>
                  {m.fullName && <p className="text-[10px] text-gray-600 truncate">{m.email}</p>}
                  <span className="text-[10px] text-gray-500">{m.tier}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MiniNumber({ label, value, sub, tone = 'text-white' }: {
  label: string; value: number; sub?: string; tone?: string
}) {
  return (
    <div className="bg-[#0a0e1a] border border-white/[0.06] rounded-xl p-3">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-600">{sub}</p>}
    </div>
  )
}
