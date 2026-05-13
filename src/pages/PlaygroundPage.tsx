import { useState } from 'react'
import { Play, RotateCcw, Database, ChevronDown, ChevronRight } from 'lucide-react'
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">SQL Playground</h1>
        <p className="text-gray-400 text-sm mt-1">
          Practice SQL freely on the e-commerce dataset — no grading, just explore.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Schema sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
            <Database size={15} />
            Schema
          </div>

          {DATASET_INFO.tables.map(table => (
            <div key={table.name} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenTable(openTable === table.name ? null : table.name)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-200 hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-mono font-medium">{table.name}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{table.rowCount} rows</span>
                  {openTable === table.name
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />}
                </span>
              </button>

              {openTable === table.name && (
                <div className="border-t border-gray-800 px-4 py-3 space-y-1">
                  <p className="text-xs text-gray-500 mb-2">{table.description}</p>
                  {table.columns.map(col => (
                    <div key={col} className="font-mono text-xs text-gray-400 py-0.5">
                      {col}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Editor + results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            <SqlEditor value={query} onChange={setQuery} height="240px" />

            <div className="flex items-center gap-3">
              <button
                onClick={runCurrentQuery}
                disabled={loading}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Play size={14} />
                {loading ? 'Running…' : 'Run Query'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-600 px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <RotateCcw size={14} />
                Reset DB
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Results</h3>
            <ResultsTable result={result} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
