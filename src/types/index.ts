export type Language = 'en' | 'id'

export type UserRole = 'student' | 'admin' | 'mentor' | 'program_manager'

// Editors (admins + mentors) can edit lesson content and exercises.
export const canEditContent = (role: UserRole | null | undefined): boolean =>
  role === 'admin' || role === 'mentor'

// Program managers (and admins) manage program operations.
export const isProgramManagerRole = (role: UserRole | null | undefined): boolean =>
  role === 'admin' || role === 'program_manager'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  preferred_language: Language
  role: UserRole
  onboarding_completed_at: string | null
  created_at: string
}

export interface Program {
  id: string
  slug: string
  name_id: string
  name_en: string
  description_id: string
  description_en: string
  icon: string
  color: string
  is_published: boolean
  order_num: number
  created_at: string
}

export interface Phase {
  id: string
  program_id: string
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
  phase_id: string | null
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
  mentor_id: string | null
}

export interface ProgramManagerAssignment {
  id: string
  user_id: string
  program_id: string
  assigned_at: string
  assigned_by: string | null
}

export interface UserProgress {
  id: string
  cohort_id: string
  user_id: string
  session_id: string
  completed: boolean
  completed_at: string | null
}

export interface Exercise {
  id: string
  session_id: string
  type: 'sql' | 'quiz' | 'multiple_choice' | 'matching'
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
  validation_type: 'exact_match' | 'contains_columns' | 'row_count' | 'custom' | 'matching'
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
  cohort_id?: string | null   // populated once cohort isolation lands (Batch 5)
  submitted_code: string
  passed: boolean
  test_results: TestResult[]
  score: number
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

// ── Cohort system ──────────────────────────────────────────────────

export type EnrollmentStatus = 'pending' | 'active' | 'rejected' | 'removed'

export interface Cohort {
  id: string
  program_id: string
  name: string
  description: string
  admission_open_at: string
  course_start_at: string
  course_close_at: string
  access_duration_months: number
  max_seats: number | null
  admission_open: boolean
  auto_approve_signups: boolean
  is_published: boolean
  created_by: string | null
  created_at: string
}

export interface CohortLessonSchedule {
  id: string
  cohort_id: string
  session_id: string
  scheduled_date: string        // ISO date (yyyy-mm-dd)
  zoom_link: string | null
  recording_url: string | null
  unlock_override: boolean | null  // null = auto by date; true = force open; false = force locked
  feedback_open: boolean | null  // null = auto (open if date passed); false = admin closed; true = force open
  notes: string | null
  created_at: string
}

export interface SessionFeedback {
  id: string
  cohort_id: string
  session_id: string
  user_id: string
  rating_materials: number
  rating_exercises: number
  rating_mentor_clarity: number
  rating_mentor_management: number
  rating_mentor_engagement: number
  rating_overall: number
  comment_highlight: string
  comment_improve: string
  comment_other: string
  submitted_at: string
}

export interface CohortEnrollment {
  id: string
  cohort_id: string
  user_id: string
  status: EnrollmentStatus
  applied_at: string
  approved_at: string | null
  approved_by: string | null
  access_expires_at: string | null
  notes: string | null
}

export interface CohortSessionProgress {
  id: string
  cohort_id: string
  user_id: string
  session_id: string
  completed: boolean
  completed_at: string | null
  score: number
}

// ── Certificate system ─────────────────────────────────────────────────

export interface CertificateTemplate {
  id: string
  name: string
  html_template: string
  is_default: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ReviewStatus = 'pending' | 'pass' | 'fail'

export interface CohortStudentReview {
  id: string
  cohort_id: string
  user_id: string
  reviewed_by: string | null
  status: ReviewStatus
  notes: string | null
  reviewed_at: string | null
  created_at: string
}

export interface Certificate {
  id: string
  user_id: string
  cohort_id: string
  template_id: string | null
  course_title: string
  recipient_name: string
  score: number | null
  issued_at: string
}
