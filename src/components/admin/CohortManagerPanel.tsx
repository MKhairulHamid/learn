import { useState } from 'react'
import {
  GraduationCap, Plus, ChevronRight, ArrowLeft, Users, Clock,
  CheckCircle2, XCircle, UserX, CalendarDays, Trash2, Eye, EyeOff,
  DoorOpen, DoorClosed, Loader2, UserPlus,
} from 'lucide-react'
import {
  useCohortAdmin, useCohortDetail, useAllProfiles,
} from '../../hooks/useCohortAdmin'
import type { CohortDraft } from '../../hooks/useCohortAdmin'
import { usePrograms } from '../../hooks/usePhases'
import type { CohortLessonSchedule } from '../../types'

// ── Date helpers ────────────────────────────────────────────────────

// yyyy-mm-dd → ISO timestamp (local midnight)
const dateToIso = (d: string) => new Date(d + 'T00:00:00').toISOString()
const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

// ── Root panel: switches between list and detail ────────────────────

export function CohortManagerPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (selectedId) {
    return <CohortDetail cohortId={selectedId} onBack={() => setSelectedId(null)} />
  }
  return <CohortList onSelect={setSelectedId} />
}

// ── Cohort list ─────────────────────────────────────────────────────

function CohortList({ onSelect }: { onSelect: (id: string) => void }) {
  const { cohorts, loading, createCohort, refetch } = useCohortAdmin()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">Cohorts</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage batches, schedules, and learner enrollment.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors"
        >
          <Plus size={15} /> New cohort
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading cohorts…</div>
      ) : cohorts.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center border border-dashed border-white/10 rounded-2xl">
          No cohorts yet. Create the first one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cohorts.map(c => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="cursor-pointer text-left bg-[#111827] border border-white/[0.06] rounded-2xl p-5 hover:border-primary-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap size={16} className="text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">
                      {fmt(c.course_start_at)} → {fmt(c.course_close_at)}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-600 shrink-0 mt-1" />
              </div>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <StatusChip on={c.is_published} onLabel="Published" offLabel="Draft" />
                {c.admission_open && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-950/50 text-green-400 border border-green-900">
                    Admission open
                  </span>
                )}
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Users size={11} /> {c.activeCount} active
                </span>
                {c.pendingCount > 0 && (
                  <span className="text-[11px] text-amber-400 flex items-center gap-1">
                    <Clock size={11} /> {c.pendingCount} pending
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <CohortFormModal
          onClose={() => setShowForm(false)}
          onCreate={async draft => {
            const { error } = await createCohort(draft)
            if (!error) { setShowForm(false); refetch() }
            return error
          }}
        />
      )}
    </div>
  )
}

function StatusChip({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
      on
        ? 'bg-primary-950/50 text-primary-300 border-primary-900'
        : 'bg-gray-800 text-gray-400 border-gray-700'
    }`}>
      {on ? onLabel : offLabel}
    </span>
  )
}

// ── New-cohort form ─────────────────────────────────────────────────

function CohortFormModal({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (draft: CohortDraft) => Promise<string | null>
}) {
  const { programs } = usePrograms()
  const [programId, setProgramId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [admissionOpenAt, setAdmissionOpenAt] = useState('')
  const [courseStartAt, setCourseStartAt] = useState('')
  const [courseCloseAt, setCourseCloseAt] = useState('')
  const [accessMonths, setAccessMonths] = useState(6)
  const [maxSeats, setMaxSeats] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Default the program select to the first available program.
  const resolvedProgramId = programId || programs[0]?.id || ''

  async function submit() {
    setError(null)
    if (!resolvedProgramId) {
      setError('Select a program.')
      return
    }
    if (!name.trim() || !admissionOpenAt || !courseStartAt || !courseCloseAt) {
      setError('Fill in the name and all three dates.')
      return
    }
    if (admissionOpenAt > courseStartAt) {
      setError('Admission must open on or before the course start.')
      return
    }
    if (courseStartAt >= courseCloseAt) {
      setError('Course close date must be after the start date.')
      return
    }
    setSaving(true)
    const err = await onCreate({
      program_id: resolvedProgramId,
      name: name.trim(),
      description: description.trim(),
      admission_open_at: dateToIso(admissionOpenAt),
      course_start_at: dateToIso(courseStartAt),
      course_close_at: dateToIso(courseCloseAt),
      access_duration_months: accessMonths,
      max_seats: maxSeats ? Number(maxSeats) : null,
    })
    setSaving(false)
    if (err) setError(err)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-base font-semibold text-white mb-4">New cohort</h3>

        {error && (
          <div className="mb-4 text-xs text-red-300 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <Field label="Program">
            <select
              value={resolvedProgramId}
              onChange={e => setProgramId(e.target.value)}
              className={inputCls}
            >
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name_en}</option>
              ))}
            </select>
          </Field>
          <Field label="Cohort name">
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Batch 2 · 2026"
              className={inputCls}
            />
          </Field>
          <Field label="Description">
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Short summary of this batch"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Admission opens">
              <input type="date" value={admissionOpenAt}
                onChange={e => setAdmissionOpenAt(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Course starts">
              <input type="date" value={courseStartAt}
                onChange={e => setCourseStartAt(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Course closes">
              <input type="date" value={courseCloseAt}
                onChange={e => setCourseCloseAt(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Access (months)">
              <input type="number" min={1} value={accessMonths}
                onChange={e => setAccessMonths(Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Max seats (optional)">
              <input type="number" min={1} value={maxSeats}
                onChange={e => setMaxSeats(e.target.value)}
                placeholder="Unlimited" className={inputCls} />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-5">
          <button onClick={onClose}
            className="cursor-pointer px-3 py-2 text-sm text-gray-400 hover:text-gray-200">
            Cancel
          </button>
          <button onClick={submit} disabled={saving}
            className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50">
            {saving && <Loader2 size={14} className="animate-spin" />}
            Create cohort
          </button>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-[#0a0e1a] border border-white/10 text-sm text-gray-200 ' +
  'placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  )
}

// ── Cohort detail ───────────────────────────────────────────────────

function CohortDetail({ cohortId, onBack }: { cohortId: string; onBack: () => void }) {
  const d = useCohortDetail(cohortId)
  const [tab, setTab] = useState<'schedule' | 'people'>('schedule')

  if (d.loading || !d.cohort) {
    return (
      <div className="text-gray-500 text-sm py-12 text-center">Loading cohort…</div>
    )
  }

  const c = d.cohort
  const pending = d.enrollments.filter(e => e.status === 'pending')

  return (
    <div className="space-y-5">
      <button onClick={onBack}
        className="cursor-pointer flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft size={15} /> All cohorts
      </button>

      {/* Header card */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <GraduationCap size={20} className="text-primary-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{c.name}</h2>
              <p className="text-xs text-gray-500">
                {fmt(c.course_start_at)} → {fmt(c.course_close_at)} · {c.access_duration_months}mo access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToggleButton
              on={c.is_published}
              onIcon={<Eye size={14} />} offIcon={<EyeOff size={14} />}
              onLabel="Published" offLabel="Draft"
              onClick={() => d.updateCohort({ is_published: !c.is_published })}
            />
            <ToggleButton
              on={c.admission_open}
              onIcon={<DoorOpen size={14} />} offIcon={<DoorClosed size={14} />}
              onLabel="Admission open" offLabel="Admission closed"
              onClick={() => d.setAdmissionOpen(!c.admission_open)}
            />
          </div>
        </div>
        {c.description && (
          <p className="text-xs text-gray-400 mt-3">{c.description}</p>
        )}
        {c.admission_open && (
          <p className="text-[11px] text-green-400 mt-2">
            New registrations auto-apply to this cohort while admission is open.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06]">
        <DetailTab active={tab === 'schedule'} onClick={() => setTab('schedule')}
          icon={<CalendarDays size={14} />} label="Lesson schedule" />
        <DetailTab active={tab === 'people'} onClick={() => setTab('people')}
          icon={<Users size={14} />}
          label={`Enrollment${pending.length ? ` (${pending.length})` : ''}`} />
      </div>

      {tab === 'schedule' ? <ScheduleEditor d={d} /> : <EnrollmentManager d={d} />}
    </div>
  )
}

function ToggleButton({ on, onIcon, offIcon, onLabel, offLabel, onClick }: {
  on: boolean
  onIcon: React.ReactNode; offIcon: React.ReactNode
  onLabel: string; offLabel: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        on
          ? 'bg-green-950/50 text-green-400 border-green-900 hover:bg-green-950'
          : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-750'
      }`}>
      {on ? onIcon : offIcon}
      {on ? onLabel : offLabel}
    </button>
  )
}

function DetailTab({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string
}) {
  return (
    <button onClick={onClick}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary-500 text-primary-400'
          : 'border-transparent text-gray-500 hover:text-gray-300'
      }`}>
      {icon} {label}
    </button>
  )
}

// ── Schedule editor ─────────────────────────────────────────────────

type DetailHook = ReturnType<typeof useCohortDetail>

function ScheduleEditor({ d }: { d: DetailHook }) {
  const [genDate, setGenDate] = useState('')
  const [genStep, setGenStep] = useState(3)
  const [busy, setBusy] = useState(false)

  async function generate() {
    if (!genDate) return
    setBusy(true)
    await d.generateSchedule(genDate, genStep)
    setBusy(false)
  }

  return (
    <div className="space-y-4">
      {/* Bulk generator */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
        <p className="text-xs font-semibold text-gray-300 mb-2">Quick-fill schedule</p>
        <p className="text-[11px] text-gray-500 mb-3">
          Sets Lesson 0 on the first date, then spaces every lesson by the chosen
          gap. Overwrites all existing rows.
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          <Field label="First lesson date">
            <input type="date" value={genDate} onChange={e => setGenDate(e.target.value)}
              className={inputCls} />
          </Field>
          <Field label="Gap between lessons">
            <select value={genStep} onChange={e => setGenStep(Number(e.target.value))}
              className={inputCls}>
              <option value={3}>Twice a week (3 days)</option>
              <option value={7}>Weekly (7 days)</option>
              <option value={14}>Every 2 weeks</option>
              <option value={2}>Every 2 days</option>
            </select>
          </Field>
          <button onClick={generate} disabled={busy || !genDate}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50">
            {busy && <Loader2 size={14} className="animate-spin" />}
            Generate
          </button>
        </div>
      </div>

      {/* Per-lesson rows */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04]">
        {d.sessions.length === 0 && (
          <p className="text-gray-500 text-sm py-8 text-center">No sessions found.</p>
        )}
        {d.sessions.map(s => {
          const row = d.schedule.find(r => r.session_id === s.id)
          return <ScheduleRow key={s.id}
            number={s.session_number}
            title={s.title_en}
            row={row}
            onSave={fields => d.saveScheduleRow(s.id, fields)}
            onRemove={() => d.removeScheduleRow(s.id)} />
        })}
      </div>
    </div>
  )
}

function ScheduleRow({ number, title, row, onSave, onRemove }: {
  number: string
  title: string
  row: CohortLessonSchedule | undefined
  onSave: (f: Partial<Pick<CohortLessonSchedule,
    'scheduled_date' | 'zoom_link' | 'recording_url' | 'unlock_override' | 'notes'>>) => Promise<{ error: string | null }>
  onRemove: () => void
}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(row?.scheduled_date ?? '')
  const [zoom, setZoom] = useState(row?.zoom_link ?? '')
  const [rec, setRec] = useState(row?.recording_url ?? '')
  const [override, setOverride] = useState<'auto' | 'open' | 'locked'>(
    row?.unlock_override === true ? 'open'
      : row?.unlock_override === false ? 'locked' : 'auto')
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!date) return
    setSaving(true)
    await onSave({
      scheduled_date: date,
      zoom_link: zoom.trim() || null,
      recording_url: rec.trim() || null,
      unlock_override: override === 'open' ? true : override === 'locked' ? false : null,
    })
    setSaving(false)
    setOpen(false)
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono text-gray-500 w-8 shrink-0">L{number}</span>
        <span className="text-sm text-gray-200 flex-1 min-w-0 truncate">{title}</span>
        {row ? (
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <CalendarDays size={12} />
            {new Date(row.scheduled_date + 'T00:00:00').toLocaleDateString('en-US',
              { day: 'numeric', month: 'short' })}
            {row.unlock_override === true && <Tag color="green">Forced open</Tag>}
            {row.unlock_override === false && <Tag color="red">Locked</Tag>}
          </span>
        ) : (
          <span className="text-xs text-gray-600">Not scheduled</span>
        )}
        <button onClick={() => setOpen(o => !o)}
          className="cursor-pointer text-xs font-medium text-primary-400 hover:text-primary-300">
          {open ? 'Close' : row ? 'Edit' : 'Schedule'}
        </button>
      </div>

      {open && (
        <div className="mt-3 pl-11 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Scheduled date">
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className={inputCls} />
            </Field>
            <Field label="Unlock behaviour">
              <select value={override}
                onChange={e => setOverride(e.target.value as 'auto' | 'open' | 'locked')}
                className={inputCls}>
                <option value="auto">Auto — unlock on the date</option>
                <option value="open">Force open</option>
                <option value="locked">Force locked</option>
              </select>
            </Field>
          </div>
          <Field label="Zoom link (optional)">
            <input value={zoom} onChange={e => setZoom(e.target.value)}
              placeholder="https://zoom.us/j/…" className={inputCls} />
          </Field>
          <Field label="Recording URL (optional)">
            <input value={rec} onChange={e => setRec(e.target.value)}
              placeholder="https://…" className={inputCls} />
          </Field>
          <div className="flex items-center gap-2">
            <button onClick={save} disabled={saving || !date}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50">
              {saving && <Loader2 size={12} className="animate-spin" />}
              Save
            </button>
            {row && (
              <button onClick={onRemove}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/50">
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Tag({ color, children }: { color: 'green' | 'red'; children: React.ReactNode }) {
  const cls = color === 'green'
    ? 'bg-green-950/50 text-green-400 border-green-900'
    : 'bg-red-950/50 text-red-400 border-red-900'
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cls}`}>
      {children}
    </span>
  )
}

// ── Enrollment manager ──────────────────────────────────────────────

function EnrollmentManager({ d }: { d: DetailHook }) {
  const profiles = useAllProfiles()
  const [adding, setAdding] = useState(false)

  const pending = d.enrollments.filter(e => e.status === 'pending')
  const active = d.enrollments.filter(e => e.status === 'active')
  const other = d.enrollments.filter(e => e.status === 'rejected' || e.status === 'removed')

  const enrolledIds = new Set(d.enrollments.map(e => e.user_id))
  const addable = profiles.filter(p => !enrolledIds.has(p.id))

  return (
    <div className="space-y-5">
      {/* Add learner */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-300">Add a learner directly</p>
          <button onClick={() => setAdding(a => !a)}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300">
            <UserPlus size={13} /> {adding ? 'Close' : 'Add learner'}
          </button>
        </div>
        {adding && (
          <div className="mt-3">
            {addable.length === 0 ? (
              <p className="text-xs text-gray-500">Every user is already enrolled.</p>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-white/[0.04] border border-white/[0.06] rounded-lg">
                {addable.map(p => (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-200 truncate">{p.full_name ?? '—'}</p>
                      <p className="text-xs text-gray-500 truncate">{p.email}</p>
                    </div>
                    <button onClick={() => d.addUser(p.id)}
                      className="cursor-pointer text-xs font-medium text-primary-400 hover:text-primary-300 shrink-0">
                      Add as active
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pending applications */}
      {pending.length > 0 && (
        <EnrollSection title="Pending approval" count={pending.length} accent="amber">
          {pending.map(e => (
            <EnrollRow key={e.id} e={e}>
              <button onClick={() => d.approveEnrollment(e.id)}
                className="cursor-pointer flex items-center gap-1 text-xs font-medium text-green-400 hover:text-green-300">
                <CheckCircle2 size={13} /> Approve
              </button>
              <button onClick={() => d.setEnrollmentStatus(e.id, 'rejected')}
                className="cursor-pointer flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300">
                <XCircle size={13} /> Reject
              </button>
            </EnrollRow>
          ))}
        </EnrollSection>
      )}

      {/* Active members */}
      <EnrollSection title="Active members" count={active.length} accent="green">
        {active.length === 0 ? (
          <p className="text-xs text-gray-500 px-3 py-3">No active members yet.</p>
        ) : active.map(e => (
          <EnrollRow key={e.id} e={e}>
            <button onClick={() => d.setEnrollmentStatus(e.id, 'removed')}
              className="cursor-pointer flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-300">
              <UserX size={13} /> Remove
            </button>
          </EnrollRow>
        ))}
      </EnrollSection>

      {/* Rejected / removed */}
      {other.length > 0 && (
        <EnrollSection title="Rejected & removed" count={other.length} accent="gray">
          {other.map(e => (
            <EnrollRow key={e.id} e={e}>
              <span className="text-[11px] text-gray-500 capitalize">{e.status}</span>
              <button onClick={() => d.approveEnrollment(e.id)}
                className="cursor-pointer flex items-center gap-1 text-xs font-medium text-green-400 hover:text-green-300">
                <CheckCircle2 size={13} /> Reinstate
              </button>
              <button onClick={() => d.removeEnrollment(e.id)}
                className="cursor-pointer text-gray-600 hover:text-red-400">
                <Trash2 size={13} />
              </button>
            </EnrollRow>
          ))}
        </EnrollSection>
      )}
    </div>
  )
}

function EnrollSection({ title, count, accent, children }: {
  title: string; count: number
  accent: 'amber' | 'green' | 'gray'
  children: React.ReactNode
}) {
  const dot = accent === 'amber' ? 'bg-amber-400'
    : accent === 'green' ? 'bg-green-400' : 'bg-gray-500'
  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <h3 className="text-xs font-semibold text-gray-300">{title}</h3>
        <span className="text-xs text-gray-600">({count})</span>
      </div>
      <div className="divide-y divide-white/[0.04]">{children}</div>
    </div>
  )
}

function EnrollRow({ e, children }: {
  e: { profile: { full_name: string | null; email: string | null } | null; applied_at: string }
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-gray-200 truncate">{e.profile?.full_name ?? '—'}</p>
        <p className="text-xs text-gray-500 truncate">{e.profile?.email ?? '—'}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">{children}</div>
    </div>
  )
}
