import { History, Trash2, X, Check, AlertCircle } from 'lucide-react'
import type { QueryHistoryEntry } from '../../hooks/useQueryHistory'

interface Props {
  history: QueryHistoryEntry[]
  onLoad: (code: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  accent?: string
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

/**
 * Sidebar-style list of previously run queries/scripts, backed by localStorage.
 * Click an entry to load it back into the editor.
 */
export function QueryHistoryPanel({ history, onLoad, onRemove, onClear, accent = 'text-blue-400' }: Props) {
  return (
    <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#0a0e18]">
        <History size={12} className={accent} />
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">History</span>
        <span className="text-[10px] text-gray-600 font-mono">{history.length}</span>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="ml-auto flex items-center gap-1 text-[10px] text-gray-500 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <Trash2 size={11} /> Clear
          </button>
        )}
      </div>

      <div className="max-h-[300px] overflow-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
            <History size={18} className="text-gray-700" />
            <p className="text-xs text-gray-600">
              Queries you run are saved here so you can review and re-run them.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {history.map(entry => (
              <li key={entry.id} className="group">
                <button
                  onClick={() => onLoad(entry.code)}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                  title="Load this into the editor"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {entry.ok
                      ? <Check size={11} className="text-green-400 shrink-0" />
                      : <AlertCircle size={11} className="text-red-400 shrink-0" />}
                    <span className="text-[10px] text-gray-500 truncate">{entry.summary}</span>
                    <span className="ml-auto text-[10px] text-gray-600 shrink-0">{timeAgo(entry.ranAt)}</span>
                    <button
                      onClick={e => { e.stopPropagation(); onRemove(entry.id) }}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-opacity shrink-0"
                      title="Remove"
                    >
                      <X size={11} />
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-gray-400 whitespace-pre-wrap line-clamp-2 leading-snug">
                    {entry.code.length > 140 ? entry.code.slice(0, 140) + '…' : entry.code}
                  </pre>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
