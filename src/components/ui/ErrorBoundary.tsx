import { Component, type ErrorInfo, type ReactNode } from 'react'
import { isStaleBuildError, recoverFromStaleBuild, alreadyRecovered } from '../../lib/appRecovery'

// Last line of defence: without this, any render error unmounts the whole tree
// and the learner just sees a blank white page. Copy is inline (not i18n) so the
// fallback still renders when the failure is i18n or a missing chunk.

const COPY = {
  en: {
    title: 'Something went wrong',
    desc: 'The page could not be displayed. Reloading usually fixes it.',
    reload: 'Reload page',
    hard: 'Clear cache and reload',
    details: 'Technical details',
  },
  id: {
    title: 'Terjadi kesalahan',
    desc: 'Halaman ini gagal ditampilkan. Biasanya cukup dimuat ulang.',
    reload: 'Muat ulang halaman',
    hard: 'Bersihkan cache lalu muat ulang',
    details: 'Detail teknis',
  },
}

function copy() {
  try {
    return localStorage.getItem('i18nextLng')?.startsWith('id') ? COPY.id : COPY.en
  } catch {
    return COPY.en
  }
}

interface Props { children: ReactNode }
interface State { error: Error | null; recovering: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, recovering: false }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // A stale build is worth one silent reload; anything else gets the fallback.
    return { error, recovering: isStaleBuildError(error) && !alreadyRecovered() }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
    if (isStaleBuildError(error)) void recoverFromStaleBuild()
  }

  render() {
    const { error, recovering } = this.state
    if (!error) return this.props.children

    const c = copy()

    // A reload is already on its way — don't flash an error at the user.
    if (recovering) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      )
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">{c.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{c.desc}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => window.location.reload()}
              className="cursor-pointer rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              {c.reload}
            </button>
            <button
              onClick={() => { void recoverFromStaleBuild(true) }}
              className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {c.hard}
            </button>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-gray-400">{c.details}</summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-[11px] text-gray-500">
              {error.name}: {error.message}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}
