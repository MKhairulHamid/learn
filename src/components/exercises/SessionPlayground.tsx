import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Play, ExternalLink, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SqlEditor } from './SqlEditor'
import { ResultsTable } from './ResultsTable'
import { runQuery } from '../../lib/sqlSimulator'
import { initPyodide, runPython, isPyodideReady } from '../../lib/pyodideRunner'
import type { QueryResult } from '../../lib/sqlSimulator'
import type { PyLoadProgress, PyResult } from '../../lib/pyodideRunner'

type PlaygroundType = 'sql' | 'python'

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
  const [code, setCode]       = useState(SQL_STARTER)
  const [result, setResult]   = useState<QueryResult | null>(null)
  const [running, setRunning] = useState(false)

  async function handleRun() {
    setRunning(true)
    const r = await runQuery(code)
    setResult(r)
    setRunning(false)
  }

  const rowCount = result?.rows?.length ?? 0

  return (
    <EditorWindow
      lang={lang}
      isSql
      filename="query.sql"
      meta="E-commerce dataset"
      running={running}
      onRun={handleRun}
      fullscreenTo="/playground"
      statusRight={result && !result.error ? `${rowCount} row${rowCount !== 1 ? 's' : ''}` : undefined}
    >
      <SqlEditor value={code} onChange={setCode} height="165px" />

      {(result || running) && (
        <div className="border-t border-white/[0.06] px-4 py-3 bg-[#080c14]/60 max-h-52 overflow-auto">
          <ResultsTable result={result} loading={running} />
        </div>
      )}
    </EditorWindow>
  )
}

// ── Python mini-playground ────────────────────────────────────

function PythonMini({ lang }: { lang: 'en' | 'id' }) {
  const [code, setCode]       = useState(PYTHON_STARTER)
  const [result, setResult]   = useState<PyResult | null>(null)
  const [running, setRunning] = useState(false)
  const [ready, setReady]     = useState(isPyodideReady())
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
    <EditorWindow
      lang={lang}
      isSql={false}
      filename="script.py"
      meta={ready ? 'Python ready' : `${progress.percent}%`}
      metaColor={ready ? 'text-green-400' : 'text-yellow-500'}
      running={running}
      onRun={handleRun}
      runDisabled={!ready}
      fullscreenTo="/python"
    >
      {/* Loading bar */}
      {!ready && (
        <div className="h-0.5 bg-gray-800">
          <div
            className="h-full bg-yellow-500 transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      )}

      <SqlEditor value={code} onChange={setCode} height="185px" />

      {(result || running) && (
        <div className="border-t border-white/[0.06] px-4 py-3 bg-[#080c14]/60 max-h-52 overflow-auto space-y-3">
          {running && (
            <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
              <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              {lang === 'id' ? 'Menjalankan…' : 'Executing…'}
            </div>
          )}
          {!running && result && (
            <>
              {result.error && (
                <div className="bg-red-950/40 border border-red-800/60 rounded-lg p-3">
                  <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono">{result.error}</pre>
                </div>
              )}
              {result.stdout && (
                <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono leading-relaxed">{result.stdout}</pre>
              )}
              {result.figures.map((src, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-white/[0.06]">
                  <img src={src} alt={`Figure ${i + 1}`} className="w-full" />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </EditorWindow>
  )
}

// ── Shared window chrome ──────────────────────────────────────

interface EditorWindowProps {
  lang: 'en' | 'id'
  isSql: boolean
  filename: string
  meta?: string
  metaColor?: string
  running: boolean
  onRun: () => void
  runDisabled?: boolean
  fullscreenTo: string
  statusRight?: string
  children: ReactNode
}

function EditorWindow({
  lang, isSql, filename, meta, metaColor = 'text-gray-600',
  running, onRun, runDisabled = false, fullscreenTo, statusRight, children,
}: EditorWindowProps) {
  const accentLine  = isSql ? 'border-t-cyan-500'   : 'border-t-yellow-500'
  const accentDot   = isSql ? 'bg-cyan-400'          : 'bg-yellow-400'
  const runBg       = isSql
    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
    : 'bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold'
  const statusBg    = isSql ? 'bg-cyan-950/30'       : 'bg-yellow-950/20'
  const statusBorder= isSql ? 'border-cyan-900/40'   : 'border-yellow-900/40'

  return (
    <div className={`rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0d1117] shadow-2xl border-t-2 ${accentLine}`}>

      {/* ── Window chrome ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#161b22] border-b border-white/[0.06]">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* Active file tab */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d1117] border border-white/[0.08] text-xs text-gray-300">
          <span className={`w-2 h-2 rounded-full ${accentDot}`} />
          {filename}
        </div>

        {/* Meta / status */}
        {meta && (
          <span className={`text-[11px] ${metaColor} flex items-center gap-1`}>
            {metaColor === 'text-green-400' && <Circle size={5} className="fill-green-400 text-green-400" />}
            {meta}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Run button */}
        <button
          onClick={onRun}
          disabled={running || runDisabled}
          className={`cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${runBg}`}
        >
          {running
            ? <><div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />{lang === 'id' ? 'Berjalan…' : 'Running…'}</>
            : <><Play size={12} />{lang === 'id' ? 'Jalankan' : 'Run'}</>
          }
        </button>

        {/* Full screen link */}
        <Link
          to={fullscreenTo}
          className="flex items-center gap-1 text-[11px] text-gray-600 hover:text-gray-300 transition-colors"
        >
          <ExternalLink size={11} />
          {lang === 'id' ? 'Penuh' : 'Open'}
        </Link>
      </div>

      {/* ── Editor + results (slotted) ── */}
      {children}

      {/* ── Status bar ── */}
      <div className={`flex items-center justify-between px-4 py-1.5 ${statusBg} border-t ${statusBorder}`}>
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">
          {isSql ? 'SQL · E-commerce' : 'Python · Pyodide'}
        </span>
        {statusRight && (
          <span className="text-[10px] text-gray-500">{statusRight}</span>
        )}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────

export function SessionPlayground({ type, lang = 'en' }: { type: PlaygroundType; lang?: 'en' | 'id' }) {
  return type === 'sql'
    ? <SqlMini lang={lang} />
    : <PythonMini lang={lang} />
}
