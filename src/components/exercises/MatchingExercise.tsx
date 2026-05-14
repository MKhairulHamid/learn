import { useMemo, useState, useRef, useLayoutEffect, useCallback } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { TestResult } from '../../types'

interface Pair { left: string; right: string }

interface Props {
  pairs: Pair[]
  selections: string[]
  onChange: (selections: string[]) => void
  testResults: TestResult[] | null
  allPassed: boolean
  lang: 'en' | 'id'
}

// One distinct color per pair slot (up to 6 pairs)
const PAIR_COLORS = [
  { stroke: '#38bdf8', bg: 'bg-sky-500/10',     border: 'border-sky-500/50',     badge: '#38bdf8' },
  { stroke: '#a78bfa', bg: 'bg-violet-500/10',  border: 'border-violet-500/50',  badge: '#a78bfa' },
  { stroke: '#34d399', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', badge: '#34d399' },
  { stroke: '#fb923c', bg: 'bg-orange-500/10',  border: 'border-orange-500/50',  badge: '#fb923c' },
  { stroke: '#f472b6', bg: 'bg-pink-500/10',    border: 'border-pink-500/50',    badge: '#f472b6' },
  { stroke: '#facc15', bg: 'bg-yellow-500/10',  border: 'border-yellow-500/50',  badge: '#facc15' },
]

/** Deterministic shuffle so right column order is consistent across renders */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) | 0
    const j = Math.abs(hash) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

interface LineCoord {
  x1: number; y1: number
  x2: number; y2: number
  stroke: string
  leftIdx: number
}

export function MatchingExercise({ pairs, selections, onChange, testResults, allPassed, lang }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [lines, setLines] = useState<LineCoord[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const leftRefs  = useRef<(HTMLDivElement | null)[]>([])
  const rightRefs = useRef<(HTMLDivElement | null)[]>([])

  const shuffledRight = useMemo(
    () => seededShuffle(pairs.map(p => p.right), pairs.map(p => p.left).join('')),
    [pairs],
  )

  // right-value → left index
  const rightToLeft = useMemo(() => {
    const m: Record<string, number> = {}
    selections.forEach((s, i) => { if (s) m[s] = i })
    return m
  }, [selections])

  // Recompute SVG bezier positions whenever selections change
  const computeLines = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cr = container.getBoundingClientRect()

    const next: LineCoord[] = []
    selections.forEach((rightValue, leftIdx) => {
      if (!rightValue) return
      const rightIdx = shuffledRight.indexOf(rightValue)
      const leftEl  = leftRefs.current[leftIdx]
      const rightEl = rightRefs.current[rightIdx]
      if (!leftEl || !rightEl) return

      const lr = leftEl.getBoundingClientRect()
      const rr = rightEl.getBoundingClientRect()

      let stroke = PAIR_COLORS[leftIdx % PAIR_COLORS.length].stroke
      if (testResults) stroke = testResults[leftIdx]?.passed ? '#4ade80' : '#f87171'

      next.push({
        x1: lr.right - cr.left,
        y1: lr.top + lr.height / 2 - cr.top,
        x2: rr.left  - cr.left,
        y2: rr.top  + rr.height / 2 - cr.top,
        stroke,
        leftIdx,
      })
    })
    setLines(next)
  }, [selections, shuffledRight, testResults])

  useLayoutEffect(() => {
    computeLines()
    const ro = new ResizeObserver(computeLines)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [computeLines])

  // ── Interaction ──────────────────────────────────────────────

  function handleLeftClick(idx: number) {
    if (allPassed) return
    setSelectedLeft(prev => (prev === idx ? null : idx))
  }

  function handleRightClick(value: string) {
    if (allPassed) return

    if (selectedLeft === null) {
      // No left selected — clicking a connected right disconnects it
      const existing = rightToLeft[value]
      if (existing !== undefined) {
        const next = [...selections]
        next[existing] = ''
        onChange(next)
      }
      return
    }

    const next = [...selections]
    // Remove this right value from any existing left pairing
    const existingLeft = rightToLeft[value]
    if (existingLeft !== undefined && existingLeft !== selectedLeft) next[existingLeft] = ''
    next[selectedLeft] = value
    onChange(next)
    setSelectedLeft(null)
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Instruction hint */}
      <p className="text-xs text-gray-500 flex items-center gap-1.5">
        <span className="inline-block w-4 h-4 rounded-full border border-gray-600 text-center leading-none text-[10px] text-gray-500 flex items-center justify-center">?</span>
        {lang === 'id'
          ? 'Klik item kiri untuk memilih, lalu klik pasangannya di kanan. Klik kanan yang sudah terhubung untuk melepasnya.'
          : 'Click a term on the left to select it, then click its match on the right. Click a connected right item to disconnect it.'}
      </p>

      {/* Two-column grid + SVG overlay */}
      <div ref={containerRef} className="relative grid grid-cols-2 gap-x-10">

        {/* SVG bezier lines (pointer-events-none so clicks pass through) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {lines.map((ln, i) => {
            const dx = (ln.x2 - ln.x1) * 0.55
            const d  = `M${ln.x1},${ln.y1} C${ln.x1 + dx},${ln.y1} ${ln.x2 - dx},${ln.y2} ${ln.x2},${ln.y2}`
            return (
              <g key={i}>
                {/* Glow halo */}
                <path d={d} fill="none" stroke={ln.stroke} strokeWidth={8}  strokeOpacity={0.12} strokeLinecap="round" />
                {/* Main curve */}
                <path d={d} fill="none" stroke={ln.stroke} strokeWidth={2}  strokeOpacity={0.85} strokeLinecap="round" />
                {/* Terminal dots */}
                <circle cx={ln.x1} cy={ln.y1} r={4} fill={ln.stroke} fillOpacity={0.9} />
                <circle cx={ln.x2} cy={ln.y2} r={4} fill={ln.stroke} fillOpacity={0.9} />
              </g>
            )
          })}
        </svg>

        {/* ── Left column ── */}
        <div className="space-y-2.5 relative" style={{ zIndex: 10 }}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            {lang === 'id' ? 'Konsep / Istilah' : 'Concept / Term'}
          </p>
          {pairs.map((pair, i) => {
            const isSelected  = selectedLeft === i
            const isConnected = !!selections[i]
            const result      = testResults?.[i]
            const color       = PAIR_COLORS[i % PAIR_COLORS.length]

            // Border + bg state
            let border = 'border-gray-700/60'
            let bg     = 'bg-gray-800/40'
            if (result) {
              border = result.passed ? 'border-green-600/50' : 'border-red-600/50'
              bg     = result.passed ? 'bg-green-950/30'     : 'bg-red-950/30'
            } else if (isSelected) {
              border = 'border-cyan-400/70'
              bg     = 'bg-cyan-950/30'
            } else if (isConnected) {
              border = color.border
              bg     = color.bg
            }

            return (
              <div
                key={i}
                ref={el => { leftRefs.current[i] = el }}
                onClick={() => handleLeftClick(i)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer
                  transition-all duration-150 select-none
                  ${bg} ${border}
                  ${!allPassed ? 'hover:brightness-110 active:scale-[0.98]' : ''}
                  ${isSelected ? 'ring-1 ring-cyan-400/40 shadow-lg shadow-cyan-500/10 scale-[1.01]' : ''}`}
              >
                {/* Number badge */}
                <span
                  className="w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors"
                  style={
                    result
                      ? { borderColor: result.passed ? '#4ade80' : '#f87171', color: result.passed ? '#4ade80' : '#f87171' }
                      : isConnected
                        ? { borderColor: color.badge, color: color.badge, backgroundColor: color.badge + '20' }
                        : undefined
                  }
                >
                  {result
                    ? (result.passed ? '✓' : '✗')
                    : (i + 1)}
                </span>
                <span className="text-sm text-gray-200 leading-snug flex-1">{pair.left}</span>
                {isSelected && (
                  <span className="text-[10px] text-cyan-400 font-semibold shrink-0 animate-pulse">→</span>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-2.5 relative" style={{ zIndex: 10 }}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            {lang === 'id' ? 'Pasangan yang Tepat' : 'Correct Match'}
          </p>
          {shuffledRight.map((option, i) => {
            const connLeftIdx = rightToLeft[option]
            const isConnected = connLeftIdx !== undefined
            const result      = isConnected ? testResults?.[connLeftIdx] : null
            const color       = PAIR_COLORS[(connLeftIdx ?? 0) % PAIR_COLORS.length]
            const isWaiting   = selectedLeft !== null && !isConnected

            let border = 'border-gray-700/60'
            let bg     = 'bg-gray-800/40'
            if (result) {
              border = result.passed ? 'border-green-600/50' : 'border-red-600/50'
              bg     = result.passed ? 'bg-green-950/30'     : 'bg-red-950/30'
            } else if (isConnected) {
              border = color.border
              bg     = color.bg
            } else if (isWaiting) {
              border = 'border-gray-600/80'
              bg     = 'bg-gray-800/70'
            }

            return (
              <div
                key={i}
                ref={el => { rightRefs.current[i] = el }}
                onClick={() => handleRightClick(option)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer
                  transition-all duration-150 select-none
                  ${bg} ${border}
                  ${!allPassed ? 'hover:brightness-110 active:scale-[0.98]' : ''}
                  ${isWaiting ? 'ring-1 ring-cyan-400/20' : ''}`}
              >
                {/* Status dot / icon */}
                {result ? (
                  result.passed
                    ? <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                    : <XCircle      size={14} className="text-red-400 shrink-0" />
                ) : (
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-colors"
                    style={{ backgroundColor: isConnected ? color.badge : '#374151' }}
                  />
                )}
                <span className={`text-sm leading-snug flex-1 ${
                  result
                    ? result.passed ? 'text-green-200' : 'text-red-200'
                    : 'text-gray-300'
                }`}>
                  {option}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reveal correct answers after a wrong submission */}
      {testResults && !allPassed && (
        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/60">
          <p className="text-xs font-semibold text-gray-400 mb-2.5">
            {lang === 'id' ? 'Jawaban yang benar:' : 'Correct answers:'}
          </p>
          {pairs.map((pair, i) => (
            <div key={i} className="flex items-start gap-2 text-xs py-0.5">
              <span className="text-gray-600 shrink-0">{i + 1}.</span>
              <span className="text-gray-300">{pair.left}</span>
              <span className="text-gray-600 mx-1">→</span>
              <span className="text-green-400">{pair.right}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
