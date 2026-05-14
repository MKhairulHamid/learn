import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, ChevronDown, ChevronRight, Circle, Terminal } from 'lucide-react'
import { initPyodide, runPython, isPyodideReady } from '../lib/pyodideRunner'
import type { PyLoadProgress, PyResult } from '../lib/pyodideRunner'
import { SqlEditor } from '../components/exercises/SqlEditor'

const STARTER = `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Sample sales data
data = {
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    'revenue': [12500000, 15200000, 11800000, 17300000, 14900000, 19100000],
    'orders':  [45, 58, 42, 67, 55, 73],
}
df = pd.DataFrame(data)

print("=== Sales Summary ===")
print(df.to_string(index=False))
print(f"\\nTotal revenue: Rp {df['revenue'].sum():,.0f}")
print(f"Avg orders/month: {df['orders'].mean():.1f}")

# Plot
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

ax1.bar(df['month'], df['revenue'] / 1e6, color='#0891b2', alpha=0.85)
ax1.set_title('Monthly Revenue (millions IDR)')
ax1.set_ylabel('Revenue (M IDR)')

ax2.plot(df['month'], df['orders'], marker='o', color='#0891b2', linewidth=2)
ax2.set_title('Orders per Month')
ax2.set_ylabel('Orders')

plt.tight_layout()
plt.show()
`

const SNIPPETS = [
  {
    label: 'DataFrame basics',
    code: `import pandas as pd

df = pd.DataFrame({
    'name': ['Budi', 'Siti', 'Ahmad', 'Dewi'],
    'score': [88, 92, 75, 95],
    'region': ['Java', 'Java', 'Sumatra', 'Bali'],
})

print(df)
print("\\nDescribe:")
print(df['score'].describe())
print("\\nGroup by region:")
print(df.groupby('region')['score'].mean())
`,
  },
  {
    label: 'NumPy stats',
    code: `import numpy as np

data = np.array([12, 45, 23, 67, 34, 89, 11, 56, 78, 43])

print(f"Mean:   {np.mean(data):.2f}")
print(f"Median: {np.median(data):.2f}")
print(f"Std:    {np.std(data):.2f}")
print(f"Min:    {np.min(data)}")
print(f"Max:    {np.max(data)}")

normalized = (data - np.min(data)) / (np.max(data) - np.min(data))
print(f"\\nNormalized: {normalized.round(2)}")
`,
  },
  {
    label: 'Bar chart',
    code: `import matplotlib.pyplot as plt

categories = ['Electronics', 'Books', 'Furniture']
values = [45.2, 15.8, 38.7]
colors = ['#0891b2', '#06b6d4', '#0e7490']

fig, ax = plt.subplots(figsize=(7, 4))
bars = ax.bar(categories, values, color=colors, width=0.5)
ax.bar_label(bars, fmt='Rp %.1fM', padding=4, fontsize=9)
ax.set_title('Revenue by Category (M IDR)')
ax.set_ylim(0, 55)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.show()
`,
  },
]

interface LoadBarProps { progress: PyLoadProgress }
function LoadBar({ progress }: LoadBarProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
      <div className="w-10 h-10 rounded-xl bg-yellow-950/40 border border-yellow-800/60 flex items-center justify-center text-xl">
        🐍
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-300 mb-1">{progress.stage}</p>
        <p className="text-xs text-gray-600">Cached after first load</p>
      </div>
      <div className="w-64">
        <div className="flex justify-between text-[11px] text-gray-600 mb-1.5">
          <span>Loading Python runtime…</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function PythonPlaygroundPage() {
  const [code, setCode] = useState(STARTER)
  const [result, setResult] = useState<PyResult | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<PyLoadProgress>({ stage: 'Starting…', percent: 0 })
  const [ready, setReady] = useState(isPyodideReady())
  const [loading, setLoading] = useState(!isPyodideReady())
  const [openSnippet, setOpenSnippet] = useState(false)
  const initialized = useRef(false)
  const snippetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialized.current || isPyodideReady()) { setReady(true); setLoading(false); return }
    initialized.current = true
    initPyodide(p => setProgress(p)).then(() => { setReady(true); setLoading(false) })
  }, [])

  // Close snippet dropdown on outside click
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
  }

  function handleReset() {
    setCode(STARTER)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Top header bar */}
      <div className="border-b border-white/[0.06] bg-[#0d1221]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-base leading-none">
              🐍
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Python Playground</span>
              <span className="ml-2 text-xs text-gray-500">Pyodide · NumPy · Pandas · Matplotlib</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Ready indicator */}
            {ready ? (
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <Circle size={6} className="fill-green-400 text-green-400" />
                Python ready
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-yellow-500">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                {progress.percent}%
              </span>
            )}

            {/* Examples dropdown */}
            <div className="relative" ref={snippetRef}>
              <button
                onClick={() => setOpenSnippet(s => !s)}
                className="flex items-center gap-1.5 text-xs border border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Examples
                {openSnippet ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              {openSnippet && (
                <div className="absolute right-0 top-full mt-2 bg-[#111827] border border-white/[0.08] rounded-xl shadow-2xl z-20 w-44 overflow-hidden">
                  {SNIPPETS.map(s => (
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
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Editor panel ── */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111827]">
            {/* Tab bar */}
            <div className="flex items-center border-b border-white/[0.06] bg-[#0d1221]">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-yellow-500 text-xs text-gray-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
                script.py
              </div>
              <div className="ml-auto flex items-center gap-2 pr-4">
                <button
                  onClick={handleReset}
                  disabled={running}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
                <button
                  onClick={handleRun}
                  disabled={!ready || running}
                  className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-gray-900 font-bold text-xs px-4 py-1.5 rounded-lg transition-colors"
                >
                  <Play size={12} />
                  {running ? 'Running…' : 'Run'}
                </button>
              </div>
            </div>

            {/* Monaco editor */}
            <div className="p-1">
              <SqlEditor value={code} onChange={setCode} height="420px" />
            </div>
          </div>

          {/* ── Output panel ── */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#111827] overflow-hidden flex flex-col">
            {/* Panel header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-[#0d1221]">
              <Terminal size={13} className="text-yellow-500/70" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Output</span>
            </div>

            <div className="flex-1 p-4 overflow-auto" style={{ minHeight: '460px' }}>
              {/* Loading Pyodide */}
              {loading && <LoadBar progress={progress} />}

              {/* Idle */}
              {!loading && !result && !running && (
                <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                  <div className="w-10 h-10 rounded-xl border border-white/[0.06] flex items-center justify-center">
                    <Play size={16} className="text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Click <span className="text-yellow-400 font-semibold">Run</span> to execute your code
                  </p>
                </div>
              )}

              {/* Executing */}
              {running && (
                <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                  <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">Executing…</p>
                </div>
              )}

              {/* Results */}
              {!running && result && (
                <div className="space-y-4">
                  {result.error && (
                    <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-2">Error</p>
                      <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono leading-relaxed">{result.error}</pre>
                    </div>
                  )}

                  {result.stdout && (
                    <div className="bg-[#0a0e1a] rounded-xl p-4 overflow-x-auto">
                      <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono leading-relaxed">{result.stdout}</pre>
                    </div>
                  )}

                  {result.stderr && !result.error && (
                    <div className="bg-yellow-950/30 border border-yellow-900/50 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-yellow-500 uppercase tracking-wider mb-2">Warnings</p>
                      <pre className="text-xs text-yellow-300/70 whitespace-pre-wrap font-mono leading-relaxed">{result.stderr}</pre>
                    </div>
                  )}

                  {result.figures.map((src, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-white/[0.06]">
                      <img src={src} alt={`Figure ${i + 1}`} className="w-full" />
                    </div>
                  ))}

                  {!result.error && !result.stdout && !result.stderr && result.figures.length === 0 && (
                    <p className="text-sm text-gray-600 py-10 text-center">
                      Code ran successfully — no output produced.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
