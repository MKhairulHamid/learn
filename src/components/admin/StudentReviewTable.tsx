import { useState, useMemo, useEffect } from 'react'
import {
  CheckCircle2, XCircle, Clock, ChevronUp, ChevronDown,
  Star, BookOpen, BarChart2, ClipboardList, Check, X,
  Loader2, AlertTriangle, GraduationCap, Users,
} from 'lucide-react'
import { useCohortReview } from '../../hooks/useCohortReview'
import type { StudentReviewEntry } from '../../hooks/useCohortReview'

// ── Helpers ───────────────────────────────────────────────────────────

type SortKey = 'name' | 'score' | 'completion'
type SortDir = 'asc' | 'desc'
type StatusFilter = 'all' | 'pending' | 'pass' | 'fail'
type ScoreFilter = 'all' | 'below60' | '60to79' | 'above80'

function scoreBg(score: number) {
  if (score >= 80) return 'bg-green-500/10 text-green-400'
  if (score >= 60) return 'bg-yellow-500/10 text-yellow-400'
  return 'bg-red-500/10 text-red-400'
}

function ProgressBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 tabular-nums">{pct}%</span>
    </div>
  )
}

function StarRating({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-gray-600">—</span>
  return (
    <div className="flex items-center gap-1">
      <Star size={11} className="fill-amber-400 text-amber-400" />
      <span className="text-xs text-gray-300 tabular-nums">{value.toFixed(1)}</span>
    </div>
  )
}

// ── Status dropdown ───────────────────────────────────────────────────

function StatusDropdown({
  status,
  onChange,
  disabled,
}: {
  status: StudentReviewEntry['reviewStatus']
  onChange: (s: 'pass' | 'fail' | 'pending') => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  const display = {
    pending: { label: 'Pending', icon: <Clock size={11} />, cls: 'text-gray-400 border-white/10' },
    pass: { label: 'Pass', icon: <CheckCircle2 size={11} />, cls: 'text-green-400 border-green-500/30' },
    fail: { label: 'Fail', icon: <XCircle size={11} />, cls: 'text-red-400 border-red-500/30' },
  }[status]

  return (
    <div className="relative">
      <button
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${display.cls} bg-white/[0.03] hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {display.icon}
        {display.label}
        <ChevronDown size={9} className="text-gray-600 ml-0.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 w-32 bg-[#0d1221] border border-white/[0.1] rounded-xl shadow-xl py-1">
            {(['pending', 'pass', 'fail'] as const).map(s => (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false) }}
                className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 text-xs transition-colors hover:bg-white/[0.06] capitalize ${
                  status === s ? 'text-white' : 'text-gray-400'
                }`}
              >
                {status === s && <Check size={10} className="text-primary-400" />}
                <span className={status === s ? '' : 'ml-4'}>
                  {s}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Graduate modal ────────────────────────────────────────────────────

function GraduateModal({
  passing,
  failing,
  pending,
  courseTitle,
  graduating,
  onConfirm,
  onCancel,
}: {
  passing: number
  failing: number
  pending: number
  courseTitle: string
  graduating: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0d1221] border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
            <GraduationCap size={18} className="text-primary-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Graduate Cohort</h2>
            <p className="text-xs text-gray-500 mt-0.5">Certificates will be issued for passing students</p>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 size={14} />
              Receiving certificates
            </div>
            <span className="text-sm font-bold text-green-400">{passing}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
            <div className="flex items-center gap-2 text-sm text-red-400">
              <XCircle size={14} />
              Not receiving certificates
            </div>
            <span className="text-sm font-bold text-red-400">{failing}</span>
          </div>
          {pending > 0 && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-500/5 border border-yellow-500/15 text-xs text-yellow-400">
              <AlertTriangle size={13} />
              {pending} student{pending !== 1 ? 's' : ''} still pending review — they will not receive a certificate.
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-5">
          Course: <span className="text-gray-300">{courseTitle}</span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={graduating}
            className="cursor-pointer flex-1 px-4 py-2 rounded-xl text-sm border border-white/[0.08] text-gray-400 hover:bg-white/[0.05] transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={graduating || passing === 0}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {graduating ? (
              <><Loader2 size={14} className="animate-spin" /> Issuing…</>
            ) : (
              <><GraduationCap size={14} /> Graduate ({passing})</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Bulk fail notes modal ─────────────────────────────────────────────

function BulkNoteModal({
  count,
  action,
  onConfirm,
  onCancel,
}: {
  count: number
  action: 'pass' | 'fail'
  onConfirm: (notes: string) => void
  onCancel: () => void
}) {
  const [notes, setNotes] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d1221] border border-white/[0.1] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-sm font-semibold text-white mb-1">
          Bulk {action === 'pass' ? 'Pass' : 'Fail'} — {count} student{count !== 1 ? 's' : ''}
        </h2>
        {action === 'fail' && (
          <>
            <p className="text-xs text-gray-500 mb-3">Optional shared reason (internal only)</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Reason for failing…"
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm text-gray-200 bg-white/[0.04] border border-white/[0.08] focus:outline-none focus:border-primary-500/50 resize-none mb-4"
            />
          </>
        )}
        {action === 'pass' && <div className="mb-4" />}
        <div className="flex gap-3">
          <button onClick={onCancel} className="cursor-pointer flex-1 px-4 py-2 rounded-xl text-sm border border-white/[0.08] text-gray-400 hover:bg-white/[0.05] transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(notes)}
            className={`cursor-pointer flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
              action === 'pass'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────

export function StudentReviewTable({
  cohortId,
  cohortName,
  courseTitle,
  onBack,
  onGraduated,
}: {
  cohortId: string
  cohortName: string
  courseTitle: string
  onBack: () => void
  onGraduated?: (count: number) => void
}) {
  const { students, loading, graduating, load, setReview, setBulkReview, graduateCohort } =
    useCohortReview(cohortId)

  // Filters & sort
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [search, setSearch] = useState('')

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Modals
  const [showGraduate, setShowGraduate] = useState(false)
  const [bulkAction, setBulkAction] = useState<'pass' | 'fail' | null>(null)

  // Inline notes state
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({})

  useEffect(() => { load() }, [load])

  // Reset selection when students change
  useEffect(() => { setSelected(new Set()) }, [students])

  const filtered = useMemo(() => {
    let list = [...students]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s => s.fullName.toLowerCase().includes(q) || (s.username ?? '').toLowerCase().includes(q))
    }

    if (statusFilter !== 'all') list = list.filter(s => s.reviewStatus === statusFilter)

    if (scoreFilter === 'below60') list = list.filter(s => s.avgScore < 60)
    else if (scoreFilter === '60to79') list = list.filter(s => s.avgScore >= 60 && s.avgScore < 80)
    else if (scoreFilter === 'above80') list = list.filter(s => s.avgScore >= 80)

    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.fullName.localeCompare(b.fullName)
      else if (sortKey === 'score') cmp = a.avgScore - b.avgScore
      else if (sortKey === 'completion') cmp = a.completionPct - b.completionPct
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [students, search, statusFilter, scoreFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronUp size={10} className="text-gray-600" />
    return sortDir === 'asc'
      ? <ChevronUp size={10} className="text-primary-400" />
      : <ChevronDown size={10} className="text-primary-400" />
  }

  const allFilteredIds = filtered.map(s => s.userId)
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selected.has(id))
  const someSelected = selected.size > 0

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(allFilteredIds))
  }

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleStatusChange = async (userId: string, status: 'pass' | 'fail' | 'pending') => {
    const notes = status === 'fail' ? (noteDraft[userId] ?? '') : undefined
    await setReview(userId, status, notes)
  }

  const handleBulkConfirm = async (notes: string) => {
    if (!bulkAction) return
    await setBulkReview([...selected], bulkAction, notes || undefined)
    setSelected(new Set())
    setBulkAction(null)
  }

  const handleGraduateConfirm = async () => {
    const result = await graduateCohort(courseTitle)
    setShowGraduate(false)
    if (result.success) onGraduated?.(result.count)
  }

  const counts = {
    pass: students.filter(s => s.reviewStatus === 'pass').length,
    fail: students.filter(s => s.reviewStatus === 'fail').length,
    pending: students.filter(s => s.reviewStatus === 'pending').length,
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="cursor-pointer flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <span className="text-gray-600">·</span>
          <div>
            <span className="text-sm font-semibold text-white">{cohortName}</span>
            <span className="text-xs text-gray-500 ml-2">— Review Students</span>
          </div>
        </div>

        {/* Graduate button */}
        <button
          onClick={() => setShowGraduate(true)}
          disabled={counts.pass === 0}
          title={counts.pending > 0 ? `${counts.pending} students still pending` : undefined}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            counts.pass > 0
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-white/[0.04] text-gray-600 cursor-not-allowed border border-white/[0.06]'
          }`}
        >
          <GraduationCap size={14} />
          Graduate ({counts.pass} passing)
          {counts.pending > 0 && (
            <AlertTriangle size={12} className="text-yellow-400 ml-0.5" />
          )}
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <Users size={11} className="text-gray-500" />
          <span className="text-gray-400">{students.length} students</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/8 border border-green-500/15">
          <CheckCircle2 size={11} className="text-green-400" />
          <span className="text-green-400">{counts.pass} pass</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/8 border border-red-500/15">
          <XCircle size={11} className="text-red-400" />
          <span className="text-red-400">{counts.fail} fail</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <Clock size={11} className="text-gray-500" />
          <span className="text-gray-400">{counts.pending} pending</span>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <input
          type="text"
          placeholder="Search student…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 rounded-lg px-3 py-1.5 w-44 focus:outline-none focus:border-primary-500/50"
        />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className="cursor-pointer bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500/50"
        >
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="pass">Pass</option>
          <option value="fail">Fail</option>
        </select>

        {/* Score filter */}
        <select
          value={scoreFilter}
          onChange={e => setScoreFilter(e.target.value as ScoreFilter)}
          className="cursor-pointer bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500/50"
        >
          <option value="all">All scores</option>
          <option value="below60">Below 60%</option>
          <option value="60to79">60–79%</option>
          <option value="above80">80%+</option>
        </select>

        {/* Active filters as chips */}
        {statusFilter !== 'all' && (
          <button
            onClick={() => setStatusFilter('all')}
            className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-400"
          >
            {statusFilter} <X size={9} />
          </button>
        )}
        {scoreFilter !== 'all' && (
          <button
            onClick={() => setScoreFilter('all')}
            className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs text-primary-400"
          >
            {scoreFilter === 'below60' ? '<60%' : scoreFilter === '60to79' ? '60–79%' : '80%+'} <X size={9} />
          </button>
        )}
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <span className="text-xs text-gray-400">{selected.size} selected</span>
          <div className="h-3 w-px bg-white/[0.1]" />
          <button
            onClick={() => setBulkAction('pass')}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-green-600/20 hover:bg-green-600/30 text-green-400 transition-colors"
          >
            <CheckCircle2 size={12} /> Bulk Pass
          </button>
          <button
            onClick={() => setBulkAction('fail')}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
          >
            <XCircle size={12} /> Bulk Fail
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="cursor-pointer ml-auto text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin text-gray-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">
          {students.length === 0 ? 'No active students in this cohort.' : 'No students match the current filters.'}
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-4 py-2.5 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="cursor-pointer w-3.5 h-3.5 rounded accent-primary-600"
                  />
                </th>
                <th className="text-left px-4 py-2.5">
                  <button
                    onClick={() => toggleSort('name')}
                    className="cursor-pointer flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Student <SortIcon k="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-2.5">
                  <button
                    onClick={() => toggleSort('completion')}
                    className="cursor-pointer flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <BookOpen size={11} /> Completion <SortIcon k="completion" />
                  </button>
                </th>
                <th className="text-left px-4 py-2.5">
                  <button
                    onClick={() => toggleSort('score')}
                    className="cursor-pointer flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <BarChart2 size={11} /> Avg Score <SortIcon k="score" />
                  </button>
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1"><ClipboardList size={11} /> Exercises</span>
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1"><Star size={11} /> Feedback</span>
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Decision</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.userId}
                  className={`${i !== filtered.length - 1 ? 'border-b border-white/[0.04]' : ''} ${
                    selected.has(s.userId) ? 'bg-primary-500/[0.04]' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(s.userId)}
                      onChange={() => toggleOne(s.userId)}
                      className="cursor-pointer w-3.5 h-3.5 rounded accent-primary-600"
                    />
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-gray-200">{s.fullName}</div>
                    {s.username && <div className="text-xs text-gray-600">@{s.username}</div>}
                  </td>

                  {/* Completion */}
                  <td className="px-4 py-3">
                    <ProgressBar pct={s.completionPct} />
                    <div className="text-xs text-gray-600 mt-0.5">
                      {s.completedSessions}/{s.totalSessions} sessions
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3">
                    {s.avgScore > 0 ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${scoreBg(s.avgScore)}`}>
                        {s.avgScore}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>

                  {/* Exercises */}
                  <td className="px-4 py-3 text-xs text-gray-400 tabular-nums">
                    {s.exercisesSubmitted > 0 ? `${s.exercisesSubmitted} submitted` : <span className="text-gray-600">—</span>}
                  </td>

                  {/* Feedback */}
                  <td className="px-4 py-3">
                    <StarRating value={s.feedbackRating} />
                    {s.feedbackCount > 0 && (
                      <div className="text-xs text-gray-600">{s.feedbackCount} response{s.feedbackCount !== 1 ? 's' : ''}</div>
                    )}
                  </td>

                  {/* Decision */}
                  <td className="px-4 py-3">
                    <StatusDropdown
                      status={s.reviewStatus}
                      onChange={status => handleStatusChange(s.userId, status)}
                    />
                  </td>

                  {/* Notes */}
                  <td className="px-4 py-3">
                    {s.reviewStatus === 'fail' ? (
                      <input
                        type="text"
                        placeholder="Reason (optional)…"
                        defaultValue={s.reviewNotes ?? ''}
                        onChange={e =>
                          setNoteDraft(prev => ({ ...prev, [s.userId]: e.target.value }))
                        }
                        onBlur={e => {
                          if (e.target.value !== (s.reviewNotes ?? '')) {
                            setReview(s.userId, 'fail', e.target.value)
                          }
                        }}
                        className="bg-transparent text-xs text-gray-400 border border-white/[0.08] rounded-md px-2 py-1 w-36 focus:outline-none focus:border-primary-500/40"
                      />
                    ) : (
                      <span className="text-xs text-gray-700">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showGraduate && (
        <GraduateModal
          passing={counts.pass}
          failing={counts.fail}
          pending={counts.pending}
          courseTitle={courseTitle}
          graduating={graduating}
          onConfirm={handleGraduateConfirm}
          onCancel={() => setShowGraduate(false)}
        />
      )}

      {bulkAction && (
        <BulkNoteModal
          count={selected.size}
          action={bulkAction}
          onConfirm={handleBulkConfirm}
          onCancel={() => setBulkAction(null)}
        />
      )}
    </div>
  )
}
