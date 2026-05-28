import { useState } from 'react'
import {
  Star, Users, ChevronDown, ChevronUp, TrendingUp, TrendingDown,
  ThumbsUp, AlertTriangle, BarChart3, Lightbulb, Search, X,
} from 'lucide-react'
import { useFeedbackAdmin, type FeedbackRow, type FeedbackStats } from '../../hooks/useFeedback'
import { useCohortAdmin } from '../../hooks/useCohortAdmin'

export function FeedbackAnalyticsPanel() {
  const { cohorts, loading: cohortsLoading } = useCohortAdmin()
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const activeCohortId = selectedCohort ?? cohorts[0]?.id ?? null
  const { rows, stats, loading } = useFeedbackAdmin(activeCohortId, selectedSession)

  const sessionOptions = [...new Map(rows.map(r => [r.session_id, r.session_title])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-200">Session Feedback</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Aggregated student ratings, insights, and comments per cohort.
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
          <InsightsPanel rows={rows} />
          <ResponseList rows={rows} />
        </>
      )}
    </div>
  )
}

// ── Stats grid ─────────────────────────────────────────────────────────

function StatsGrid({ stats }: { stats: FeedbackStats }) {
  const dims = [
    { label: 'Materials',         value: stats.avg_materials },
    { label: 'Exercises',         value: stats.avg_exercises },
    { label: 'Mentor clarity',    value: stats.avg_mentor_clarity },
    { label: 'Mentor management', value: stats.avg_mentor_management },
    { label: 'Mentor engagement', value: stats.avg_mentor_engagement },
    { label: 'Overall',           value: stats.avg_overall },
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

// ── Insights Panel ─────────────────────────────────────────────────────

const RATING_DIMS = [
  { key: 'rating_materials' as const,         label: 'Materials' },
  { key: 'rating_exercises' as const,         label: 'Exercises' },
  { key: 'rating_mentor_clarity' as const,    label: 'Mentor Clarity' },
  { key: 'rating_mentor_management' as const, label: 'Mentor Management' },
  { key: 'rating_mentor_engagement' as const, label: 'Mentor Engagement' },
  { key: 'rating_overall' as const,           label: 'Overall' },
]

function rowAvg(row: FeedbackRow): number {
  const vals = RATING_DIMS.map(d => row[d.key])
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function colAvg(rows: FeedbackRow[], key: keyof FeedbackRow): number {
  const vals = rows.map(r => r[key] as number)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

function InsightsPanel({ rows }: { rows: FeedbackRow[] }) {
  const sorted = [...rows].sort((a, b) => rowAvg(b) - rowAvg(a))
  const topStudent = sorted[0]
  const bottomStudent = sorted[sorted.length - 1]

  const dimAvgs = RATING_DIMS.map(d => ({ ...d, avg: colAvg(rows, d.key) }))
  const bestDim  = [...dimAvgs].sort((a, b) => b.avg - a.avg)[0]
  const worstDim = [...dimAvgs].sort((a, b) => a.avg - b.avg)[0]

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: rows.filter(r => r.rating_overall === star).length,
  }))

  const mentorAvg = colAvg(rows, 'rating_mentor_clarity') * (1/3)
    + colAvg(rows, 'rating_mentor_management') * (1/3)
    + colAvg(rows, 'rating_mentor_engagement') * (1/3)
  const contentAvg = (colAvg(rows, 'rating_materials') + colAvg(rows, 'rating_exercises')) / 2

  const promoters  = rows.filter(r => r.rating_overall === 5).length
  const passives   = rows.filter(r => r.rating_overall === 4).length
  const detractors = rows.filter(r => r.rating_overall <= 3).length
  const nps = Math.round(((promoters - detractors) / rows.length) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb size={14} className="text-amber-400" />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Insights</p>
      </div>

      {/* Row 1: Student spotlight + Dimension highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StudentSpotlight topStudent={topStudent} bottomStudent={bottomStudent} />
        <DimensionHighlights bestDim={bestDim} worstDim={worstDim} dimAvgs={dimAvgs} />
      </div>

      {/* Row 2: Rating distribution + Mentor vs Content + NPS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RatingDistribution distribution={distribution} total={rows.length} />
        <MentorVsContent mentorAvg={mentorAvg} contentAvg={contentAvg} />
        <NpsCard promoters={promoters} passives={passives} detractors={detractors} nps={nps} total={rows.length} />
      </div>

      {/* Row 3: Word frequency clouds */}
      <WordFrequencySection rows={rows} />
    </div>
  )
}

// ── Student spotlight ─────────────────────────────────────────────────

function StudentSpotlight({ topStudent, bottomStudent }: {
  topStudent: FeedbackRow; bottomStudent: FeedbackRow
}) {
  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4 space-y-3">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Student Spotlight</p>
      <SpotlightRow
        icon={<ThumbsUp size={13} className="text-green-400" />}
        label="Most Satisfied"
        row={topStudent}
        colorCls="text-green-400"
      />
      <div className="border-t border-white/[0.05]" />
      <SpotlightRow
        icon={<AlertTriangle size={13} className="text-red-400" />}
        label="Needs Attention"
        row={bottomStudent}
        colorCls="text-red-400"
      />
    </div>
  )
}

function SpotlightRow({ icon, label, row, colorCls }: {
  icon: React.ReactNode; label: string; row: FeedbackRow; colorCls: string
}) {
  const name = row.profile?.full_name || row.profile?.email || 'Anonymous'
  const avg = rowAvg(row)
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-600 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-200 truncate">{name}</p>
        {row.session_title && (
          <p className="text-[10px] text-gray-600 truncate">{row.session_title}</p>
        )}
      </div>
      <span className={`text-sm font-bold shrink-0 ${colorCls}`}>{avg.toFixed(1)}</span>
    </div>
  )
}

// ── Dimension highlights ───────────────────────────────────────────────

function DimensionHighlights({ bestDim, worstDim, dimAvgs }: {
  bestDim: { label: string; avg: number }
  worstDim: { label: string; avg: number }
  dimAvgs: { label: string; avg: number }[]
}) {
  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4 space-y-3">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Top & Bottom Areas</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={13} className="text-green-400 shrink-0" />
          <span className="text-xs text-gray-400 flex-1">Strength</span>
          <span className="text-xs font-semibold text-green-400">{bestDim.label}</span>
          <span className="text-[11px] text-gray-500">★{bestDim.avg.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown size={13} className="text-amber-400 shrink-0" />
          <span className="text-xs text-gray-400 flex-1">Needs work</span>
          <span className="text-xs font-semibold text-amber-400">{worstDim.label}</span>
          <span className="text-[11px] text-gray-500">★{worstDim.avg.toFixed(1)}</span>
        </div>
      </div>
      <div className="border-t border-white/[0.05] pt-3 space-y-1.5">
        {dimAvgs.sort((a, b) => b.avg - a.avg).map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-[10px] text-gray-600 w-28 truncate">{d.label}</span>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${d.avg >= 4 ? 'bg-green-500' : d.avg >= 3 ? 'bg-primary-500' : 'bg-amber-500'}`}
                style={{ width: `${(d.avg / 5) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 w-6 text-right">{d.avg.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Rating distribution ────────────────────────────────────────────────

function RatingDistribution({ distribution, total }: {
  distribution: { star: number; count: number }[]; total: number
}) {
  const max = Math.max(...distribution.map(d => d.count), 1)
  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <BarChart3 size={13} className="text-gray-500" />
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Overall Distribution</p>
      </div>
      <div className="space-y-1.5">
        {distribution.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-[10px] text-amber-400 w-4 text-right">{star}★</span>
            <div className="flex-1 h-3 bg-white/5 rounded-sm overflow-hidden">
              <div
                className="h-full bg-amber-400/70 rounded-sm transition-all"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 w-8 text-right">
              {count} <span className="text-gray-700">({Math.round((count / total) * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Mentor vs Content ─────────────────────────────────────────────────

function MentorVsContent({ mentorAvg, contentAvg }: { mentorAvg: number; contentAvg: number }) {
  const gap = Math.abs(mentorAvg - contentAvg)
  const stronger = mentorAvg >= contentAvg ? 'Mentor' : 'Content'
  const weaker   = mentorAvg >= contentAvg ? 'Content' : 'Mentor'

  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Mentor vs Content</p>
      <div className="space-y-2.5">
        {[
          { label: 'Mentor delivery', value: mentorAvg, color: 'bg-violet-500' },
          { label: 'Content quality', value: contentAvg, color: 'bg-cyan-500' },
        ].map(d => (
          <div key={d.label}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-gray-500">{d.label}</span>
              <span className="text-[10px] font-semibold text-gray-300">★{d.value.toFixed(1)}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.value / 5) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      {gap > 0.3 && (
        <p className="mt-3 text-[10px] text-gray-600 leading-snug">
          <span className="text-amber-400 font-medium">{weaker}</span> is {gap.toFixed(1)} pts behind{' '}
          <span className="text-gray-400">{stronger}</span> — consider focusing here.
        </p>
      )}
    </div>
  )
}

// ── NPS-like card ─────────────────────────────────────────────────────

function NpsCard({ promoters, passives, detractors, nps, total }: {
  promoters: number; passives: number; detractors: number; nps: number; total: number
}) {
  const npsColor = nps >= 50 ? 'text-green-400' : nps >= 0 ? 'text-amber-400' : 'text-red-400'
  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Satisfaction Index</p>
      <div className="flex items-end gap-3 mb-3">
        <span className={`text-3xl font-bold ${npsColor}`}>{nps > 0 ? '+' : ''}{nps}</span>
        <span className="text-[10px] text-gray-600 mb-1">score</span>
      </div>
      <div className="space-y-1">
        {[
          { label: 'Promoters',  count: promoters,  pct: Math.round((promoters  / total) * 100), color: 'bg-green-500' },
          { label: 'Passives',   count: passives,   pct: Math.round((passives   / total) * 100), color: 'bg-gray-500' },
          { label: 'Detractors', count: detractors, pct: Math.round((detractors / total) * 100), color: 'bg-red-500' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.color}`} />
            <span className="text-[10px] text-gray-500 flex-1">{s.label}</span>
            <span className="text-[10px] text-gray-400">{s.count} ({s.pct}%)</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-gray-700">★5 = promoters · ★4 = passives · ★1–3 = detractors</p>
    </div>
  )
}

// ── Word frequency ─────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  // English
  'THE','AND','A','AN','IS','IT','IN','OF','TO','FOR','WAS','ARE','WITH','THIS',
  'THAT','ON','AT','BY','BE','AS','OR','BUT','NOT','FROM','SO','IF','MY','WE',
  'I','YOU','HE','SHE','THEY','ITS','OUR','YOUR','THEIR','HAVE','HAS','HAD',
  'DO','DID','WILL','CAN','COULD','WOULD','SHOULD','MAY','MIGHT','VERY','MUCH',
  'MORE','ALSO','JUST','BEEN','WERE','WHEN','WHICH','WHO','WHAT','HOW','ALL',
  'SOME','ABOUT','THAN','THEM','ME','HIM','HER','US','INTO','OUT','UP','DOWN',
  'NO','YES','WELL','LIKE','GET','GO','MAKE','KNOW','NEW','REALLY','QUITE','ONE',
  // Indonesian
  'DAN','YANG','DI','INI','ITU','DENGAN','UNTUK','DARI','PADA','KE','ADA',
  'SUDAH','BISA','TIDAK','SANGAT','LEBIH','JUGA','SAYA','KITA','KAMI','MEREKA',
  'ANDA','SAAT','AKAN','ADALAH','JADI','KARENA','LAGI','BAGI','SERTA','AGAR',
  'SEHINGGA','NAMUN','TETAPI','ATAU','HAL','CARA','SAAT','SETIAP','SUDAH','SAJA',
  'MENJADI','MASIH','SUDAH','PERLU','CUKUP','MEMANG','SELALU','PARA','KAMI','ANDA',
])

function wordFreq(texts: string[]): { word: string; count: number }[] {
  const freq: Record<string, number> = {}
  for (const text of texts) {
    const words = text.toUpperCase().match(/\b[A-Z]{2,}\b/g) ?? []
    for (const w of words) {
      if (!STOP_WORDS.has(w)) freq[w] = (freq[w] ?? 0) + 1
    }
  }
  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50)
}

function WordCloud({ words, accentCls }: {
  words: { word: string; count: number }[]
  accentCls: string
}) {
  if (words.length === 0) {
    return <p className="text-xs text-gray-700 italic">Not enough text responses yet.</p>
  }
  const maxCount = words[0].count
  const minCount = words[words.length - 1].count
  const scale = maxCount === minCount ? 1 : maxCount - minCount

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 items-baseline leading-relaxed">
      {words.map(({ word, count }) => {
        const ratio = (count - minCount) / scale   // 0..1
        const fontSize = Math.round(11 + ratio * 20) // 11px – 31px
        const opacity  = 0.35 + ratio * 0.65         // 0.35 – 1.0
        return (
          <span
            key={word}
            title={`${count} mention${count !== 1 ? 's' : ''}`}
            className={`font-bold cursor-default transition-opacity hover:opacity-100 ${accentCls}`}
            style={{ fontSize, opacity }}
          >
            {word}
            <sup className="text-[8px] text-gray-600 ml-0.5 font-normal">{count}</sup>
          </span>
        )
      })}
    </div>
  )
}

function WordFrequencySection({ rows }: { rows: FeedbackRow[] }) {
  const highlights = wordFreq(rows.map(r => r.comment_highlight).filter(Boolean))
  const improves   = wordFreq(rows.map(r => r.comment_improve).filter(Boolean))
  const others     = wordFreq(rows.map(r => r.comment_other).filter(Boolean))

  const sections = [
    { label: 'What students valued most',   words: highlights, accentCls: 'text-emerald-400', subtext: 'From "most valuable" responses' },
    { label: 'Areas to improve',             words: improves,   accentCls: 'text-amber-400',   subtext: 'From "could improve" responses' },
    { label: 'Other themes',                 words: others,     accentCls: 'text-gray-400',    subtext: 'From "other comments" responses' },
  ]

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
        Word Frequency — Text Responses
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {sections.map(s => (
          <div key={s.label} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-300 mb-0.5">{s.label}</p>
            <p className="text-[10px] text-gray-600 mb-3">{s.subtext}</p>
            <WordCloud words={s.words} accentCls={s.accentCls} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Individual responses ───────────────────────────────────────────────

type SortKey = 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'name'

function ResponseList({ rows }: { rows: FeedbackRow[] }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [filterHasComment, setFilterHasComment] = useState(false)

  const q = search.trim().toLowerCase()

  const filtered = rows
    .filter(r => {
      if (filterRating !== null && r.rating_overall !== filterRating) return false
      if (filterHasComment && !r.comment_highlight && !r.comment_improve && !r.comment_other) return false
      if (q) {
        const name = (r.profile?.full_name ?? r.profile?.email ?? '').toLowerCase()
        const comments = [r.comment_highlight, r.comment_improve, r.comment_other]
          .filter(Boolean).join(' ').toLowerCase()
        if (!name.includes(q) && !comments.includes(q)) return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
        case 'oldest':      return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
        case 'rating_high': return b.rating_overall - a.rating_overall
        case 'rating_low':  return a.rating_overall - b.rating_overall
        case 'name': {
          const na = (a.profile?.full_name ?? a.profile?.email ?? '').toLowerCase()
          const nb = (b.profile?.full_name ?? b.profile?.email ?? '').toLowerCase()
          return na.localeCompare(nb)
        }
        default: return 0
      }
    })

  const hasFilters = !!q || filterRating !== null || filterHasComment

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Individual Responses
        </p>
        <span className="text-[11px] text-gray-600">
          {filtered.length !== rows.length
            ? `${filtered.length} of ${rows.length}`
            : `${rows.length} total`}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or comment…"
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

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortKey)}
          className={selectCls}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="rating_high">Rating: High → Low</option>
          <option value="rating_low">Rating: Low → High</option>
          <option value="name">Name A → Z</option>
        </select>

        {/* Filter: Overall rating */}
        <select
          value={filterRating ?? ''}
          onChange={e => setFilterRating(e.target.value ? Number(e.target.value) : null)}
          className={selectCls}
        >
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>★{n} only</option>
          ))}
        </select>

        {/* Filter: Has comments toggle */}
        <button
          onClick={() => setFilterHasComment(v => !v)}
          className={`px-3 py-1.5 rounded-lg border text-xs transition-colors whitespace-nowrap ${
            filterHasComment
              ? 'bg-primary-600/20 border-primary-500/40 text-primary-400'
              : 'bg-[#0a0e1a] border-white/10 text-gray-400 hover:text-gray-300'
          }`}
        >
          With comments
        </button>

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setFilterRating(null); setFilterHasComment(false) }}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-500 hover:text-gray-300 hover:border-white/20 transition-colors whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-10 border border-dashed border-white/[0.06] rounded-xl">
          No responses match your filters.
        </p>
      ) : (
        filtered.map(r => <ResponseCard key={r.id} row={r} searchQuery={q} />)
      )}
    </div>
  )
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-400/25 text-amber-300 rounded-sm">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function ResponseCard({ row, searchQuery = '' }: { row: FeedbackRow; searchQuery?: string }) {
  const [expanded, setExpanded] = useState(false)
  const nameRaw = row.profile?.full_name || row.profile?.email || 'Anonymous'
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
            <span className="text-sm text-gray-200 font-medium truncate">
              <Highlight text={nameRaw} query={searchQuery} />
            </span>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3">
            {[
              { label: 'Materials',         value: row.rating_materials },
              { label: 'Exercises',         value: row.rating_exercises },
              { label: 'Mentor clarity',    value: row.rating_mentor_clarity },
              { label: 'Mentor management', value: row.rating_mentor_management },
              { label: 'Mentor engagement', value: row.rating_mentor_engagement },
              { label: 'Overall',           value: row.rating_overall },
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

          <div className="space-y-3 mt-1">
            {row.comment_highlight && (
              <Comment label="Most valuable" text={row.comment_highlight} color="green" searchQuery={searchQuery} />
            )}
            {row.comment_improve && (
              <Comment label="Could improve" text={row.comment_improve} color="amber" searchQuery={searchQuery} />
            )}
            {row.comment_other && (
              <Comment label="Other comments" text={row.comment_other} color="gray" searchQuery={searchQuery} />
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

function Comment({ label, text, color, searchQuery = '' }: {
  label: string; text: string; color: 'green' | 'amber' | 'gray'; searchQuery?: string
}) {
  const cls = color === 'green'
    ? 'bg-green-950/30 border-green-900/50 text-green-400'
    : color === 'amber'
    ? 'bg-amber-950/30 border-amber-900/50 text-amber-400'
    : 'bg-white/[0.03] border-white/[0.06] text-gray-400'
  return (
    <div className={`rounded-lg border px-3 py-2 ${cls}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xs text-gray-300 whitespace-pre-wrap">
        <Highlight text={text} query={searchQuery} />
      </p>
    </div>
  )
}

const selectCls =
  'px-3 py-1.5 rounded-lg bg-[#0a0e1a] border border-white/10 text-sm text-gray-200 ' +
  'focus:outline-none focus:border-primary-500/50 min-w-[180px]'
