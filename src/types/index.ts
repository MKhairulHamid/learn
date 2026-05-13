export type Language = 'en' | 'id'

export type UserRole = 'student' | 'admin'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  preferred_language: Language
  role: UserRole
  created_at: string
}

export interface Phase {
  id: string
  phase_number: number
  name_id: string
  name_en: string
  description_id: string
  description_en: string
  icon: string
  color: string
  order_num: number
  sessions?: Session[]
}

export interface Session {
  id: string
  phase_id: string
  session_number: string
  title_id: string
  title_en: string
  content_id: string
  content_en: string
  unit_skkni: string
  learning_output_id: string
  learning_output_en: string
  order_num: number
  estimated_duration_minutes: number
}

export interface UserProgress {
  id: string
  user_id: string
  session_id: string
  completed: boolean
  completed_at: string | null
  score: number
}

export interface Exercise {
  id: string
  session_id: string
  type: 'sql' | 'quiz' | 'multiple_choice'
  title_id: string
  title_en: string
  description_id: string
  description_en: string
  starter_code: string
  solution_code: string
  test_cases: TestCase[]
  hints_id: string[]
  hints_en: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  order_num: number
  dataset_name: string | null
}

export interface TestCase {
  id: string
  description_id: string
  description_en: string
  expected_rows?: Record<string, unknown>[]
  expected_columns?: string[]
  validation_type: 'exact_match' | 'contains_columns' | 'row_count' | 'custom'
  expected_value?: unknown
  points: number
}

export interface TestResult {
  test_id: string
  passed: boolean
  message_id: string
  message_en: string
  actual?: unknown
  expected?: unknown
}

export interface ExerciseSubmission {
  id: string
  user_id: string
  exercise_id: string
  submitted_code: string
  passed: boolean
  test_results: TestResult[]
  submitted_at: string
  attempt_number: number
}

export interface ActivityLog {
  id: string
  user_id: string
  action_type: 'login' | 'session_view' | 'exercise_start' | 'exercise_submit' | 'session_complete'
  metadata: Record<string, unknown>
  created_at: string
}
