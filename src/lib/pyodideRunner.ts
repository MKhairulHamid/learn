export interface PyLoadProgress {
  stage: string
  percent: number
}

export interface PyResult {
  stdout: string
  stderr: string
  figures: string[]   // base64 PNG data URLs
  error?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyodideInstance = any

const PYODIDE_VERSION = '0.26.2'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

let pyodidePromise: Promise<PyodideInstance> | null = null
let pyodide: PyodideInstance | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

export async function initPyodide(
  onProgress: (p: PyLoadProgress) => void
): Promise<PyodideInstance> {
  if (pyodide) return pyodide

  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      onProgress({ stage: 'Downloading Python runtime…', percent: 5 })
      await loadScript(`${PYODIDE_CDN}pyodide.js`)

      onProgress({ stage: 'Initializing Python…', percent: 30 })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const instance = await (window as any).loadPyodide({ indexURL: PYODIDE_CDN })

      onProgress({ stage: 'Installing NumPy…', percent: 55 })
      await instance.loadPackage('numpy')

      onProgress({ stage: 'Installing Pandas…', percent: 70 })
      await instance.loadPackage('pandas')

      onProgress({ stage: 'Installing Matplotlib…', percent: 85 })
      await instance.loadPackage('matplotlib')

      onProgress({ stage: 'Setting up environment…', percent: 95 })

      // Redirect stdout/stderr + matplotlib Agg backend
      instance.runPython(`
import sys
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

class _Capture(io.StringIO):
    pass

_stdout_capture = _Capture()
_stderr_capture = _Capture()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`)

      onProgress({ stage: 'Ready!', percent: 100 })
      pyodide = instance
      return instance
    })()
  }

  return pyodidePromise
}

export async function runPython(code: string): Promise<PyResult> {
  if (!pyodide) {
    return { stdout: '', stderr: '', figures: [], error: 'Python not initialized yet.' }
  }

  try {
    // Reset capture buffers and close any existing figures
    pyodide.runPython(`
_stdout_capture.truncate(0)
_stdout_capture.seek(0)
_stderr_capture.truncate(0)
_stderr_capture.seek(0)
plt.close('all')
`)

    // Run user code
    pyodide.runPython(code)

    // Capture stdout / stderr
    const stdout: string = pyodide.runPython('_stdout_capture.getvalue()')
    const stderr: string = pyodide.runPython('_stderr_capture.getvalue()')

    // Capture any matplotlib figures as base64 PNGs
    const figCount: number = pyodide.runPython('len(plt.get_fignums())')
    const figures: string[] = []

    for (let i = 0; i < figCount; i++) {
      const b64: string = pyodide.runPython(`
_fig_buf = io.BytesIO()
plt.figure(plt.get_fignums()[${i}])
plt.savefig(_fig_buf, format='png', bbox_inches='tight', dpi=120)
_fig_buf.seek(0)
base64.b64encode(_fig_buf.read()).decode('utf-8')
`)
      figures.push(`data:image/png;base64,${b64}`)
    }

    return { stdout, stderr, figures }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { stdout: '', stderr: '', figures: [], error: msg }
  }
}

export function isPyodideReady() {
  return pyodide !== null
}
