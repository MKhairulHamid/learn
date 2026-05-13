import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Exercise, ExerciseSubmission } from '../types'

export function useExercises(sessionId?: string) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setExercises([])
      setLoading(false)
      return
    }

    setLoading(true)
    supabase
      .from('exercises')
      .select('*')
      .eq('session_id', sessionId)
      .order('order_num')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setExercises(data ?? [])
        setLoading(false)
      })
  }, [sessionId])

  return { exercises, loading, error }
}

export function useExercise(exerciseId?: string) {
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!exerciseId) {
      setLoading(false)
      return
    }

    supabase
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setExercise(data)
        setLoading(false)
      })
  }, [exerciseId])

  return { exercise, loading, error }
}

export function useSubmissions(exerciseId?: string, userId?: string) {
  const [submissions, setSubmissions] = useState<ExerciseSubmission[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubmissions = useCallback(async () => {
    if (!exerciseId || !userId) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('exercise_submissions')
      .select('*')
      .eq('exercise_id', exerciseId)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })

    setSubmissions(data ?? [])
    setLoading(false)
  }, [exerciseId, userId])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  const saveSubmission = useCallback(async (submission: Omit<ExerciseSubmission, 'id' | 'submitted_at'>) => {
    const { data, error } = await supabase
      .from('exercise_submissions')
      .insert(submission)
      .select()
      .single()

    if (!error && data) {
      setSubmissions(prev => [data, ...prev])
    }
    return { data, error }
  }, [])

  return { submissions, loading, refetch: fetchSubmissions, saveSubmission }
}
