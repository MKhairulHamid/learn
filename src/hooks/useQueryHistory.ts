import { useState, useEffect, useCallback, useRef } from 'react'

export interface QueryHistoryEntry {
  id: string
  code: string
  ranAt: number
  ok: boolean
  summary: string
}

const MAX_ENTRIES = 50

function storageKey(kind: string) {
  return `playground-history:${kind}`
}

function load(kind: string): QueryHistoryEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(kind))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Persists the queries/scripts a user runs in a playground to localStorage,
 * so they can review and re-run what they've tried. Scoped per `kind`
 * ('sql', 'python', …) so each playground keeps its own history.
 */
export function useQueryHistory(kind: string) {
  const [history, setHistory] = useState<QueryHistoryEntry[]>(() => load(kind))

  // Reload if the playground kind changes.
  useEffect(() => {
    setHistory(load(kind))
  }, [kind])

  const persist = useCallback(
    (next: QueryHistoryEntry[]) => {
      setHistory(next)
      try {
        localStorage.setItem(storageKey(kind), JSON.stringify(next))
      } catch {
        // Ignore quota / private-mode write failures — history is best-effort.
      }
    },
    [kind],
  )

  const add = useCallback(
    (entry: { code: string; ok: boolean; summary: string }) => {
      const code = entry.code.trim()
      if (!code) return
      const item: QueryHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        code,
        ranAt: Date.now(),
        ok: entry.ok,
        summary: entry.summary,
      }
      setHistory(prev => {
        // Collapse consecutive duplicates of the same code.
        const deduped = prev[0]?.code === code ? prev.slice(1) : prev
        const next = [item, ...deduped].slice(0, MAX_ENTRIES)
        try {
          localStorage.setItem(storageKey(kind), JSON.stringify(next))
        } catch {
          // best-effort
        }
        return next
      })
    },
    [kind],
  )

  const remove = useCallback(
    (id: string) => {
      persist(history.filter(h => h.id !== id))
    },
    [history, persist],
  )

  const clear = useCallback(() => {
    persist([])
  }, [persist])

  return { history, add, remove, clear }
}

/**
 * Editor draft persisted to localStorage, so the current query/script survives
 * unmounting when the user switches to another playground tab and comes back.
 * Returns a [value, setValue] pair like useState.
 */
export function usePlaygroundDraft(kind: string, fallback: string) {
  const draftKey = `playground-draft:${kind}`
  const [value, setValue] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      return saved !== null ? saved : fallback
    } catch {
      return fallback
    }
  })

  // Debounce writes so typing doesn't hammer localStorage.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, value)
      } catch {
        // best-effort
      }
    }, 300)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [draftKey, value])

  return [value, setValue] as const
}
