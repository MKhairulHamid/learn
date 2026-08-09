import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, RotateCcw, ChevronDown, ChevronRight, Circle, Code2, Terminal, Calculator, FileText, PanelLeftClose, PanelLeftOpen, Clock, Search, Target, Copy, Check } from 'lucide-react'
import { SqlEditor } from '../components/exercises/SqlEditor'
import { ResultsTable } from '../components/exercises/ResultsTable'
import { QueryHistoryPanel } from '../components/exercises/QueryHistoryPanel'
import { SchemaReference } from '../components/exercises/SchemaReference'
import { SQL_DATASETS } from '../data/datasets/sqlDatasets'
import { useQueryHistory, usePlaygroundDraft } from '../hooks/useQueryHistory'
import { runQuery, resetDB, DEFAULT_DATASET } from '../lib/sqlSimulator'
import type { DatasetName } from '../lib/sqlSimulator'
import { SEDUH_DATASET_INFO } from '../data/datasets/seduh'
import { loadSeduhCsvFiles } from '../lib/seduhCsv'
import { TRANSACTIONS_CSV, EMPLOYEES_CSV, CSV_DATASET_INFO } from '../data/datasets/retail_csv'
import { initPyodide, runPython, isPyodideReady, preloadCSVFiles } from '../lib/pyodideRunner'
import { useCohort } from '../hooks/useCohort'
import { usePrograms } from '../hooks/usePhases'
import HrPlaygroundPage from './HrPlaygroundPage'
import OvertimeCalculatorPage from './OvertimeCalculatorPage'
import XlookupSimulatorPage from './XlookupSimulatorPage'
import OkrBuilderPage from './OkrBuilderPage'
import type { QueryResult } from '../lib/sqlSimulator'
import type { PyLoadProgress, PyResult } from '../lib/pyodideRunner'

const SQL_STARTER: Record<DatasetName, string> = {
  // The final-project data. Numbers here match the learner's own workbook, so
  // the opening query is one of the eight business questions (Q1).
  seduh: `-- Seduh Coffee — the same four tables as your final-project workbook:
-- orders, customers, products, marketing_spend
-- Click a table above to see its columns (click a column to copy it).

-- Q1: which categories are most PROFITABLE, not just best-selling?
SELECT p.category,
       SUM(o.quantity)                                              AS units,
       ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct))) AS revenue,
       ROUND(SUM(o.quantity * (o.unit_price * (1 - o.discount_pct)
                               - p.unit_cost)))                     AS profit
FROM orders o
JOIN products p ON p.product_id = o.product_id
WHERE o.order_status = 'Completed'   -- only completed orders count as revenue
GROUP BY p.category
ORDER BY profit DESC;`,
  ecommerce: `-- E-commerce database — 8 tables to explore:
-- customers, products, categories, suppliers, employees, orders, order_items, reviews
-- Click a table above to see its columns (click a column to copy it). Try a query below!

SELECT c.name, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'completed'
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 5;`,
}

const PYTHON_STARTER = `import pandas as pd
import matplotlib.pyplot as plt

# CSV files are pre-loaded — use them like real files!
# Available: transactions.csv, employees.csv
df = pd.read_csv('transactions.csv')

print(f"Transactions: {len(df)} rows  |  Regions: {df['region'].nunique()}")
print(f"Date range:   {df['date'].min()}  →  {df['date'].max()}")

# Revenue by category
by_cat = (df.groupby('category')['total_amount']
            .sum()
            .sort_values(ascending=False))

print("\\nRevenue by Category (IDR):")
for cat, rev in by_cat.items():
    print(f"  {cat:<18}  Rp {rev:>14,.0f}")

# Bar chart
fig, ax = plt.subplots(figsize=(7, 4))
colors = ['#0891b2', '#6366f1', '#10b981', '#f59e0b']
ax.bar(by_cat.index, by_cat.values / 1e6, color=colors[:len(by_cat)])
ax.set_ylabel('Revenue (M IDR)')
ax.set_title('Revenue by Category  ·  Jan–Oct 2024')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.show()
`

const SEDUH_PYTHON_STARTER = `import pandas as pd
import matplotlib.pyplot as plt

# Seduh Coffee — the same four tables as your final-project workbook.
# Available: orders.csv, customers.csv, products.csv, marketing_spend.csv
orders   = pd.read_csv('orders.csv', parse_dates=['order_date'])
products = pd.read_csv('products.csv')

# Only completed orders count as revenue.
df = orders[orders['order_status'] == 'Completed'].merge(products, on='product_id')
df['revenue'] = df['quantity'] * df['unit_price'] * (1 - df['discount_pct'])
df['profit']  = df['quantity'] * (df['unit_price'] * (1 - df['discount_pct'])
                                  - df['unit_cost'])

print(f"Order lines: {len(df):,}  |  Customers: {df['customer_id'].nunique():,}")
print(f"Revenue:     Rp {df['revenue'].sum():,.0f}")

by_cat = df.groupby('category')[['revenue', 'profit']].sum().sort_values('profit')
print("\\nProfit by category (IDR):")
for cat, row in by_cat.sort_values('profit', ascending=False).iterrows():
    print(f"  {cat:<20}  Rp {row['profit']:>15,.0f}")

fig, ax = plt.subplots(figsize=(7, 4))
ax.barh(by_cat.index, by_cat['profit'] / 1e6, color='#0891b2')
ax.set_xlabel('Profit (M IDR)')
ax.set_title('Seduh Coffee · profit by category')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.show()
`

/** Filenames pandas sees, built from the shared schema so the two cannot drift. */
const SEDUH_CSV_INFO = {
  files: SEDUH_DATASET_INFO.tables.map(t => ({
    name: `${t.name}.csv`,
    description: t.description,
    columns: t.columns,
    rowCount: t.rowCount,
  })),
}

const PYTHON_DATASETS: Record<DatasetName, {
  label: string
  starter: string
  info: { files: { name: string; description: string; columns: string[]; rowCount: number }[] }
}> = {
  seduh: { label: 'Seduh Coffee', starter: SEDUH_PYTHON_STARTER, info: SEDUH_CSV_INFO },
  ecommerce: { label: 'Retail', starter: PYTHON_STARTER, info: CSV_DATASET_INFO },
}

const PYTHON_SNIPPETS = [
  {
    label: 'Regional sales',
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('transactions.csv')

by_region = df.groupby('region').agg(
    transactions=('transaction_id', 'count'),
    revenue=('total_amount', 'sum'),
    avg_order=('total_amount', 'mean')
).sort_values('revenue', ascending=False)

print(by_region.to_string())

fig, ax = plt.subplots(figsize=(7, 4))
ax.barh(by_region.index, by_region['revenue'] / 1e6, color='#0891b2')
ax.set_xlabel('Revenue (M IDR)')
ax.set_title('Revenue by Region  ·  2024')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.show()
`,
  },
  {
    label: 'Employee analysis',
    code: `import pandas as pd

emp = pd.read_csv('employees.csv')

print(f"Total employees: {len(emp)}")
print(f"\\nDepartment Summary:")

by_dept = emp.groupby('department').agg(
    headcount=('emp_id', 'count'),
    avg_salary=('salary', 'mean'),
    avg_score=('performance_score', 'mean')
).sort_values('avg_salary', ascending=False)

for dept, row in by_dept.iterrows():
    print(f"  {dept:<14} {int(row.headcount)} staff  "
          f"Rp {row.avg_salary:>12,.0f} avg  "
          f"perf {row.avg_score:.1f}")
`,
  },
  {
    label: 'Monthly trend',
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('transactions.csv')
df['date'] = pd.to_datetime(df['date'])

monthly = (df.groupby(df['date'].dt.to_period('M'))
             .agg(revenue=('total_amount', 'sum'),
                  orders=('transaction_id', 'count'))
             .reset_index())

monthly['label'] = monthly['date'].dt.strftime('%b')
print(monthly[['label', 'orders', 'revenue']].to_string(index=False))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
ax1.plot(monthly['label'], monthly['revenue'] / 1e6,
         marker='o', color='#0891b2', linewidth=2)
ax1.set_title('Monthly Revenue (M IDR)')
ax1.tick_params(axis='x', rotation=45)
ax2.bar(monthly['label'], monthly['orders'], color='#6366f1')
ax2.set_title('Monthly Orders')
ax2.tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.show()
`,
  },
]

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
      className="group flex items-center gap-1 text-[11px] font-mono text-gray-200 bg-white/10 border border-white/10 hover:border-yellow-400/40 px-2 py-1 rounded-md transition-colors"
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
      className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-yellow-300 hover:text-yellow-200 transition-colors"
    >
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy all'}
    </button>
  )
}

// ── SQL sub-page ──────────────────────────────────────────────────────

function SqlPlayground() {
  const [dataset, setDataset] = useState<DatasetName>(DEFAULT_DATASET)
  const [query, setQuery] = usePlaygroundDraft('sql', SQL_STARTER[DEFAULT_DATASET])
  const [result, setResult] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { history, add, remove, clear } = useQueryHistory('sql')

  async function runCurrentQuery() {
    setLoading(true)
    const r = await runQuery(query, dataset)
    setResult(r)
    setLoading(false)
    add({
      code: query,
      ok: !r.error,
      summary: r.error
        ? 'Error'
        : `${r.rows?.length ?? 0} row${(r.rows?.length ?? 0) !== 1 ? 's' : ''}`,
    })
  }

  async function handleReset() {
    await resetDB(dataset)
    setResult(null)
    setQuery(SQL_STARTER[dataset])
  }

  // Switching datasets swaps the schema and the starter query; the two are not
  // interchangeable, so keeping the old query would only produce errors.
  function switchDataset(next: DatasetName) {
    if (next === dataset) return
    setDataset(next)
    setQuery(SQL_STARTER[next])
    setResult(null)
  }

  const rowCount = result?.rows?.length ?? 0
  const colCount = result?.columns?.length ?? 0

  return (
    <div className="flex flex-col gap-4">
      <SchemaReference
        dataset={dataset}
        datasets={Object.keys(SQL_DATASETS) as DatasetName[]}
        onDatasetChange={switchDataset}
      />

      {/* Editor */}
      <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0a0e18]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.06]">
            <span className="w-2 h-2 rounded-full bg-blue-400/80" />
            <span className="text-xs font-mono text-gray-400">query.sql</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={runCurrentQuery}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              <Play size={12} />
              {loading ? 'Running…' : 'Run Query'}
            </button>
          </div>
        </div>
        <SqlEditor value={query} onChange={setQuery} height="220px" />
      </div>

      {/* Results */}
      {result && (
        <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0a0e18]">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Results</span>
            {result.error
              ? <span className="text-xs text-red-400 ml-2">{result.error}</span>
              : <span className="text-xs text-gray-600 ml-2">
                  {rowCount} row{rowCount !== 1 ? 's' : ''} · {colCount} column{colCount !== 1 ? 's' : ''}
                </span>}
          </div>
          <div className="p-4">
            <ResultsTable result={result} />
          </div>
        </div>
      )}

      {/* Query history */}
      <QueryHistoryPanel
        history={history}
        onLoad={code => setQuery(code)}
        onRemove={remove}
        onClear={clear}
        accent="text-blue-400"
      />
    </div>
  )
}

// ── Python sub-page ───────────────────────────────────────────────────

function PythonPlayground() {
  const [dataset, setDataset] = useState<DatasetName>(DEFAULT_DATASET)
  const [code, setCode] = usePlaygroundDraft('python', PYTHON_DATASETS[DEFAULT_DATASET].starter)
  const [result, setResult] = useState<PyResult | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<PyLoadProgress>({ stage: 'Starting…', percent: 0 })
  // Which dataset's CSVs are currently mounted. Deriving `ready` from it means
  // switching datasets un-readies the editor without a setState in the effect.
  const [mountedDataset, setMountedDataset] = useState<DatasetName | null>(null)
  const [pyLoading, setPyLoading] = useState(!isPyodideReady())
  const ready = mountedDataset === dataset
  const [openCsvFile, setOpenCsvFile] = useState<string | null>(null)
  const [openSnippet, setOpenSnippet] = useState(false)
  const { history, add, remove, clear } = useQueryHistory('python')
  const initialized = useRef(false)
  const snippetRef = useRef<HTMLDivElement>(null)

  // Re-runs on dataset switch so the newly selected CSVs are mounted before the
  // Run button is live; Pyodide itself boots only once.
  useEffect(() => {
    let cancelled = false

    const mount = dataset === 'seduh'
      ? loadSeduhCsvFiles()
      : Promise.resolve({ 'transactions.csv': TRANSACTIONS_CSV, 'employees.csv': EMPLOYEES_CSV })

    const boot = initialized.current || isPyodideReady()
      ? Promise.resolve()
      : (initialized.current = true, initPyodide(p => setProgress(p)))

    Promise.all([boot, mount]).then(([, csvFiles]) => {
      if (cancelled) return
      preloadCSVFiles(csvFiles)
      setMountedDataset(dataset)
      setPyLoading(false)
    })

    return () => { cancelled = true }
  }, [dataset])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!snippetRef.current?.contains(e.target as Node)) setOpenSnippet(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function handleRun() {
    if (!ready) return
    setRunning(true)
    const r = await runPython(code)
    setResult(r)
    setRunning(false)
    add({
      code,
      ok: !r.error,
      summary: r.error ? 'Error' : r.figures.length > 0 ? `${r.figures.length} chart${r.figures.length !== 1 ? 's' : ''}` : 'Ran',
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* CSV dataset info panel */}
      <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] p-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <FileText size={13} className="text-yellow-400" />
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
            Dataset
          </span>
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] border border-white/10 p-0.5">
            {(Object.keys(PYTHON_DATASETS) as DatasetName[]).map(key => (
              <button
                key={key}
                onClick={() => {
                  if (key === dataset) return
                  setDataset(key)
                  setCode(PYTHON_DATASETS[key].starter)
                  setResult(null)
                  setOpenCsvFile(null)
                }}
                className={`cursor-pointer px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  key === dataset
                    ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40'
                    : 'text-gray-400 hover:text-gray-200 border border-transparent'
                }`}
              >
                {PYTHON_DATASETS[key].label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[11px] text-gray-400 font-mono">
            {PYTHON_DATASETS[dataset].info.files.length} CSV files · pd.read_csv('filename.csv')
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PYTHON_DATASETS[dataset].info.files.map(f => {
            const open = openCsvFile === f.name
            return (
              <div
                key={f.name}
                className={`rounded-xl border transition-colors ${
                  open
                    ? 'border-yellow-500/40 bg-yellow-500/[0.10]'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => setOpenCsvFile(open ? null : f.name)}
                  className="w-full text-left p-3"
                  title={f.description}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-yellow-300">{f.name}</span>
                    {open
                      ? <ChevronDown size={12} className="text-gray-400" />
                      : <ChevronRight size={12} className="text-gray-400" />}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{f.rowCount} rows · {f.description}</div>
                </button>
                {open && (
                  <div className="px-3 pb-3 -mt-1">
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Columns</span>
                        <CopyAllColumns columns={f.columns} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {f.columns.map(col => (
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
      </div>

      {/* Side-by-side: editor (left) + output (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Editor panel */}
        <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col">
          <div className="flex items-center border-b border-white/[0.06] bg-[#0a0e18] px-4 py-2.5 gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
              <span className="text-xs font-mono text-gray-400">script.py</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {ready ? (
                <span className="flex items-center gap-1.5 text-[11px] text-green-400">
                  <Circle size={6} className="fill-green-400 text-green-400" />
                  ready
                </span>
              ) : (
                <span className="text-[11px] text-yellow-500">{progress.percent}%</span>
              )}
              <div className="relative" ref={snippetRef}>
                <button
                  onClick={() => setOpenSnippet(s => !s)}
                  className="flex items-center gap-1.5 text-[11px] border border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Examples
                  <ChevronDown size={10} />
                </button>
                {openSnippet && (
                  <div className="absolute right-0 top-full mt-1.5 bg-[#111827] border border-white/[0.08] rounded-xl shadow-2xl z-20 w-48 overflow-hidden">
                    {PYTHON_SNIPPETS.map(s => (
                      <button
                        key={s.label}
                        onClick={() => { setCode(s.code); setResult(null); setOpenSnippet(false) }}
                        className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/[0.05] transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => { setCode(PYTHON_STARTER); setResult(null) }}
                className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 px-2.5 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <RotateCcw size={11} /> Reset
              </button>
              <button
                onClick={handleRun}
                disabled={!ready || running}
                className="flex items-center gap-1.5 text-[11px] font-bold bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-gray-900 px-3 py-1 rounded-lg transition-colors"
              >
                <Play size={11} />
                {running ? 'Running…' : ready ? 'Run' : 'Loading…'}
              </button>
            </div>
          </div>
          <SqlEditor value={code} onChange={setCode} height="360px" />
        </div>

        {/* Output panel */}
        <div className="bg-[#0d1117] rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#0a0e18]">
            <Terminal size={12} className="text-yellow-500/70" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Output</span>
          </div>

          <div className="flex-1 p-4 overflow-auto" style={{ minHeight: '360px' }}>
            {pyLoading && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                <div className="w-9 h-9 rounded-xl bg-yellow-950/40 border border-yellow-800/60 flex items-center justify-center text-lg">
                  🐍
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-400 mb-1">{progress.stage}</p>
                  <p className="text-[11px] text-gray-600">Cached after first load</p>
                </div>
                <div className="w-52">
                  <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                    <span>Loading Python…</span>
                    <span>{progress.percent}%</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {!pyLoading && !result && !running && (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                <div className="w-9 h-9 rounded-xl border border-white/[0.06] flex items-center justify-center">
                  <Play size={14} className="text-gray-600" />
                </div>
                <p className="text-xs text-gray-600">
                  Click <span className="text-yellow-400 font-semibold">Run</span> to execute
                </p>
              </div>
            )}

            {running && (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500">Executing…</p>
              </div>
            )}

            {!running && result && (
              <div className="space-y-3">
                {result.error && (
                  <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Error</p>
                    <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono leading-relaxed">{result.error}</pre>
                  </div>
                )}
                {result.stdout && (
                  <div className="bg-[#0a0e1a] rounded-xl p-3 overflow-x-auto">
                    <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono leading-relaxed">{result.stdout}</pre>
                  </div>
                )}
                {result.stderr && !result.error && (
                  <div className="bg-yellow-950/30 border border-yellow-900/50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider mb-1.5">Warnings</p>
                    <pre className="text-xs text-yellow-300/70 whitespace-pre-wrap font-mono leading-relaxed">{result.stderr}</pre>
                  </div>
                )}
                {result.figures.map((src, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/[0.06]">
                    <img src={src} alt={`Figure ${i + 1}`} className="w-full" />
                  </div>
                ))}
                {!result.error && !result.stdout && !result.stderr && result.figures.length === 0 && (
                  <p className="text-xs text-gray-600 py-8 text-center">Code ran — no output.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Script history */}
      <QueryHistoryPanel
        history={history}
        onLoad={c => { setCode(c); setResult(null) }}
        onRemove={remove}
        onClear={clear}
        accent="text-yellow-400"
      />
    </div>
  )
}

// ── Main PlaygroundPage ───────────────────────────────────────────────

type PlaygroundId = 'sql' | 'python' | 'hr-salary' | 'hr-overtime' | 'hr-xlookup' | 'hr-okr'

interface PgTab {
  id: PlaygroundId
  labelKey: string
  icon: typeof Code2
  activeColor: string
}

const PROGRAM_PLAYGROUNDS: Record<string, PgTab[]> = {
  'data-analyst': [
    { id: 'sql',    labelKey: 'playground.tab_sql',    icon: Code2,    activeColor: 'text-blue-400 border-blue-400' },
    { id: 'python', labelKey: 'playground.tab_python', icon: Terminal, activeColor: 'text-yellow-400 border-yellow-400' },
  ],
  'data-analyst-fast-track': [
    { id: 'sql',        labelKey: 'playground.tab_sql',     icon: Code2,    activeColor: 'text-blue-400 border-blue-400' },
    { id: 'python',     labelKey: 'playground.tab_python',  icon: Terminal, activeColor: 'text-yellow-400 border-yellow-400' },
    { id: 'hr-xlookup', labelKey: 'playground.tab_xlookup', icon: Search,   activeColor: 'text-emerald-600 border-emerald-600' },
  ],
  'data-analyst-fast-track-2026': [
    { id: 'sql',        labelKey: 'playground.tab_sql',     icon: Code2,    activeColor: 'text-blue-400 border-blue-400' },
    { id: 'python',     labelKey: 'playground.tab_python',  icon: Terminal, activeColor: 'text-yellow-400 border-yellow-400' },
    { id: 'hr-xlookup', labelKey: 'playground.tab_xlookup', icon: Search,   activeColor: 'text-emerald-600 border-emerald-600' },
  ],
  'hr-fast-track': [
    { id: 'hr-salary',   labelKey: 'playground.tab_net_salary', icon: Calculator, activeColor: 'text-rose-600 border-rose-600' },
    { id: 'hr-overtime', labelKey: 'playground.tab_overtime',   icon: Clock,      activeColor: 'text-orange-500 border-orange-500' },
    { id: 'hr-xlookup',  labelKey: 'playground.tab_xlookup',    icon: Search,     activeColor: 'text-emerald-600 border-emerald-600' },
    { id: 'hr-okr',      labelKey: 'playground.tab_okr',        icon: Target,     activeColor: 'text-violet-600 border-violet-600' },
  ],
}

export default function PlaygroundPage() {
  const { t, i18n } = useTranslation('common')
  const cohort = useCohort()
  const { programs, loading: programsLoading } = usePrograms()
  const lang = i18n.language === 'id' ? 'id' : 'en'

  const [pickedProgram, setPickedProgram] = useState<string | null>(null)
  const [pickedPg, setPickedPg] = useState<PlaygroundId | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const showAll = cohort.isEditor || cohort.enrolledProgramIds.length === 0
  const visiblePrograms = programs.filter(p =>
    PROGRAM_PLAYGROUNDS[p.slug] && (showAll || cohort.enrolledProgramIds.includes(p.id)),
  )

  const defaultProgramId =
    (cohort.cohort && visiblePrograms.some(p => p.id === cohort.cohort!.program_id))
      ? cohort.cohort.program_id
      : visiblePrograms[0]?.id
  const programId = (pickedProgram && visiblePrograms.some(p => p.id === pickedProgram))
    ? pickedProgram
    : defaultProgramId
  const selectedProgram = visiblePrograms.find(p => p.id === programId)

  const pgTabs = selectedProgram ? PROGRAM_PLAYGROUNDS[selectedProgram.slug] ?? [] : []
  const pgId = (pickedPg && pgTabs.some(t => t.id === pickedPg)) ? pickedPg : pgTabs[0]?.id

  if (programsLoading || cohort.loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: program navigation */}
        <aside className={`shrink-0 transition-all duration-200 ${sidebarCollapsed ? 'md:w-12' : 'md:w-48'}`}>
          <div className={`flex items-center mb-2 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-1'}`}>
            {!sidebarCollapsed && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Programs
              </p>
            )}
            <button
              onClick={() => setSidebarCollapsed(c => !c)}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-100 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
            {visiblePrograms.map(p => {
              const active = p.id === programId
              return (
                <button
                  key={p.id}
                  onClick={() => { setPickedProgram(p.id); setPickedPg(null) }}
                  title={sidebarCollapsed ? (lang === 'id' ? p.name_id : p.name_en) : undefined}
                  className={`flex items-center gap-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 text-left ${
                    sidebarCollapsed ? 'justify-center p-2' : 'px-3 py-2.5'
                  } ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-base shrink-0`}>
                    {p.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="break-words min-w-0">{lang === 'id' ? p.name_id : p.name_en}</span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Right: playground sub-nav + content */}
        <div className="flex-1 min-w-0">
          <div data-tour="playground-tabs" className="flex items-center gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
            {pgTabs.map(({ id, labelKey, icon: Icon, activeColor }) => (
              <button
                key={id}
                onClick={() => setPickedPg(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors shrink-0 ${
                  pgId === id
                    ? activeColor
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={15} />
                {t(labelKey)}
              </button>
            ))}
          </div>

          {pgId === 'sql'          && <SqlPlayground />}
          {pgId === 'python'       && <PythonPlayground />}
          {pgId === 'hr-salary'    && <HrPlaygroundPage />}
          {pgId === 'hr-overtime'  && <OvertimeCalculatorPage />}
          {pgId === 'hr-xlookup'   && <XlookupSimulatorPage />}
          {pgId === 'hr-okr'       && <OkrBuilderPage />}
        </div>
      </div>
    </div>
  )
}
