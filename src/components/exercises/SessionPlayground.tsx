import { useState, useEffect, useRef } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SqlEditor } from './SqlEditor'
import { ResultsTable } from './ResultsTable'
import { runQuery } from '../../lib/sqlSimulator'
import { initPyodide, runPython, isPyodideReady } from '../../lib/pyodideRunner'
import type { QueryResult } from '../../lib/sqlSimulator'
import type { PyLoadProgress, PyResult } from '../../lib/pyodideRunner'

type PlaygroundType = 'sql' | 'python'

interface SessionPlaygroundProps {
  type: PlaygroundType
  lang?: 'en' | 'id'
}

const SQL_STARTER = `-- Try it out! E-commerce dataset is loaded.
SELECT name, region, membership
FROM customers
WHERE membership = 'premium'
ORDER BY name;`

const PYTHON_STARTER = `import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Sample dataset
data = {
    'month': ['Jan','Feb','Mar','Apr','May','Jun'],
    'sales': [12.5, 15.2, 11.8, 17.3, 14.9, 19.1],
}
df = pd.DataFrame(data)
print(df)

# Quick plot
plt.figure(figsize=(7, 3))
plt.bar(df['month'], df['sales'], color='#eab308', alpha=0.85)
plt.title('Monthly Sales (millions)')
plt.tight_layout()
plt.show()`

// ── SQL mini-playground ───────────────────────────────────────

function SqlMini({ lang }: { lang: 'en' | 'id' }) {
  const [code, setCode] = useState(SQL_STARTER)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [running, setRunning] = useState(false)

  async function handleRun() {
    setRunning(true)
    const r = await runQuery(code)
    setResult(r)
    setRunning(false)
  }

  return (
    <div className="space-y-3">
      <SqlEditor value={code} onChange={setCode} height="160px" />
      <div className="flex items-center gap-3">
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          <Play size={13} />
          {running ? (lang === 'id' ? 'Menjalankan…' : 'Running…') : (lang === 'id' ? 'Jalankan' : 'Run')}
        </button>
        <Link
          to="/playground"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-400 transition-colors"
        >
          <ExternalLink size={12} />
          {lang === 'id' ? 'Buka playground penuh' : 'Open full playground'}
        </Link>
      </div>
      {(result || running) && (
        <div className="bg-gray-950 rounded-xl p-3 max-h-52 overflow-auto">
          <ResultsTable result={result} loading={running} />
        </div>
      )}
    </div>
  )
}

// ── Python mini-playground ────────────────────────────────────

function PythonMini({ lang }: { lang: 'en' | 'id' }) {
  const [code, setCode] = useState(PYTHON_STARTER)
  const [result, setResult] = useState<PyResult | null>(null)
  const [running, setRunning] = useState(false)
  const [ready, setReady] = useState(isPyodideReady())
  const [progress, setProgress] = useState<PyLoadProgress>({ stage: 'Starting…', percent: 0 })
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || isPyodideReady()) { setReady(true); return }
    initialized.current = true
    initPyodide(p => setProgress(p)).then(() => setReady(true))
  }, [])

  async function handleRun() {
    if (!ready) return
    setRunning(true)
    const r = await runPython(code)
    setResult(r)
    setRunning(false)
  }

  return (
    <div className="space-y-3">
      <SqlEditor value={code} onChange={setCode} height="180px" />

      <div className="flex items-center gap-3">
        <button
          onClick={handleRun}
          disabled={!ready || running}
          className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
        >
          <Play size={13} />
          {running ? (lang === 'id' ? 'Menjalankan…' : 'Running…') : (lang === 'id' ? 'Jalankan' : 'Run')}
        </button>
        <Link
          to="/python"
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-400 transition-colors"
        >
          <ExternalLink size={12} />
          {lang === 'id' ? 'Buka playground penuh' : 'Open full playground'}
        </Link>
        {ready
          ? <span className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Python ready</span>
          : <span className="text-xs text-gray-500">{progress.stage} {progress.percent}%</span>
        }
      </div>

      {/* Loading bar while Pyodide initialises */}
      {!ready && (
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      )}

      {/* Output */}
      {!running && result && (
        <div className="space-y-3">
          {result.error && (
            <div className="bg-red-950/40 border border-red-900 rounded-xl p-3">
              <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono">{result.error}</pre>
            </div>
          )}
          {result.stdout && (
            <div className="bg-gray-950 rounded-xl p-3 max-h-40 overflow-auto">
              <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono">{result.stdout}</pre>
            </div>
          )}
          {result.figures.map((src, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-700">
              <img src={src} alt={`Figure ${i + 1}`} className="w-full" />
            </div>
          ))}
        </div>
      )}

      {running && (
        <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
          <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          Executing…
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────

export function SessionPlayground({ type, lang = 'en' }: SessionPlaygroundProps) {
  const label = type === 'sql' ? '🗄️ SQL' : '🐍 Python'
  const borderColor = type === 'sql' ? 'border-primary-800' : 'border-yellow-800'
  const headerColor = type === 'sql' ? 'text-primary-400' : 'text-yellow-400'
  const bgColor = type === 'sql' ? 'bg-primary-950/20' : 'bg-yellow-950/20'

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} p-5 mt-8`}>
      <div className={`text-sm font-semibold ${headerColor} mb-3`}>
        {label} {lang === 'id' ? 'Playground — coba langsung di sini' : 'Playground — try it right here'}
      </div>
      {type === 'sql'
        ? <SqlMini lang={lang} />
        : <PythonMini lang={lang} />
      }
    </div>
  )
}
