import { useState } from 'react'
import { Star, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { useFeedbackAdmin, type FeedbackRow, type FeedbackStats } from '../../hooks/useFeedback'
import { useCohortAdmin } from '../../hooks/useCohortAdmin'

export function FeedbackAnalyticsPanel() {
  const { cohorts, loading: cohortsLoading } = useCohortAdmin()
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const activeCohortId = selectedCohort ?? cohorts[0]?.id ?? null
  const { rows, stats, loading } = useFeedbackAdmin(activeCohortId, selectedSession)

  // Derive unique sessions from the rows for the session filter.
  const sessionOptions = [...new Map(rows.map(r => [r.session_id, r.session_title])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-200">Session Feedback</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Aggregated student ratings and comments per cohort.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Cohort</label>
          {cohortsLoading ? (
            <div className="h-8 w-40 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <select
              value={activeCohortId ?? ''}
              onChange={e => { setSelectedCohort(e.target.value || null); setSelectedSession(null) }}
              className={selectCls}
            >
              {cohorts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {sessionOptions.length > 0 && (
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Session</label>
            <select
              value={selectedSession ?? ''}
              onChange={e => setSelectedSession(e.target.value || null)}
              className={selectCls}
            >
              <option value="">All sessions</option>
              {sessionOptions.map(([id, title]) => (
                <option key={id} value={id}>{title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading feedback…</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center border border-dashed border-white/10 rounded-2xl">
          No feedback submitted yet for this cohort.
        </div>
      ) : (
        <>
          {stats && <StatsGrid stats={stats} />}
          <ResponseList rows={rows} />
        </>
      )}
    </div>
  )
}

// ── Stats grid ─────────────────────────────────────────────────────────

function StatsGrid({ stats }: { stats: FeedbackStats }) {
  const dims = [
    { label: 'Materials',        value: stats.avg_materials },
    { label: 'Exercises',        value: stats.avg_exercises },
    { label: 'Mentor clarity',   value: stats.avg_mentor_clarity },
    { label: 'Mentor management', value: stats.avg_mentor_management },
    { label: 'Mentor engagement', value: stats.avg_mentor_engagement },
    { label: 'Overall',          value: stats.avg_overall },
  ]

  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={14} className="text-gray-400" />
        <span className="text-xs font-semibold text-gray-300">
          {stats.count} response{stats.count !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {dims.map(d => (
          <RatingBar key={d.label} label={d.label} value={d.value} />
        ))}
      </div>
    </div>
  )
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100
  const color =
    value >= 4 ? 'bg-green-500' :
    value >= 3 ? 'bg-primary-500' :
    value >= 2 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] text-gray-400 truncate pr-2">{label}</p>
        <span className="text-xs font-semibold text-gray-200 shrink-0 flex items-center gap-0.5">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          {value.toFixed(1)}
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Individual responses ───────────────────────────────────────────────

function ResponseList({ rows }: { rows: FeedbackRow[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Individual Responses
      </p>
      {rows.map(r => <ResponseCard key={r.id} row={r} />)}
    </div>
  )
}

function ResponseCard({ row }: { row: FeedbackRow }) {
  const [expanded, setExpanded] = useState(false)
  const name = row.profile?.full_name || row.profile?.email || 'Anonymous'
  const date = new Date(row.submitted_at).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-200 font-medium truncate">{name}</span>
            <span className="text-[11px] text-gray-500">{row.session_title}</span>
            <span className="text-[11px] text-gray-600">{date}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <StarChip label="Overall" value={row.rating_overall} />
            <StarChip label="Materials" value={row.rating_materials} />
            <StarChip label="Mentor" value={Math.round((row.rating_mentor_clarity + row.rating_mentor_management + row.rating_mentor_engagement) / 3)} />
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="text-gray-500 shrink-0" /> : <ChevronDown size={14} className="text-gray-500 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.04]">
          {/* All ratings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3">
            {[
              { label: 'Materials', value: row.rating_materials },
              { label: 'Exercises', value: row.rating_exercises },
              { label: 'Mentor clarity', value: row.rating_mentor_clarity },
              { label: 'Mentor management', value: row.rating_mentor_management },
              { label: 'Mentor engagement', value: row.rating_mentor_engagement },
              { label: 'Overall', value: row.rating_overall },
            ].map(d => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 flex-1">{d.label}</span>
                <span className="text-xs font-semibold text-gray-200 flex items-center gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={10}
                      className={n <= d.value ? 'text-amber-400 fill-amber-400' : 'text-gray-700'} />
                  ))}
                </span>
              </div>
            ))}
          </div>

          {/* Text responses */}
          <div className="space-y-3 mt-1">
            {row.comment_highlight && (
              <Comment label="Most valuable" text={row.comment_highlight} color="green" />
            )}
            {row.comment_improve && (
              <Comment label="Could improve" text={row.comment_improve} color="amber" />
            )}
            {row.comment_other && (
              <Comment label="Other comments" text={row.comment_other} color="gray" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StarChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-[11px] text-gray-400 flex items-center gap-1">
      {label}:
      <Star size={10} className="text-amber-400 fill-amber-400" />
      <span className="text-gray-300 font-medium">{value}</span>
    </span>
  )
}

function Comment({ label, text, color }: {
  label: string; text: string; color: 'green' | 'amber' | 'gray'
}) {
  const cls = color === 'green'
    ? 'bg-green-950/30 border-green-900/50 text-green-400'
    : color === 'amber'
    ? 'bg-amber-950/30 border-amber-900/50 text-amber-400'
    : 'bg-white/[0.03] border-white/[0.06] text-gray-400'
  return (
    <div className={`rounded-lg border px-3 py-2 ${cls}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xs text-gray-300 whitespace-pre-wrap">{text}</p>
    </div>
  )
}

const selectCls =
  'px-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-white/10 text-sm text-gray-200 ' +
  'focus:outline-none focus:border-primary-500/50 min-w-[180px]'
