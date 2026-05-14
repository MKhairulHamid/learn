import { useMemo } from 'react'
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

export function MatchingExercise({ pairs, selections, onChange, testResults, allPassed, lang }: Props) {
  // Shuffle right options once — same order every render
  const shuffledRight = useMemo(
    () => seededShuffle(pairs.map(p => p.right), pairs.map(p => p.left).join('')),
    [pairs]
  )

  const placeholder = lang === 'id' ? '— Pilih jawaban —' : '— Select a match —'

  function select(index: number, value: string) {
    const next = [...selections]
    next[index] = value
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Column headers */}
      <div className="grid grid-cols-2 gap-3 px-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {lang === 'id' ? 'Konsep / Istilah' : 'Concept / Term'}
        </span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {lang === 'id' ? 'Pasangan yang Tepat' : 'Correct Match'}
        </span>
      </div>

      {pairs.map((pair, i) => {
        const result = testResults?.[i]
        const selected = selections[i] ?? ''
        const isCorrect = result?.passed
        const isWrong = result && !result.passed

        return (
          <div
            key={i}
            className={`grid grid-cols-2 gap-3 p-3 rounded-xl border transition-colors ${
              isCorrect
                ? 'bg-green-950/30 border-green-800'
                : isWrong
                ? 'bg-red-950/30 border-red-800'
                : 'bg-gray-800/50 border-gray-700'
            }`}
          >
            {/* Left item */}
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary-900/60 border border-primary-700 flex items-center justify-center text-xs font-bold text-primary-300 shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-gray-200 leading-snug">{pair.left}</span>
            </div>

            {/* Right dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={selected}
                  onChange={e => select(i, e.target.value)}
                  disabled={allPassed}
                  className={`w-full bg-gray-900 border rounded-lg px-3 py-1.5 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                    isCorrect
                      ? 'border-green-700 text-green-300'
                      : isWrong
                      ? 'border-red-700 text-red-300'
                      : 'border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <option value="" disabled>{placeholder}</option>
                  {shuffledRight.map((opt, j) => (
                    <option key={j} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {isCorrect && <CheckCircle2 size={16} className="text-green-400 shrink-0" />}
              {isWrong   && <XCircle     size={16} className="text-red-400 shrink-0"   />}
            </div>
          </div>
        )
      })}

      {/* Reveal correct answers after wrong submission */}
      {testResults && !allPassed && (
        <div className="mt-2 p-3 rounded-xl bg-gray-800/60 border border-gray-700">
          <p className="text-xs font-semibold text-gray-400 mb-2">
            {lang === 'id' ? 'Jawaban yang benar:' : 'Correct answers:'}
          </p>
          {pairs.map((pair, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-400 py-0.5">
              <span className="text-gray-500 shrink-0">{i + 1}.</span>
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
