import { SEDUH_CSV_PATHS } from '../data/datasets/seduh'
import type { SeduhTable } from '../data/datasets/seduh'

/**
 * The Seduh CSVs feed both playgrounds — SQL builds its SQLite tables from them,
 * Python mounts them for pandas. Fetched once per session and shared, so a
 * learner who opens both does not pull the 2.5 MB orders.csv twice.
 */
let cache: Promise<Record<SeduhTable, string>> | null = null

export function loadSeduhCsv(): Promise<Record<SeduhTable, string>> {
  if (cache) return cache

  const tables = Object.keys(SEDUH_CSV_PATHS) as SeduhTable[]
  cache = Promise.all(tables.map(async table => {
    const res = await fetch(`${import.meta.env.BASE_URL}${SEDUH_CSV_PATHS[table]}`)
    if (!res.ok) throw new Error(`Could not load ${table}.csv (${res.status})`)
    return [table, await res.text()] as const
  }))
    .then(entries => Object.fromEntries(entries) as Record<SeduhTable, string>)
    // A failed fetch must not poison every later attempt.
    .catch(err => { cache = null; throw err })

  return cache
}

/** Filenames as they appear to pandas: `pd.read_csv('orders.csv')`. */
export async function loadSeduhCsvFiles(): Promise<Record<string, string>> {
  const data = await loadSeduhCsv()
  return Object.fromEntries(
    Object.entries(data).map(([table, text]) => [`${table}.csv`, text]))
}
