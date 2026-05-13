import type { QueryResult } from '../../lib/sqlSimulator'
import { AlertCircle, CheckCircle2, Table } from 'lucide-react'

interface ResultsTableProps {
  result: QueryResult | null
  loading?: boolean
}

export function ResultsTable({ result, loading }: ResultsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
        <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
        Running query...
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
      <p className="text-xs text-gray-400 mb-2">
        {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned
      </p>
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
