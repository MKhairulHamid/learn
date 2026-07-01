import type { ReactNode } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   Shared slide primitives for the presentation system.
   Themed with the Talentiv brand palette (teal / mint).
   These are deliberately self-contained so a deck reads like a sequence of
   high-density, instructor-led slides.
───────────────────────────────────────────────────────────────────────────── */

// Talentiv brand assets are bundled locally (in public/brand) because the live
// talentiv.id images are hotlink-protected (403 / ORB) from other origins.
const ASSET = import.meta.env.BASE_URL

export const BRAND = {
  teal: '#1FA79B',
  mint: '#6DC4AA',
  light: '#D1EDE5',
  heroImage: `${ASSET}brand/talentiv-hero.png`,
  logoWhite: `${ASSET}brand/talentiv-logo-white.webp`,
  logoColor: 'https://talentiv.id/wp-content/uploads/2026/01/Desain-tanpa-judul-11-e1735010249654.png',
}

export function Glow({ className }: { className: string }) {
  return <div className={`absolute pointer-events-none rounded-full blur-[130px] ${className}`} />
}

/** Full-bleed centered slide shell with a subtle teal glow backdrop. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center px-5 sm:px-8 lg:px-12 py-6 sm:py-9 pb-16 relative overflow-hidden">
      <Glow className="top-0 right-0 w-[520px] h-[360px] bg-[#1FA79B]/12" />
      <Glow className="bottom-0 left-0 w-[460px] h-[320px] bg-[#6DC4AA]/8" />
      {children}
    </div>
  )
}

export function Tag({ label }: { label: string }) {
  return (
    <p className="text-[#6DC4AA] text-xs font-semibold uppercase tracking-widest mb-3 text-center">
      {label}
    </p>
  )
}

export function SlideTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <>
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center tracking-tight leading-tight">
        {children}
      </h2>
      {sub && <p className="text-center text-gray-400 text-sm sm:text-base mt-3 mb-6 sm:mb-10 max-w-2xl mx-auto">{sub}</p>}
    </>
  )
}

/** Generic check / bullet item. */
export function Bullet({ children, tone = 'good' }: { children: ReactNode; tone?: 'good' | 'bad' | 'neutral' }) {
  const dot =
    tone === 'good' ? 'bg-[#1FA79B]' : tone === 'bad' ? 'bg-red-500' : 'bg-gray-500'
  return (
    <li className="flex items-start gap-2.5 text-sm text-gray-300">
      <span className={`w-1.5 h-1.5 rounded-full ${dot} mt-1.5 shrink-0`} />
      <span>{children}</span>
    </li>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-5 ${className}`}>
      {children}
    </div>
  )
}

/** Card with an icon + title header. */
export function Panel({
  icon, title, children, className = '',
}: { icon?: ReactNode; title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#6DC4AA]/20 bg-[#6DC4AA]/[0.06] p-4 sm:p-5 ${className}`}>
      {(icon || title) && (
        <div className="flex items-center gap-2.5 mb-3">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-[#1FA79B]/15 border border-[#1FA79B]/20 flex items-center justify-center text-[#6DC4AA] shrink-0">
              {icon}
            </div>
          )}
          {title && <h3 className="font-semibold text-white text-sm sm:text-[15px]">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  )
}

/** Inline callout / note box. */
export function Note({
  tone = 'info', children, className = '',
}: { tone?: 'info' | 'warn' | 'danger'; children: ReactNode; className?: string }) {
  const tones: Record<string, string> = {
    info: 'border-[#1FA79B]/25 bg-[#1FA79B]/[0.06] text-gray-300',
    warn: 'border-amber-500/25 bg-amber-500/[0.07] text-amber-100/90',
    danger: 'border-red-500/25 bg-red-500/[0.07] text-gray-200',
  }
  return (
    <div className={`rounded-xl border ${tones[tone]} px-3.5 py-2.5 text-xs leading-relaxed ${className}`}>
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">{children}</p>
}

/* ── SQL syntax highlighter ──────────────────────────────────────────────────── */

function highlightSql(code: string): ReactNode[] {
  // Order matters: comments → strings → numbers → functions → keywords
  const token =
    /(--[^\n]*)|('[^']*')|\b(\d[\d.]*)\b|\b(COUNT|SUM|AVG|MIN|MAX|LOWER|UPPER|ROUND)\b|\b(SELECT|FROM|WHERE|ORDER\s+BY|GROUP\s+BY|HAVING|LIMIT|AND|OR|NOT|IN|BETWEEN|LIKE|IS|NULL|AS|ASC|DESC|DISTINCT|ON|JOIN|INNER|LEFT|RIGHT|TRUE|FALSE)\b/gi

  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = token.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const [match, comment, str, num, fn, kw] = m
    if (comment) out.push(<span key={key++} className="text-gray-500 italic">{match}</span>)
    else if (str) out.push(<span key={key++} className="text-amber-300">{match}</span>)
    else if (num) out.push(<span key={key++} className="text-orange-300">{match}</span>)
    else if (fn) out.push(<span key={key++} className="text-cyan-300">{match}</span>)
    else if (kw) out.push(<span key={key++} className="text-[#6DC4AA] font-semibold">{match}</span>)
    last = m.index + match.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function Sql({ children, className = '' }: { children: string; className?: string }) {
  return (
    <pre className={`bg-[#0b1220] border border-[#6DC4AA]/20 rounded-xl p-3.5 overflow-x-auto font-mono text-[11px] sm:text-[13px] leading-relaxed text-gray-200 ${className}`}>
      <code>{highlightSql(children.trim())}</code>
    </pre>
  )
}

/* ── Data table (renders the sample e-commerce tables) ───────────────────────── */

export function DataTable({
  caption,
  columns,
  rows,
  highlightCol,
}: {
  caption?: string
  columns: string[]
  rows: (string | number)[][]
  highlightCol?: number
}) {
  return (
    <div className="rounded-xl border border-[#6DC4AA]/20 overflow-hidden">
      {caption && (
        <div className="bg-[#6DC4AA]/[0.08] px-3 py-1.5 text-[10px] font-mono font-semibold text-[#6DC4AA] uppercase tracking-wider">
          {caption}
        </div>
      )}
      <table className="w-full text-[10px] sm:text-xs">
        <thead>
          <tr className="bg-[#6DC4AA]/[0.06] text-gray-400">
            {columns.map((c, i) => (
              <th key={c} className={`text-left font-semibold px-2.5 py-1.5 font-mono ${i === highlightCol ? 'text-[#1FA79B]' : ''}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-[#6DC4AA]/12">
              {r.map((cell, ci) => (
                <td key={ci} className={`px-2.5 py-1.5 text-gray-300 ${ci === highlightCol ? 'text-[#6DC4AA] font-medium bg-[#1FA79B]/[0.06]' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export interface Slide {
  /** Short label shown in the presenter view + progress tooltip. */
  label: string
  render: ReactNode
  /** Instructor-only talking points (markdown-ish plain text, shown in presenter window). */
  notes: string
}

export interface Presentation {
  id: string
  program: string
  session: string
  title: string
  subtitle: string
  durationMin: number
  slides: Slide[]
}
