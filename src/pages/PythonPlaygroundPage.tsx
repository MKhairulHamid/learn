import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, Terminal, ChevronDown, ChevronRight } from 'lucide-react'
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

# Normalize
normalized = (data - np.min(data)) / (np.max(data) - np.min(data))
print(f"\\nNormalized: {normalized.round(2)}")
`,
  },
  {
    label: 'Matplotlib chart',
    code: `import matplotlib.pyplot as plt
import numpy as np

categories = ['Electronics', 'Books', 'Furniture']
values = [45200000, 15800000, 38700000]
colors = ['#0891b2', '#06b6d4', '#0e7490']

fig, ax = plt.subplots(figsize=(7, 4))
bars = ax.bar(categories, [v/1e6 for v in values], color=colors, width=0.5)

ax.bar_label(bars, fmt='Rp %.1fM', padding=4, fontsize=9)
ax.set_title('Revenue by Category')
ax.set_ylabel('Revenue (millions IDR)')
ax.set_ylim(0, 55)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.show()
`,
  },
]

interface LoadBarProps {
  progress: PyLoadProgress
}

function LoadBar({ progress }: LoadBarProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5">
      <div className="w-10 h-10 rounded-xl bg-yellow-950/40 border border-yellow-900 flex items-center justify-center text-xl">
        🐍
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-200 mb-1">{progress.stage}</p>
        <p className="text-xs text-gray-500">This only happens once — Pyodide is cached after first load.</p>
      </div>
      <div className="w-72">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Loading Python…</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
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

  useEffect(() => {
    if (initialized.current || isPyodideReady()) { setReady(true); setLoading(false); return }
    initialized.current = true

    initPyodide(p => setProgress(p)).then(() => {
      setReady(true)
      setLoading(false)
    })
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Python Playground
            <span className="text-sm font-normal text-yellow-400 bg-yellow-950/40 border border-yellow-900 px-2 py-0.5 rounded-full">
              Pyodide · NumPy · Pandas · Matplotlib
            </span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Run Python in your browser — no server needed.
          </p>
        </div>

        {/* Snippets dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenSnippet(s => !s)}
            className="flex items-center gap-2 text-sm border border-gray-700 text-gray-300 hover:border-gray-500 px-4 py-2 rounded-xl transition-colors"
          >
            Examples
            {openSnippet ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openSnippet && (
            <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-10 w-48 overflow-hidden">
              {SNIPPETS.map(s => (
                <button
                  key={s.label}
                  onClick={() => { setCode(s.code); setResult(null); setOpenSnippet(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
          <SqlEditor
            value={code}
            onChange={setCode}
            height="420px"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={!ready || running}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-gray-900 font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
            >
              <Play size={14} />
              {running ? 'Running…' : 'Run'}
            </button>
            <button
              onClick={handleReset}
              disabled={running}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-600 px-4 py-2 rounded-xl text-sm transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            {ready && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Python ready
              </span>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
            <Terminal size={13} />
            Output
          </div>

          {loading && <LoadBar progress={progress} />}

          {!loading && !result && !running && (
            <div className="text-gray-600 text-sm py-12 text-center">
              Click <span className="text-yellow-400 font-medium">Run</span> to execute your code.
            </div>
          )}

          {running && (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-12 justify-center">
              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              Executing…
            </div>
          )}

          {!running && result && (
            <div className="space-y-4">
              {/* Error */}
              {result.error && (
                <div className="bg-red-950/40 border border-red-900 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-400 mb-1">Error</p>
                  <pre className="text-xs text-red-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {result.error}
                  </pre>
                </div>
              )}

              {/* Stdout */}
              {result.stdout && (
                <div className="bg-gray-950 rounded-xl p-3 overflow-x-auto">
                  <pre className="text-xs text-green-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {result.stdout}
                  </pre>
                </div>
              )}

              {/* Stderr (warnings etc.) */}
              {result.stderr && !result.error && (
                <div className="bg-yellow-950/30 border border-yellow-900/50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-yellow-500 mb-1">Warnings</p>
                  <pre className="text-xs text-yellow-300/70 whitespace-pre-wrap font-mono leading-relaxed">
                    {result.stderr}
                  </pre>
                </div>
              )}

              {/* Matplotlib figures */}
              {result.figures.map((src, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-700">
                  <img src={src} alt={`Figure ${i + 1}`} className="w-full" />
                </div>
              ))}

              {/* Nothing produced */}
              {!result.error && !result.stdout && !result.stderr && result.figures.length === 0 && (
                <p className="text-gray-600 text-sm py-8 text-center">
                  Code ran successfully — no output produced.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
