import { CheckCircle2, XCircle, Trophy } from 'lucide-react'
import type { TestResult } from '../../types'

interface TestResultPanelProps {
  results: TestResult[]
  lang?: 'en' | 'id'
}

export function TestResultPanel({ results, lang = 'en' }: TestResultPanelProps) {
  const passed = results.filter(r => r.passed).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-200">Test Results</h4>
        <span className={`text-sm font-medium ${passed === results.length ? 'text-green-400' : 'text-yellow-400'}`}>
          {passed}/{results.length} passed
        </span>
      </div>

      {passed === results.length && (
        <div className="flex items-center gap-2 bg-green-950/40 border border-green-800 rounded-xl px-4 py-3 mb-3">
          <Trophy size={18} className="text-green-400" />
          <span className="text-green-300 text-sm font-medium">
            {lang === 'id' ? 'Semua tes lulus! Kerja bagus!' : 'All tests passed! Great work!'}
          </span>
        </div>
      )}

      {results.map(r => (
        <div key={r.test_id}
          className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border ${
            r.passed
              ? 'bg-green-950/30 border-green-900 text-green-300'
              : 'bg-red-950/30 border-red-900 text-red-300'
          }`}>
          {r.passed
            ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-green-400" />
            : <XCircle size={16} className="shrink-0 mt-0.5 text-red-400" />}
          <span className="font-mono text-xs leading-relaxed">
            {lang === 'id' ? r.message_id : r.message_en}
          </span>
        </div>
      ))}
    </div>
  )
}
