import { useState } from 'react'
import { Lightbulb, ChevronDown } from 'lucide-react'

interface HintSystemProps {
  hints: string[]
  lang?: 'en' | 'id'
}

export function HintSystem({ hints, lang = 'en' }: HintSystemProps) {
  const [revealed, setRevealed] = useState(0)

  if (!hints || hints.length === 0) return null

  const canRevealMore = revealed < hints.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {lang === 'id' ? 'Petunjuk' : 'Hints'}
        </span>
        {canRevealMore && (
          <button
            onClick={() => setRevealed(r => r + 1)}
            className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <Lightbulb size={13} />
            {lang === 'id'
              ? `Tampilkan petunjuk ${revealed + 1}/${hints.length}`
              : `Show hint ${revealed + 1}/${hints.length}`}
            <ChevronDown size={13} />
          </button>
        )}
        {!canRevealMore && (
          <span className="text-xs text-gray-500">
            {lang === 'id' ? 'Semua petunjuk ditampilkan' : 'All hints shown'}
          </span>
        )}
      </div>

      {revealed > 0 && (
        <div className="space-y-2">
          {hints.slice(0, revealed).map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 bg-yellow-950/30 border border-yellow-900/50 rounded-xl px-4 py-3"
            >
              <Lightbulb size={14} className="shrink-0 mt-0.5 text-yellow-400" />
              <p className="text-yellow-200 text-xs leading-relaxed">{hint}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
