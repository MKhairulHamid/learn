import { runQuery } from './sqlSimulator'
import type { TestCase, TestResult } from '../types'

export async function evaluateExercise(
  userQuery: string,
  testCases: TestCase[],
  lang: 'en' | 'id' = 'en'
): Promise<{ results: TestResult[]; allPassed: boolean; score: number }> {
  // Matching exercises submit JSON array of selected right-column texts
  if (testCases.length > 0 && testCases[0].validation_type === 'matching') {
    return evaluateMatching(userQuery, testCases, lang)
  }

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

function evaluateMatching(
  answer: string,
  testCases: TestCase[],
  lang: 'en' | 'id'
): { results: TestResult[]; allPassed: boolean; score: number } {
  let selections: string[] = []
  try { selections = JSON.parse(answer) } catch { selections = [] }

  const results: TestResult[] = testCases.map((tc, i) => {
    const desc = lang === 'id' ? tc.description_id : tc.description_en
    const selected = (selections[i] ?? '').trim()
    const expected = (tc.expected_value as string ?? '').trim()
    const passed = selected === expected
    return {
      test_id: tc.id,
      passed,
      message_en: passed ? `✓ ${desc}` : `✗ ${desc}`,
      message_id: passed ? `✓ ${desc}` : `✗ ${desc}`,
    }
  })

  const allPassed = results.every(r => r.passed)
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
      // Check if query contains required SQL clauses/keywords.
      // We intentionally do NOT reveal which keywords are missing in the error
      // message — that would give away the answer. Students should figure it out.
      const required = tc.expected_value as string[]
      if (!Array.isArray(required)) {
        return { test_id: tc.id, passed: true, message_en: `✓ ${desc}`, message_id: `✓ ${desc}` }
      }
      const upperQuery = query.toUpperCase()
      const passed = required.every(k => upperQuery.includes(k.toUpperCase()))
      return {
        test_id: tc.id,
        passed,
        message_en: passed ? `✓ ${desc}` : `✗ ${desc} — check that your query uses the right SQL clauses`,
        message_id: passed ? `✓ ${desc}` : `✗ ${desc} — periksa apakah query-mu sudah menggunakan klausa SQL yang tepat`,
      }
    }

    default:
      // Unknown validation_type — fail loudly so misconfigured exercises are
      // caught during content authoring rather than silently passing for everyone.
      return {
        test_id: tc.id,
        passed: false,
        message_en: `✗ ${desc} — unknown validation type: "${tc.validation_type}"`,
        message_id: `✗ ${desc} — tipe validasi tidak dikenal: "${tc.validation_type}"`,
      }
  }
}
