import initSqlJs from 'sql.js'
import type { Database, SqlJsStatic } from 'sql.js'
import { ECOMMERCE_SEED_SQL } from '../data/datasets/ecommerce'

export interface QueryResult {
  columns: string[]
  rows: Record<string, unknown>[]
  rowCount: number
  error?: string
}

let SQL: SqlJsStatic | null = null
let db: Database | null = null

async function getSql(): Promise<SqlJsStatic> {
  if (SQL) return SQL
  SQL = await initSqlJs({
    locateFile: () => `${import.meta.env.BASE_URL}sql-wasm.wasm`,
  })
  return SQL
}

export async function getDB(): Promise<Database> {
  if (db) return db
  const sql = await getSql()
  db = new sql.Database()
  db.run(ECOMMERCE_SEED_SQL)
  return db
}

export async function resetDB(): Promise<void> {
  if (db) { db.close(); db = null }
  await getDB()
}

export async function runQuery(query: string): Promise<QueryResult> {
  try {
    const database = await getDB()
    const results = database.exec(query.trim())

    if (!results.length) {
      return { columns: [], rows: [], rowCount: 0 }
    }

    const { columns, values } = results[0]
    const rows = values.map(row =>
      Object.fromEntries(columns.map((col, i) => [col, row[i]]))
    )
    return { columns, rows, rowCount: rows.length }
  } catch (err) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

export async function runQueryMulti(query: string): Promise<QueryResult[]> {
  try {
    const database = await getDB()
    const results = database.exec(query.trim())
    return results.map(({ columns, values }) => ({
      columns,
      rows: values.map(row =>
        Object.fromEntries(columns.map((col, i) => [col, row[i]]))
      ),
      rowCount: values.length,
    }))
  } catch (err) {
    return [{ columns: [], rows: [], rowCount: 0, error: err instanceof Error ? err.message : 'Unknown error' }]
  }
}
