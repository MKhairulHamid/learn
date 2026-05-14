import { useState } from 'react'
import { Play, RotateCcw, ChevronDown, ChevronRight, Circle, Table2, Columns3 } from 'lucide-react'
import { SqlEditor } from '../components/exercises/SqlEditor'
import { ResultsTable } from '../components/exercises/ResultsTable'
import { runQuery, resetDB } from '../lib/sqlSimulator'
import { DATASET_INFO } from '../data/datasets/ecommerce'
import type { QueryResult } from '../lib/sqlSimulator'

const STARTER = `-- E-commerce database: customers, products, orders, order_items
-- Try a query below!

SELECT c.name, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'completed'
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 5;`

export default function PlaygroundPage() {
  const [query, setQuery] = useState(STARTER)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [openTable, setOpenTable] = useState<string | null>(null)

  async function runCurrentQuery() {
    setLoading(true)
    const r = await runQuery(query)
    setResult(r)
    setLoading(false)
  }

  async function handleReset() {
    await resetDB()
    setResult(null)
    setQuery(STARTER)
  }

  const rowCount = result?.rows?.length ?? 0
  const colCount = result?.columns?.length ?? 0

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Top header bar */}
      <div className="border-b border-white/[0.06] bg-[#0d1221]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Table2 size={14} className="text-cyan-400" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">SQL Playground</span>
              <span className="ml-2 text-xs text-gray-500">E-commerce dataset</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <Circle size={6} className="fill-green-400 text-green-400" />
              Connected
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">

          {/* ── Schema explorer ── */}
          <aside className="space-y-2">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest px-1 mb-3">
              Schema Explorer
            </p>
            {DATASET_INFO.tables.map(table => (
              <div key={table.name} className="rounded-xl overflow-hidden bg-[#111827] border border-white/[0.06]">
                <button
                  onClick={() => setOpenTable(openTable === table.name ? null : table.name)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Table2 size={13} className="text-cyan-500/70 shrink-0" />
                    <span className="font-mono text-sm text-gray-200 truncate">{table.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-md">
                      {table.rowCount}r
                    </span>
                    {openTable === table.name
                      ? <ChevronDown size={13} className="text-gray-500" />
                      : <ChevronRight size={13} className="text-gray-600" />
                    }
                  </div>
                </button>

                {openTable === table.name && (
                  <div className="border-t border-white/[0.05] px-4 py-3 space-y-1.5">
                    <p className="text-[11px] text-gray-600 mb-2 leading-snug">{table.description}</p>
                    {table.columns.map(col => (
                      <div key={col} className="flex items-center gap-2">
                        <Columns3 size={10} className="text-gray-700 shrink-0" />
                        <span className="font-mono text-[11px] text-gray-400">{col}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Keyboard hint */}
            <p className="text-[11px] text-gray-700 px-1 pt-2">
              Tip: press <kbd className="bg-gray-800 text-gray-500 px-1 py-0.5 rounded text-[10px]">Ctrl+Enter</kbd> to run
            </p>
          </aside>

          {/* ── Editor + results ── */}
          <div className="space-y-4 min-w-0">

            {/* Editor panel */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111827]">
              {/* Tab bar */}
              <div className="flex items-center gap-0 border-b border-white/[0.06] bg-[#0d1221]">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-cyan-500 text-xs text-gray-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
                  query.sql
                </div>
                <div className="ml-auto flex items-center gap-2 pr-4">
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                  <button
                    onClick={runCurrentQuery}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                  >
                    <Play size={12} />
                    {loading ? 'Running…' : 'Run Query'}
                  </button>
                </div>
              </div>

              {/* Monaco editor */}
              <div className="p-1">
                <SqlEditor value={query} onChange={setQuery} height="240px" />
              </div>
            </div>

            {/* Results panel */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111827] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Table2 size={13} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Results</span>
                </div>
                {result && !result.error && rowCount > 0 && (
                  <span className="text-[11px] text-gray-500 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-md">
                    {rowCount} row{rowCount !== 1 ? 's' : ''} · {colCount} col{colCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="p-4">
                {!result && !loading && (
                  <div className="py-10 text-center">
                    <Table2 size={24} className="text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Run a query to see results here.</p>
                  </div>
                )}
                {(result || loading) && (
                  <ResultsTable result={result} loading={loading} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
