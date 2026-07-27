// Fixed ID of the orientation session (Lesson 0), seeded in migration 015.
export const LESSON_ZERO_ID = '00000000-0000-4000-8000-000000000000'

// Session numbers that embed an SQL playground on the session page.
// (F/X prefixes are the DAFT and extended-2026 programs.)
export const SQL_SESSIONS = ['04', '05', '06', 'F08', 'X04']

// Session numbers that embed a Python playground on the session page.
export const PYTHON_SESSIONS = ['10', 'X08']

// Session numbers that are project-based (no standard exercises).
// Used to show "1 project" instead of "lesson & exercises" in the UI.
export const PROJECT_SESSIONS = ['11', 'X12']
