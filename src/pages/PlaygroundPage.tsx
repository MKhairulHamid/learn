import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, RotateCcw, ChevronDown, ChevronRight, Circle, Table2, Columns3, Code2, Terminal, Calculator } from 'lucide-react'
import { SqlEditor } from '../components/exercises/SqlEditor'
import { ResultsTable } from '../components/exercises/ResultsTable'
import { runQuery, resetDB } from '../lib/sqlSimulator'
import { DATASET_INFO } from '../data/datasets/ecommerce'
import { initPyodide, runPython, isPyodideReady } from '../lib/pyodideRunner'
import { useCohort } from '../hooks/useCohort'
import { usePrograms } from '../hooks/usePhases'
import HrPlaygroundPage from './HrPlaygroundPage'
import type { QueryResult } from '../lib/sqlSimulator'
import type { PyLoadProgress, PyResult } from '../lib/pyodideRunner'

const STARTER = `-- E-commerce database: customers, products, orders, order_items
-- Try a query below!

SELECT c.name, COUNT(o.id) AS total_orders, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'completed'
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 5;`

const PYTHON_STARTER = `import numpy as np
import pandas as pd

# Sample HR data
data = {
    'department': ['HR', 'Finance', 'Engineering', 'Marketing', 'Operations'],
    'headcount':  [8, 12, 35, 15, 22],
    'avg_salary': [8500000, 11000000, 15000000, 9500000, 8000000],
}
df = pd.DataFrame(data)
df['total_cost'] = df['headcount'] * df['avg_salary']

print(df.to_string(index=False))
print(f"\\nTotal headcount: {df['headcount'].sum()}")
print(f"Total payroll cost: Rp {df['total_cost'].sum():,.0f}")
`

// ── SQL sub-page ──────────────────────────────────────────────────────

function SqlPlayground() {
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
    <div className="flex flex-col gap-4">
      {/* Schema reference */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
          <Table2 size={16} className="text-primary-500" />
          Available Tables
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DATASET_INFO.tables.map(t => (
            <button
              key={t.name}
              onClick={() => setOpenTable(openTable === t.name ? null : t.name)}
              className="text-left rounded-xl border border-gray-100 p-3 hover:bg-primary-50 hover:border-primary-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-primary-700">{t.name}</span>
                {openTable === t.name
                  ? <ChevronDown size={12} className="text-gray-400" />
                  : <ChevronRight size={12} className="text-gray-400" />}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{t.rowCount} rows</div>
              {openTable === t.name && (
                <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                  {t.columns.map(col => (
                    <div key={col} className="flex items-center gap-1.5">
                      <Circle size={5} className="text-gray-300 fill-current shrink-0" />
                      <span className="font-mono text-xs text-gray-600">{col}</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Columns3 size={16} className="text-primary-500" />
            SQL Editor
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={runCurrentQuery}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Results</span>
            {result.error
              ? <span className="text-xs text-red-500">{result.error}</span>
              : <span className="text-xs text-gray-400">{rowCount} row{rowCount !== 1 ? 's' : ''} · {colCount} column{colCount !== 1 ? 's' : ''}</span>}
          </div>
          {!result.error && <ResultsTable result={result} />}
        </div>
      )}
    </div>
  )
}

// ── Python sub-page ───────────────────────────────────────────────────

function PythonPlayground() {
  const [code, setCode] = useState(PYTHON_STARTER)
  const [result, setResult] = useState<PyResult | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<PyLoadProgress>({ stage: 'Starting…', percent: 0 })
  const [ready, setReady] = useState(isPyodideReady())
  const [pyLoading, setPyLoading] = useState(!isPyodideReady())
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || isPyodideReady()) { setReady(true); setPyLoading(false); return }
    initialized.current = true
    initPyodide(p => setProgress(p)).then(() => { setReady(true); setPyLoading(false) })
  }, [])

  async function handleRun() {
    if (!ready) return
    setRunning(true)
    const r = await runPython(code)
    setResult(r)
    setRunning(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Terminal size={16} className="text-violet-500" />
            Python Editor
            {ready
              ? <span className="text-xs text-green-500 font-normal">● ready</span>
              : pyLoading
                ? <span className="text-xs text-yellow-500 font-normal">loading {progress.percent}%</span>
                : null}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setCode(PYTHON_STARTER); setResult(null) }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={handleRun}
              disabled={!ready || running}
              className="flex items-center gap-1.5 text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
            >
              <Play size={12} />
              {running ? 'Running…' : ready ? 'Run Python' : 'Loading…'}
            </button>
          </div>
        </div>
        <SqlEditor value={code} onChange={setCode} height="300px" />
      </div>

      {result && (
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-700 text-xs font-medium text-gray-400 flex items-center gap-2">
            <Terminal size={12} /> Output
          </div>
          <div className="px-4 py-4 space-y-3">
            {result.error && (
              <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap">{result.error}</pre>
            )}
            {result.stdout && (
              <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap overflow-x-auto">{result.stdout}</pre>
            )}
            {result.figures.map((src, i) => (
              <img key={i} src={src} alt={`Figure ${i + 1}`} className="w-full rounded-xl" />
            ))}
            {!result.error && !result.stdout && result.figures.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center">Code ran successfully — no output.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main PlaygroundPage ───────────────────────────────────────────────

type PlaygroundId = 'sql' | 'python' | 'hr-salary'

interface PgTab {
  id: PlaygroundId
  label: string
  icon: typeof Code2
  activeColor: string
}

// Which playgrounds belong to each program, keyed by program slug.
const PROGRAM_PLAYGROUNDS: Record<string, PgTab[]> = {
  'data-analyst': [
    { id: 'sql',    label: 'SQL',    icon: Code2,    activeColor: 'text-primary-600 border-primary-600' },
    { id: 'python', label: 'Python', icon: Terminal, activeColor: 'text-violet-600 border-violet-600' },
  ],
  'hr-fast-track': [
    { id: 'hr-salary', label: 'Net Salary Calc', icon: Calculator, activeColor: 'text-rose-600 border-rose-600' },
  ],
}

export default function PlaygroundPage() {
  const { i18n } = useTranslation('common')
  const cohort = useCohort()
  const { programs, loading: programsLoading } = usePrograms()
  const lang = i18n.language === 'id' ? 'id' : 'en'

  const [pickedProgram, setPickedProgram] = useState<string | null>(null)
  const [pickedPg, setPickedPg] = useState<PlaygroundId | null>(null)

  // Editors and unenrolled learners can explore every program's playground;
  // enrolled students see the programs they belong to. Only programs that
  // actually have a playground appear.
  const showAll = cohort.isEditor || cohort.enrolledProgramIds.length === 0
  const visiblePrograms = programs.filter(p =>
    PROGRAM_PLAYGROUNDS[p.slug] && (showAll || cohort.enrolledProgramIds.includes(p.id)),
  )

  // Resolve the selected program (user's own first, else the first available).
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: program navigation */}
        <aside className="md:w-56 shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
            Programs
          </p>
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
            {visiblePrograms.map(p => {
              const active = p.id === programId
              return (
                <button
                  key={p.id}
                  onClick={() => { setPickedProgram(p.id); setPickedPg(null) }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 text-left ${
                    active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-base shrink-0`}>
                    {p.icon}
                  </span>
                  <span className="truncate">{lang === 'id' ? p.name_id : p.name_en}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Right: playground sub-nav + content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
            {pgTabs.map(({ id, label, icon: Icon, activeColor }) => (
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
                {label}
              </button>
            ))}
          </div>

          {pgId === 'sql'       && <SqlPlayground />}
          {pgId === 'python'    && <PythonPlayground />}
          {pgId === 'hr-salary' && <HrPlaygroundPage />}
        </div>
      </div>
    </div>
  )
}
