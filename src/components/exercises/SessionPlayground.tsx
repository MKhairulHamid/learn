import { useState, useEffect, useRef } from 'react'
import { Play, ExternalLink, Table2, Terminal } from 'lucide-react'
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
          className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          <Play size={13} />
          {running ? (lang === 'id' ? 'Menjalankan…' : 'Running…') : (lang === 'id' ? 'Jalankan' : 'Run')}
        </button>
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
  const isSql = type === 'sql'

  const Icon = isSql ? Table2 : Terminal
  const accentBorder  = isSql ? 'border-cyan-800/50'    : 'border-yellow-800/50'
  const accentBg      = isSql ? 'bg-cyan-950/25'         : 'bg-yellow-950/20'
  const accentIcon    = isSql ? 'text-cyan-400'          : 'text-yellow-400'
  const accentIconBg  = isSql ? 'bg-cyan-900/40 border-cyan-700/40' : 'bg-yellow-900/30 border-yellow-700/40'
  const label         = isSql ? 'SQL' : 'Python'
  const sublabel      = lang === 'id' ? 'coba langsung di sini' : 'try it right here'

  return (
    <div className={`rounded-2xl border ${accentBorder} ${accentBg} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${accentIconBg}`}>
            <Icon size={14} className={accentIcon} />
          </div>
          <div>
            <span className={`text-sm font-semibold ${accentIcon}`}>{label} Playground</span>
            <span className="ml-2 text-xs text-gray-500">— {sublabel}</span>
          </div>
        </div>
        <Link
          to={isSql ? '/playground' : '/python'}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ExternalLink size={12} />
          {lang === 'id' ? 'Buka penuh' : 'Full screen'}
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        {isSql
          ? <SqlMini lang={lang} />
          : <PythonMini lang={lang} />
        }
      </div>
    </div>
  )
}
