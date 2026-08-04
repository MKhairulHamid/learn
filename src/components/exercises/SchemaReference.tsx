import { useState, type MouseEvent as ReactMouseEvent } from 'react'
import { ChevronDown, ChevronRight, Table2, Copy, Check } from 'lucide-react'
import type { DatasetName } from '../../lib/sqlSimulator'
import { SEDUH_DATASET_INFO, SEDUH_FORMULAS } from '../../data/datasets/seduh'
import { SQL_DATASETS } from '../../data/datasets/sqlDatasets'

type SchemaTable = { name: string; description: string; columns: string[]; rowCount: number }

// ── Column chip with copy-to-clipboard ────────────────────────────────

function ColumnChip({ col }: { col: string }) {
  const [copied, setCopied] = useState(false)

  async function copy(e: ReactMouseEvent) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(col)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard blocked — ignore.
    }
  }

  return (
    <button
      onClick={copy}
      title={`Copy "${col}"`}
      className="group flex items-center gap-1 text-[11px] font-mono text-gray-200 bg-white/10 border border-white/10 hover:border-blue-400/40 px-2 py-1 rounded-md transition-colors"
    >
      {col}
      {copied
        ? <Check size={11} className="text-green-400" />
        : <Copy size={11} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </button>
  )
}

function CopyAllColumns({ columns }: { columns: string[] }) {
  const [copied, setCopied] = useState(false)

  async function copy(e: ReactMouseEvent) {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(columns.join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // Clipboard blocked — ignore.
    }
  }

  return (
    <button
      onClick={copy}
      title="Copy all column names (comma-separated)"
      className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-blue-300 hover:text-blue-200 transition-colors"
    >
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy all'}
    </button>
  )
}

// ── Table cards — a fresh `key={dataset}` on this from the parent resets
// which card is expanded when the dataset switches, no effect needed. ──

function TableGrid({ tables }: { tables: SchemaTable[] }) {
  const [openTable, setOpenTable] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {tables.map(t => {
        const open = openTable === t.name
        return (
          <div
            key={t.name}
            className={`rounded-xl border transition-colors ${
              open
                ? 'border-blue-500/40 bg-blue-500/[0.10]'
                : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/15'
            }`}
          >
            <button
              onClick={() => setOpenTable(open ? null : t.name)}
              className="w-full text-left p-3"
              title={t.description}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-blue-300">{t.name}</span>
                {open
                  ? <ChevronDown size={12} className="text-gray-400" />
                  : <ChevronRight size={12} className="text-gray-400" />}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">{t.rowCount} rows · {t.columns.length} cols</div>
            </button>
            {open && (
              <div className="px-3 pb-3 -mt-1">
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">Columns</span>
                    <CopyAllColumns columns={t.columns} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {t.columns.map(col => (
                      <ColumnChip key={col} col={col} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Schema reference panel ──────────────────────────────────────────

interface Props {
  dataset: DatasetName
  /** When provided together with onDatasetChange, renders a dataset switcher. */
  datasets?: DatasetName[]
  onDatasetChange?: (next: DatasetName) => void
}

/** Same "click a table to see its columns" panel used by the SQL playground. */
export function SchemaReference({ dataset, datasets, onDatasetChange }: Props) {
  const active = SQL_DATASETS[dataset]
  const switchable = datasets && datasets.length > 1 && onDatasetChange

  return (
    <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] p-4">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Table2 size={13} className="text-blue-400" />
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
          Dataset
        </span>
        {switchable ? (
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] border border-white/10 p-0.5">
            {datasets!.map(key => (
              <button
                key={key}
                onClick={() => onDatasetChange!(key)}
                className={`cursor-pointer px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  key === dataset
                    ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40'
                    : 'text-gray-400 hover:text-gray-200 border border-transparent'
                }`}
              >
                {SQL_DATASETS[key].label}
              </button>
            ))}
          </div>
        ) : (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-500/20 text-blue-200 border border-blue-500/40">
            {active.label}
          </span>
        )}
        <span className="ml-auto text-[11px] text-gray-400 font-mono">
          {active.info.tables.length} tables · {active.info.totalRows.toLocaleString()} rows
        </span>
      </div>

      {dataset === 'seduh' && (
        <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
          {SEDUH_DATASET_INFO.blurb_en}{' '}
          <span className="font-mono text-gray-300">revenue = {SEDUH_FORMULAS.revenue}</span>
          {' · '}
          <span className="font-mono text-gray-300">profit = {SEDUH_FORMULAS.profit}</span>
        </p>
      )}

      <TableGrid key={dataset} tables={active.info.tables} />
    </div>
  )
}
