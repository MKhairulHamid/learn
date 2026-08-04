import initSqlJs from 'sql.js'
import type { Database, SqlJsStatic } from 'sql.js'
import { ECOMMERCE_SEED_SQL } from '../data/datasets/ecommerce'
import { SEDUH_CSV_PATHS, SEDUH_NUMERIC_COLUMNS, SEDUH_SCHEMA_SQL } from '../data/datasets/seduh'
import type { SeduhTable } from '../data/datasets/seduh'
import { loadSeduhCsv } from './seduhCsv'

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  error?: string
}

/**
 * 'seduh' is the final-project data, used by the X01–X12 program so playground
 * results match the learner's own workbook. 'ecommerce' is the older synthetic
 * dataset the 04/05/06/F08 sessions were written against, kept as-is.
 */
export type DatasetName = 'ecommerce' | 'seduh'

export const DEFAULT_DATASET: DatasetName = 'seduh'

/** Exercises carry a free-text dataset_name; anything unknown falls back. */
export function resolveDataset(name?: string | null): DatasetName {
  return name === 'ecommerce' ? 'ecommerce' : 'seduh'
}

let SQL: SqlJsStatic | null = null
const dbs = new Map<DatasetName, Database>()
const loading = new Map<DatasetName, Promise<Database>>()

async function getSql(): Promise<SqlJsStatic> {
  if (SQL) return SQL
  SQL = await initSqlJs({
    locateFile: () => `${import.meta.env.BASE_URL}sql-wasm.wasm`,
  })
  return SQL
}

/**
 * Seduh's 28k rows are fetched rather than bundled — the same CSVs the Python
 * playground reads, so the two agree and nothing ships twice. The files are
 * generated with no quoted or comma-bearing fields (the generator asserts it),
 * which is why splitting on ',' is enough here.
 */
async function seedSeduh(db: Database): Promise<void> {
  db.run(SEDUH_SCHEMA_SQL)

  const csv = await loadSeduhCsv()
  const tables = Object.keys(SEDUH_CSV_PATHS) as SeduhTable[]

  db.run('BEGIN')
  tables.forEach(table => {
    // Split on \r?\n: a CRLF file would otherwise leave a trailing \r on every
    // last column, which turns a blank orders.rating into 0 instead of NULL.
    const lines = csv[table].trim().split(/\r?\n/)
    const width = lines[0].split(',').length
    const numeric = new Set(SEDUH_NUMERIC_COLUMNS[table])
    const stmt = db.prepare(
      `INSERT INTO ${table} VALUES (${Array(width).fill('?').join(',')})`)

    for (let r = 1; r < lines.length; r++) {
      const cells = lines[r].split(',')
      stmt.run(cells.map((cell, c) => {
        // An empty cell is a real NULL — notably orders.rating, which Session 2
        // deliberately leaves blank rather than imputing.
        if (cell === '') return null
        return numeric.has(c) ? Number(cell) : cell
      }))
    }
    stmt.free()
  })
  db.run('COMMIT')
}

export async function getDB(dataset: DatasetName = DEFAULT_DATASET): Promise<Database> {
  const existing = dbs.get(dataset)
  if (existing) return existing

  // Two components can ask for the same dataset before the first fetch lands.
  const inFlight = loading.get(dataset)
  if (inFlight) return inFlight

  const task = (async () => {
    const sql = await getSql()
    const db = new sql.Database()
    try {
      if (dataset === 'seduh') await seedSeduh(db)
      else db.run(ECOMMERCE_SEED_SQL)
    } catch (err) {
      db.close()
      throw err
    }
    dbs.set(dataset, db)
    return db
  })().finally(() => loading.delete(dataset))

  loading.set(dataset, task)
  return task
}

export async function resetDB(dataset: DatasetName = DEFAULT_DATASET): Promise<void> {
  const db = dbs.get(dataset)
  if (db) { db.close(); dbs.delete(dataset) }
  await getDB(dataset)
}

function toResult(columns: string[], values: unknown[][]): QueryResult {
  return {
    columns,
    rows: values.map(row => Object.fromEntries(columns.map((col, i) => [col, row[i]]))),
    rowCount: values.length,
  }
}

function toError(err: unknown): QueryResult {
  return {
    columns: [], rows: [], rowCount: 0,
    error: err instanceof Error ? err.message : 'Unknown error',
  }
}

export async function runQuery(
  query: string,
  dataset: DatasetName = DEFAULT_DATASET,
): Promise<QueryResult> {
  try {
    const database = await getDB(dataset)
    const results = database.exec(query.trim())
    if (!results.length) return { columns: [], rows: [], rowCount: 0 }
    return toResult(results[0].columns, results[0].values)
  } catch (err) {
    return toError(err)
  }
}

export async function runQueryMulti(
  query: string,
  dataset: DatasetName = DEFAULT_DATASET,
): Promise<QueryResult[]> {
  try {
    const database = await getDB(dataset)
    return database.exec(query.trim())
      .map(({ columns, values }) => toResult(columns, values))
  } catch (err) {
    return [toError(err)]
  }
}
