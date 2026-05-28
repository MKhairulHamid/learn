import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft, Briefcase, Loader2, Save, Users, CalendarDays,
  BarChart2, UserCheck, ChevronDown, Check, X, Star,
  BookOpen, Clock, Eye, EyeOff,
} from 'lucide-react'
import {
  usePMProgramDetail,
  usePMSessions,
  usePMCohorts,
  usePMStudents,
  useMentorPerformance,
} from '../../hooks/useProgramManager'
import type { MentorProfile, SessionWithMentor } from '../../hooks/useProgramManager'
import type { CohortWithSchedule } from '../../hooks/useProgramManager'
import type { CohortEnrollment } from '../../types'
import { useAuth } from '../../context/AuthContext'

type Tab = 'details' | 'sessions' | 'cohorts' | 'students' | 'performance'

// ── Rating bar helper ────────────────────────────────────────────────

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-8 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

// ── Mentor selector dropdown ─────────────────────────────────────────

function MentorSelector({
  session,
  mentors,
  onAssign,
}: {
  session: SessionWithMentor
  mentors: MentorProfile[]
  onAssign: (sessionId: string, mentorId: string | null) => Promise<boolean>
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSelect = async (mentorId: string | null) => {
    setSaving(true)
    await onAssign(session.id, mentorId)
    setSaving(false)
    setOpen(false)
  }

  const currentName = session.mentor?.full_name ?? session.mentor?.username ?? null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={saving}
        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
      >
        {saving ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <UserCheck size={12} className={currentName ? 'text-primary-400' : 'text-gray-600'} />
        )}
        <span className={currentName ? 'text-gray-200' : 'text-gray-500'}>
          {currentName ?? 'Assign mentor'}
        </span>
        <ChevronDown size={10} className="text-gray-600" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 w-52 bg-[#0d1221] border border-white/[0.1] rounded-xl shadow-xl py-1">
          <button
            onClick={() => handleSelect(null)}
            className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-400 hover:bg-white/[0.06] transition-colors"
          >
            <X size={12} />
            Remove mentor
          </button>
          <div className="border-t border-white/[0.06] my-1" />
          {mentors.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-600">No mentors available</p>
          )}
          {mentors.map(m => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-300 hover:bg-white/[0.06] transition-colors"
            >
              {session.mentor_id === m.id && <Check size={12} className="text-primary-400" />}
              <span className={session.mentor_id === m.id ? 'ml-0' : 'ml-4'}>
                {m.full_name ?? m.username ?? m.id}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: Program Details ─────────────────────────────────────────────

function DetailsTab({ programId }: { programId: string }) {
  const { program, loading, saving, updateProgram } = usePMProgramDetail(programId)
  const [form, setForm] = useState<Record<string, string | boolean>>({})
  const [dirty, setDirty] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }))
    setDirty(true)
    setSuccess(false)
  }

  const val = (k: string, fallback: string | boolean): string | boolean =>
    k in form ? form[k] : (program as unknown as Record<string, string | boolean>)?.[k] ?? fallback

  const handleSave = async () => {
    const ok = await updateProgram(form as Parameters<typeof updateProgram>[0])
    if (ok) { setForm({}); setDirty(false); setSuccess(true) }
  }

  if (loading) return <Skeleton />

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name (EN)">
          <Input value={String(val('name_en', ''))} onChange={v => set('name_en', v)} />
        </Field>
        <Field label="Name (ID)">
          <Input value={String(val('name_id', ''))} onChange={v => set('name_id', v)} />
        </Field>
        <Field label="Description (EN)" className="sm:col-span-2">
          <Textarea value={String(val('description_en', ''))} onChange={v => set('description_en', v)} />
        </Field>
        <Field label="Description (ID)" className="sm:col-span-2">
          <Textarea value={String(val('description_id', ''))} onChange={v => set('description_id', v)} />
        </Field>
        <Field label="Icon (emoji)">
          <Input value={String(val('icon', ''))} onChange={v => set('icon', v)} />
        </Field>
        <Field label="Color (Tailwind gradient class)">
          <Input value={String(val('color', ''))} onChange={v => set('color', v)} />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => set('is_published', !val('is_published', program?.is_published ?? false))}
          className={`relative inline-flex h-5 w-9 rounded-full transition-colors cursor-pointer ${
            val('is_published', program?.is_published ?? false) ? 'bg-primary-600' : 'bg-gray-700'
          }`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            val('is_published', program?.is_published ?? false) ? 'translate-x-4' : ''
          }`} />
        </button>
        <span className="text-sm text-gray-300">Published</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save changes
        </button>
        {success && <span className="text-xs text-green-400">Saved!</span>}
      </div>
    </div>
  )
}

// ── Tab: Sessions & Mentors ──────────────────────────────────────────

function SessionsTab({ programId }: { programId: string }) {
  const { sessions, mentors, loading, assignMentor } = usePMSessions(programId)

  if (loading) return <Skeleton />

  const byPhase = sessions.reduce<Record<string, SessionWithMentor[]>>((acc, s) => {
    if (!acc[s.phaseName]) acc[s.phaseName] = []
    acc[s.phaseName].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <p className="text-xs text-gray-500">
        Each session can have one assigned mentor. Different sessions may have different mentors.
      </p>

      {Object.entries(byPhase).map(([phase, phaseSessions]) => (
        <div key={phase}>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{phase}</h3>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Session</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> Duration</span>
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Mentor</th>
                </tr>
              </thead>
              <tbody>
                {phaseSessions.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`${i !== phaseSessions.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-mono w-6 shrink-0">{s.session_number}</span>
                        <span className="text-gray-200 text-xs">{s.title_en}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {s.estimated_duration_minutes}m
                    </td>
                    <td className="px-4 py-3">
                      <MentorSelector session={s} mentors={mentors} onAssign={assignMentor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {sessions.length === 0 && (
        <p className="text-center py-12 text-gray-500 text-sm">No sessions found for this program.</p>
      )}
    </div>
  )
}

// ── Tab: Cohorts & Schedule ──────────────────────────────────────────

function CohortsTab({ programId }: { programId: string }) {
  const { cohorts, loading, updateCohort, upsertScheduleRow } = usePMCohorts(programId)
  const [selectedCohort, setSelectedCohort] = useState<CohortWithSchedule | null>(null)
  const { sessions } = usePMSessions(programId)

  if (loading) return <Skeleton />

  if (selectedCohort) {
    return (
      <ScheduleEditor
        cohort={selectedCohort}
        sessions={sessions}
        onBack={() => setSelectedCohort(null)}
        onUpsert={upsertScheduleRow}
      />
    )
  }

  return (
    <div className="space-y-4">
      {cohorts.length === 0 && (
        <p className="text-center py-12 text-gray-500 text-sm">No cohorts for this program yet.</p>
      )}
      {cohorts.map(c => {
        const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        return (
          <div key={c.id} className="rounded-xl border border-white/[0.06] bg-[#0d1221] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    c.is_published ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {c.is_published ? 'Published' : 'Draft'}
                  </span>
                  {c.admission_open && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-primary-500/10 text-primary-400">
                      Admissions open
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span><CalendarDays size={11} className="inline mr-1" />Starts {fmt(c.course_start_at)}</span>
                  <span>Ends {fmt(c.course_close_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateCohort(c.id, { is_published: !c.is_published })}
                  className="cursor-pointer p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
                  title={c.is_published ? 'Unpublish' : 'Publish'}
                >
                  {c.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => setSelectedCohort(c)}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-gray-300 hover:bg-white/[0.06] transition-colors"
                >
                  <CalendarDays size={12} />
                  Schedule
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span>{c.schedule.length} sessions scheduled</span>
              {c.max_seats && <span>· Max {c.max_seats} seats</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ScheduleEditor({
  cohort, sessions, onBack, onUpsert,
}: {
  cohort: CohortWithSchedule
  sessions: SessionWithMentor[]
  onBack: () => void
  onUpsert: (cohortId: string, sessionId: string, patch: Record<string, unknown>) => Promise<boolean>
}) {
  const scheduleMap = Object.fromEntries(cohort.schedule.map(s => [s.session_id, s]))
  const [saving, setSaving] = useState<string | null>(null)

  const handleDate = useCallback(async (sessionId: string, date: string) => {
    setSaving(sessionId)
    await onUpsert(cohort.id, sessionId, { scheduled_date: date ? new Date(date + 'T00:00:00').toISOString() : null })
    setSaving(null)
  }, [cohort.id, onUpsert])

  const handleZoom = useCallback(async (sessionId: string, link: string) => {
    setSaving(sessionId)
    await onUpsert(cohort.id, sessionId, { zoom_link: link || null })
    setSaving(null)
  }, [cohort.id, onUpsert])

  const handleRecording = useCallback(async (sessionId: string, url: string) => {
    setSaving(sessionId)
    await onUpsert(cohort.id, sessionId, { recording_url: url || null })
    setSaving(null)
  }, [cohort.id, onUpsert])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to cohorts
        </button>
        <span className="text-gray-600">·</span>
        <span className="text-sm font-medium text-white">{cohort.name}</span>
      </div>

      <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Session</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Date</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Zoom link</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Recording</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => {
              const row = scheduleMap[s.id]
              const dateVal = row?.scheduled_date
                ? new Date(row.scheduled_date).toISOString().slice(0, 10)
                : ''
              const isSaving = saving === s.id

              return (
                <tr key={s.id} className={i !== sessions.length - 1 ? 'border-b border-white/[0.04]' : ''}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-mono w-6 shrink-0">{s.session_number}</span>
                      <span className="text-xs text-gray-200">{s.title_en}</span>
                      {isSaving && <Loader2 size={11} className="animate-spin text-gray-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="date"
                      defaultValue={dateVal}
                      onBlur={e => handleDate(s.id, e.target.value)}
                      className="bg-transparent text-xs text-gray-300 border border-white/[0.08] rounded-md px-2 py-1 focus:outline-none focus:border-primary-500/50"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="url"
                      placeholder="https://zoom.us/…"
                      defaultValue={row?.zoom_link ?? ''}
                      onBlur={e => handleZoom(s.id, e.target.value)}
                      className="bg-transparent text-xs text-gray-300 border border-white/[0.08] rounded-md px-2 py-1 w-44 focus:outline-none focus:border-primary-500/50"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="url"
                      placeholder="Recording URL"
                      defaultValue={row?.recording_url ?? ''}
                      onBlur={e => handleRecording(s.id, e.target.value)}
                      className="bg-transparent text-xs text-gray-300 border border-white/[0.08] rounded-md px-2 py-1 w-44 focus:outline-none focus:border-primary-500/50"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Tab: Students ────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400',
  pending: 'bg-yellow-500/10 text-yellow-400',
  rejected: 'bg-red-500/10 text-red-400',
  removed: 'bg-gray-500/10 text-gray-400',
}

function StudentsTab({ programId }: { programId: string }) {
  const { profile } = useAuth()
  const { enrollments, loading, updateEnrollment } = usePMStudents(programId)
  const [filter, setFilter] = useState<CohortEnrollment['status'] | 'all'>('all')

  const filtered = filter === 'all' ? enrollments : enrollments.filter(e => e.status === filter)

  if (loading) return <Skeleton />

  const handleApprove = async (id: string) => {
    await updateEnrollment(id, {
      status: 'active',
      approved_by: profile?.id ?? null,
      approved_at: new Date().toISOString(),
    })
  }

  const handleReject = async (id: string) => {
    await updateEnrollment(id, { status: 'rejected', approved_by: profile?.id ?? null })
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-white/[0.06]">
        {(['all', 'active', 'pending', 'rejected', 'removed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`cursor-pointer px-3 py-2 text-xs font-medium border-b-2 transition-colors capitalize ${
              filter === s
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {s} {s === 'all' ? `(${enrollments.length})` : `(${enrollments.filter(e => e.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-12 text-gray-500 text-sm">No students found.</p>
      ) : (
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Student</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Cohort</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Applied</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className={i !== filtered.length - 1 ? 'border-b border-white/[0.04]' : ''}>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-200">
                      {e.profile?.full_name ?? e.profile?.username ?? e.user_id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{e.cohortName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[e.status] ?? ''}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(e.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    {e.status === 'pending' && (
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleApprove(e.id)}
                          className="cursor-pointer p-1 rounded-md text-green-400 hover:bg-green-500/10 transition-colors"
                          title="Approve"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => handleReject(e.id)}
                          className="cursor-pointer p-1 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Reject"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
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

// ── Tab: Mentor Performance ──────────────────────────────────────────

function PerformanceTab({ programId }: { programId: string }) {
  const { performance, loading } = useMentorPerformance(programId)

  if (loading) return <Skeleton />

  if (performance.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No mentor performance data yet.</p>
        <p className="text-gray-600 text-xs mt-1">Assign mentors to sessions and collect student feedback.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {performance.map(p => (
        <div key={p.mentor.id} className="rounded-xl border border-white/[0.06] bg-[#0d1221] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {p.mentor.full_name ?? p.mentor.username ?? 'Unknown mentor'}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span><BookOpen size={11} className="inline mr-1" />{p.sessionCount} session{p.sessionCount !== 1 ? 's' : ''}</span>
                <span><Users size={11} className="inline mr-1" />{p.feedbackCount} response{p.feedbackCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
            {p.feedbackCount > 0 && (
              <div className="flex items-center gap-1 text-sm font-semibold text-amber-400">
                <Star size={14} className="fill-current" />
                {p.avgOverall.toFixed(1)}
              </div>
            )}
          </div>

          {p.feedbackCount > 0 && (
            <div className="mt-4 space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Clarity</span>
                </div>
                <RatingBar value={p.avgClarity} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Time management</span>
                </div>
                <RatingBar value={p.avgManagement} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Engagement</span>
                </div>
                <RatingBar value={p.avgEngagement} />
              </div>
            </div>
          )}

          {p.feedbackCount === 0 && (
            <p className="mt-3 text-xs text-gray-600">No feedback collected yet.</p>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Small UI helpers ─────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={20} className="animate-spin text-gray-600" />
    </div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-medium text-gray-400">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg text-sm text-gray-200 bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:border-primary-500/50 transition-colors"
    />
  )
}

function Textarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={3}
      className="w-full px-3 py-2 rounded-lg text-sm text-gray-200 bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
    />
  )
}

// ── Root page ────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'details',     label: 'Program Details', icon: <Briefcase size={13} /> },
  { key: 'sessions',   label: 'Sessions & Mentors', icon: <BookOpen size={13} /> },
  { key: 'cohorts',    label: 'Cohorts & Schedule', icon: <CalendarDays size={13} /> },
  { key: 'students',   label: 'Students', icon: <Users size={13} /> },
  { key: 'performance', label: 'Mentor Performance', icon: <BarChart2 size={13} /> },
]

export default function ProgramManagerPage() {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  const { program, loading } = usePMProgramDetail(programId)
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'id' ? 'id' : 'en'
  const [activeTab, setActiveTab] = useState<Tab>('details')

  const programName = program
    ? (lang === 'id' ? program.name_id : program.name_en)
    : '…'

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d1221]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center gap-3">
            <button
              onClick={() => navigate('/program-manager')}
              className="cursor-pointer p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-colors"
            >
              <ArrowLeft size={15} />
            </button>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              {loading ? (
                <Loader2 size={13} className="text-violet-400 animate-spin" />
              ) : (
                <span className="text-sm">{program?.icon ?? '📦'}</span>
              )}
            </div>
            <span className="text-sm font-semibold text-white">{programName}</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === t.key
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!programId ? (
          <p className="text-gray-500 text-sm">Program not found.</p>
        ) : (
          <>
            {activeTab === 'details'      && <DetailsTab     programId={programId} />}
            {activeTab === 'sessions'     && <SessionsTab    programId={programId} />}
            {activeTab === 'cohorts'      && <CohortsTab     programId={programId} />}
            {activeTab === 'students'     && <StudentsTab    programId={programId} />}
            {activeTab === 'performance'  && <PerformanceTab programId={programId} />}
          </>
        )}
      </div>
    </div>
  )
}
