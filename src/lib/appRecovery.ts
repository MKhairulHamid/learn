// Recovery for the "white screen" failure mode.
//
// The app is a PWA with hashed chunk names. When a new build is deployed, a
// browser that still holds the previous index.html (service-worker cache, bfcache,
// a tab left open) asks for chunk files that no longer exist. The dynamic import
// rejects, React unmounts the tree, and the learner sees an empty page with no
// way out but a manual hard refresh.
//
// These helpers turn that into a single silent reload: drop the stale caches,
// unregister the old worker, and load the current build once. The session flag
// stops a broken deploy from turning into a reload loop.

const RELOAD_FLAG = 'app-recovery-reloaded'

/** True for the "the chunk this build asked for is gone" family of errors. */
export function isStaleBuildError(error: unknown): boolean {
  const message =
    error instanceof Error ? `${error.name}: ${error.message}`
    : typeof error === 'string' ? error
    : ''
  return /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|chunkloaderror|unable to preload css|dynamically imported module/i
    .test(message)
}

/** Has this tab already tried to recover? Used to avoid a reload loop. */
export function alreadyRecovered(): boolean {
  try { return sessionStorage.getItem(RELOAD_FLAG) === '1' } catch { return false }
}

export function clearRecoveryFlag() {
  try { sessionStorage.removeItem(RELOAD_FLAG) } catch { /* private mode */ }
}

/**
 * Wipe the caches that can pin an old build, then reload.
 * Returns false when a recovery was already attempted in this tab, so the
 * caller can show a real error instead of reloading forever.
 */
export async function recoverFromStaleBuild(force = false): Promise<boolean> {
  if (!force && alreadyRecovered()) return false
  try { sessionStorage.setItem(RELOAD_FLAG, '1') } catch { /* private mode */ }

  try {
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map(k => caches.delete(k)))
    }
  } catch { /* cache API unavailable — the reload below still helps */ }

  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map(r => r.unregister()))
    }
  } catch { /* nothing to unregister */ }

  window.location.reload()
  return true
}
