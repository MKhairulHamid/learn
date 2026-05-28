import { useState } from 'react'
import { Flag, Search, X, CheckCircle2, XCircle, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { useContentReportsAdmin, type ContentReportRow, type ReportStatus } from '../../hooks/useContentReport'
import { useNavigate } from 'react-router-dom'

const REASON_LABELS: Record<string, string> = {
  incorrect_content:  'Incorrect content',
  outdated:           'Outdated information',
  broken_exercise:    'Broken exercise',
  missing_content:    'Missing content',
  other:              'Other',
}

const STATUS_CONFIG: Record<ReportStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  open:      { label: 'Open',      cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',  icon: <Clock size={11} /> },
  resolved:  { label: 'Resolved',  cls: 'bg-green-500/10 text-green-400 border-green-500/20',  icon: <CheckCircle2 size={11} /> },
  dismissed: { label: 'Dismissed', cls: 'bg-gray-500/10  text-gray-400  border-gray-500/20',   icon: <XCircle size={11} /> },
}

export function ContentReportsPanel() {
  const { rows, loading, openCount, updateStatus } = useContentReportsAdmin()
  const navigate = useNavigate()

  const [search, setSearch]           = useState('')
  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'all'>('all')
  const [filterReason, setFilterReason] = useState<string>('all')
  const [expanded, setExpanded]       = useState<Set<string>>(new Set())

  const q = search.trim().toLowerCase()

  const filtered = rows.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false
    if (filterReason !== 'all' && r.reason !== filterReason) return false
    if (q) {
      const name = (r.profile?.full_name ?? r.profile?.email ?? '').toLowerCase()
      const title = r.session_title_en.toLowerCase()
      const details = r.details.toLowerCase()
      if (!name.includes(q) && !title.includes(q) && !details.includes(q)) return false
    }
    return true
  })

  const hasFilters = q || filterStatus !== 'all' || filterReason !== 'all'

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-200">Content Reports</h2>
          {openCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
              {openCount} open
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          Flags submitted by learners about incorrect or problematic session content.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by user, session, or details…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-7 py-1.5 rounded-lg bg-[#0a0e1a] border border-white/10 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as ReportStatus | 'all')}
          className={selectCls}
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>

        <select
          value={filterReason}
          onChange={e => setFilterReason(e.target.value)}
          className={selectCls}
        >
          <option value="all">All reasons</option>
          {Object.entries(REASON_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterStatus('all'); setFilterReason('all') }}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-500 hover:text-gray-300 hover:border-white/20 transition-colors whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading reports…</div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 border border-dashed border-white/10 rounded-2xl">
          <Flag size={22} className="text-gray-600" />
          <p className="text-sm text-gray-500">No content reports yet.</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-10 border border-dashed border-white/[0.06] rounded-xl">
          No reports match your filters.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] text-gray-600">
            {filtered.length !== rows.length
              ? `${filtered.length} of ${rows.length} reports`
              : `${rows.length} report${rows.length !== 1 ? 's' : ''}`}
          </p>
          {filtered.map(r => (
            <ReportCard
              key={r.id}
              row={r}
              expanded={expanded.has(r.id)}
              onToggle={() => toggleExpand(r.id)}
              onUpdateStatus={updateStatus}
              onNavigate={() => navigate(`/session/${r.session_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ReportCard({
  row, expanded, onToggle, onUpdateStatus, onNavigate,
}: {
  row: ContentReportRow
  expanded: boolean
  onToggle: () => void
  onUpdateStatus: (id: string, status: ReportStatus) => void
  onNavigate: () => void
}) {
  const name = row.profile?.full_name || row.profile?.email || 'Anonymous'
  const date = new Date(row.created_at).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const status = STATUS_CONFIG[row.status]

  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        {/* Status dot */}
        <div className={`w-2 h-2 rounded-full shrink-0 ${
          row.status === 'open' ? 'bg-amber-400' :
          row.status === 'resolved' ? 'bg-green-400' : 'bg-gray-500'
        }`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-200 font-medium truncate">{name}</span>
            <span className="text-[11px] text-gray-500">
              Session {row.session_number}: {row.session_title_en}
            </span>
            <span className="text-[11px] text-gray-600">{date}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.cls}`}>
              {status.icon} {status.label}
            </span>
            <span className="text-[11px] text-gray-500">
              {REASON_LABELS[row.reason] ?? row.reason}
            </span>
            {row.details && (
              <span className="text-[11px] text-gray-600 truncate max-w-[200px]">
                — {row.details}
              </span>
            )}
          </div>
        </div>

        {expanded ? <ChevronUp size={14} className="text-gray-500 shrink-0" /> : <ChevronDown size={14} className="text-gray-500 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.04] space-y-4">
          {/* Context */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-3 text-xs">
            <Field label="Reporter" value={row.profile?.full_name || row.profile?.email || 'Anonymous'} />
            <Field label="Submitted" value={new Date(row.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} />
            <Field label="Reason" value={REASON_LABELS[row.reason] ?? row.reason} />
            <Field label="Session" value={`Session ${row.session_number}: ${row.session_title_en}`} />
            {row.resolved_at && (
              <Field label="Resolved" value={new Date(row.resolved_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} />
            )}
          </div>

          {/* Details */}
          {row.details && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-1">Details</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{row.details}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onNavigate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-gray-200 hover:border-white/20 transition-colors"
            >
              <ExternalLink size={12} /> View session
            </button>

            {row.status !== 'resolved' && (
              <button
                onClick={() => onUpdateStatus(row.id, 'resolved')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/20 bg-green-500/10 text-xs text-green-400 hover:bg-green-500/20 transition-colors"
              >
                <CheckCircle2 size={12} /> Mark resolved
              </button>
            )}
            {row.status !== 'dismissed' && (
              <button
                onClick={() => onUpdateStatus(row.id, 'dismissed')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-500 hover:text-gray-300 hover:border-white/20 transition-colors"
              >
                <XCircle size={12} /> Dismiss
              </button>
            )}
            {row.status !== 'open' && (
              <button
                onClick={() => onUpdateStatus(row.id, 'open')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-xs text-amber-400 hover:bg-amber-500/20 transition-colors"
              >
                <Clock size={12} /> Reopen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-600 uppercase tracking-wide">{label}</p>
      <p className="text-gray-300 mt-0.5 truncate">{value}</p>
    </div>
  )
}

const selectCls =
  'px-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-white/10 text-sm text-gray-200 ' +
  'focus:outline-none focus:border-primary-500/50 min-w-[160px]'
