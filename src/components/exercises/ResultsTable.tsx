import type { QueryResult } from '../../lib/sqlSimulator'
import { AlertCircle, CheckCircle2, Table, Download } from 'lucide-react'

interface ResultsTableProps {
  result: QueryResult | null
  loading?: boolean
}

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function downloadResultAsCsv(result: QueryResult) {
  const lines = [
    result.columns.map(escapeCsvCell).join(','),
    ...result.rows.map(row => result.columns.map(col => escapeCsvCell(row[col])).join(',')),
  ]
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `query-result-${Date.now()}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function ResultsTable({ result, loading }: ResultsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3 py-1">
        {/* Fake header row */}
        <div className="flex gap-3">
          {[120, 90, 100, 80].map((w, i) => (
            <div key={i} className="h-3 rounded-md bg-gray-700/60 animate-pulse" style={{ width: w }} />
          ))}
        </div>
        {/* Fake data rows */}
        {[1, 2, 3, 4].map(row => (
          <div key={row} className="flex gap-3 items-center">
            {[120, 90, 100, 80].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-md bg-gray-800/80 animate-pulse"
                style={{ width: w, animationDelay: `${row * 60 + i * 20}ms` }}
              />
            ))}
          </div>
        ))}
        <p className="text-xs text-gray-600 pt-1 flex items-center gap-1.5">
          <span className="w-3 h-3 border border-primary-500/60 border-t-transparent rounded-full animate-spin inline-block" />
          Running query…
        </p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
        <Table size={16} /> Run a query to see results here.
      </div>
    )
  }

  if (result.error) {
    return (
      <div className="flex items-start gap-2 bg-red-950/40 border border-red-800 rounded-xl p-4 text-sm text-red-300">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-red-200 mb-1">Query Error</p>
          <p className="font-mono text-xs">{result.error}</p>
        </div>
      </div>
    )
  }

  if (result.rows.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
        <CheckCircle2 size={16} className="text-green-400" />
        Query executed — no rows returned.
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400">
          {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned
        </p>
        <button
          onClick={() => downloadResultAsCsv(result)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Download size={12} /> Download CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              {result.columns.map(col => (
                <th key={col} className="px-3 py-2 text-xs font-semibold text-gray-300 uppercase tracking-wide whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {result.rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                {result.columns.map(col => (
                  <td key={col} className="px-3 py-2 text-gray-300 font-mono text-xs whitespace-nowrap max-w-xs truncate">
                    {row[col] === null || row[col] === undefined
                      ? <span className="text-gray-600 italic">null</span>
                      : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
