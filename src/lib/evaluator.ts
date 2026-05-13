import { runQuery } from './sqlSimulator'
import type { TestCase, TestResult } from '../types'

export async function evaluateExercise(
  userQuery: string,
  testCases: TestCase[],
  lang: 'en' | 'id' = 'en'
): Promise<{ results: TestResult[]; allPassed: boolean; score: number }> {
  const results: TestResult[] = []

  for (const tc of testCases) {
    const result = await runSingleTest(userQuery, tc, lang)
    results.push(result)
  }

  const passed = results.filter(r => r.passed).length
  const allPassed = passed === testCases.length
  const totalPoints = testCases.reduce((s, t) => s + t.points, 0)
  const earnedPoints = testCases
    .filter((_, i) => results[i]?.passed)
    .reduce((s, t) => s + t.points, 0)
  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

  return { results, allPassed, score }
}

async function runSingleTest(
  query: string,
  tc: TestCase,
  lang: 'en' | 'id'
): Promise<TestResult> {
  const { rows, columns, error } = await runQuery(query)
  const desc = lang === 'id' ? tc.description_id : tc.description_en

  if (error) {
    return {
      test_id: tc.id,
      passed: false,
      message_id: `Error SQL: ${error}`,
      message_en: `SQL Error: ${error}`,
    }
  }

  switch (tc.validation_type) {
    case 'row_count': {
      const expected = tc.expected_value as number
      const passed = rows.length === expected
      return {
        test_id: tc.id,
        passed,
        message_en: passed
          ? `✓ ${desc}`
          : `✗ ${desc} — expected ${expected} rows, got ${rows.length}`,
        message_id: passed
          ? `✓ ${desc}`
          : `✗ ${desc} — diharapkan ${expected} baris, dapat ${rows.length}`,
        actual: rows.length,
        expected,
      }
    }

    case 'contains_columns': {
      const expected = tc.expected_columns ?? []
      const missing = expected.filter(c => !columns.includes(c))
      const passed = missing.length === 0
      return {
        test_id: tc.id,
        passed,
        message_en: passed
          ? `✓ ${desc}`
          : `✗ ${desc} — missing columns: ${missing.join(', ')}`,
        message_id: passed
          ? `✓ ${desc}`
          : `✗ ${desc} — kolom hilang: ${missing.join(', ')}`,
      }
    }

    case 'exact_match': {
      const expected = tc.expected_rows ?? []
      if (rows.length !== expected.length) {
        return {
          test_id: tc.id,
          passed: false,
          message_en: `✗ ${desc} — expected ${expected.length} rows, got ${rows.length}`,
          message_id: `✗ ${desc} — diharapkan ${expected.length} baris, dapat ${rows.length}`,
        }
      }
      const normalize = (v: unknown) =>
        typeof v === 'number' ? Math.round(v * 100) / 100 : String(v ?? '')
      const match = expected.every((expRow, i) =>
        Object.entries(expRow).every(
          ([k, v]) => normalize(rows[i]?.[k]) === normalize(v)
        )
      )
      return {
        test_id: tc.id,
        passed: match,
        message_en: match ? `✓ ${desc}` : `✗ ${desc} — result data doesn't match expected`,
        message_id: match ? `✓ ${desc}` : `✗ ${desc} — data hasil tidak sesuai yang diharapkan`,
      }
    }

    case 'custom': {
      // Check if query contains required keywords
      const required = tc.expected_value as string[]
      if (!Array.isArray(required)) {
        return { test_id: tc.id, passed: true, message_en: `✓ ${desc}`, message_id: `✓ ${desc}` }
      }
      const upperQuery = query.toUpperCase()
      const missing = required.filter(k => !upperQuery.includes(k.toUpperCase()))
      const passed = missing.length === 0
      return {
        test_id: tc.id,
        passed,
        message_en: passed ? `✓ ${desc}` : `✗ ${desc} — missing: ${missing.join(', ')}`,
        message_id: passed ? `✓ ${desc}` : `✗ ${desc} — kurang: ${missing.join(', ')}`,
      }
    }

    default:
      return { test_id: tc.id, passed: true, message_en: `✓ ${desc}`, message_id: `✓ ${desc}` }
  }
}
