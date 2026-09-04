import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { isStaleBuildError, recoverFromStaleBuild } from './lib/appRecovery'

// Vite fires this when a lazy route's chunk 404s — typically a tab still running
// the previous deploy. Recover before React ever sees the rejection.
window.addEventListener('vite:preloadError', () => { void recoverFromStaleBuild() })

// Same failure arriving as an unhandled rejection (dynamic import outside Vite's
// preload helper, or a chunk requested during an event handler).
window.addEventListener('unhandledrejection', e => {
  if (isStaleBuildError(e.reason)) void recoverFromStaleBuild()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
