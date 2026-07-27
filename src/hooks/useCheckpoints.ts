import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type {
  SessionCheckpoint, CheckpointQuestion, CheckpointActivation, CheckpointResponse,
} from '../types'

// ── Shared loader ───────────────────────────────────────────────────
// Checkpoints + their questions for a session, both sorted by order_num.
async function loadCheckpoints(sessionId: string): Promise<SessionCheckpoint[]> {
  const { data } = await supabase
    .from('session_checkpoints')
    .select('*, questions:checkpoint_questions(*)')
    .eq('session_id', sessionId)
    .order('order_num')
  const rows = (data as SessionCheckpoint[] | null) ?? []
  for (const cp of rows) {
    cp.questions = [...(cp.questions ?? [])].sort((a, b) => a.order_num - b.order_num)
  }
  return rows
}

// ════════════════════════════════════════════════════════════════════
// Student side — react to the mentor opening a checkpoint live.
//   * No open activation  → checkpoints are answerable as a local
//     self-check (handled in the component); nothing is written.
//   * Open activation      → answers upsert into checkpoint_responses,
//     keyed to that activation, and are recorded.
// ════════════════════════════════════════════════════════════════════
export function useLiveCheckpoints(sessionId: string | undefined, cohortId: string | null) {
  const { user } = useAuth()
  const [checkpoints, setCheckpoints] = useState<SessionCheckpoint[]>([])
  const [openActivation, setOpenActivation] = useState<CheckpointActivation | null>(null)
  const [myResponses, setMyResponses] = useState<CheckpointResponse[]>([])
  const [revealedKey, setRevealedKey] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) { setCheckpoints([]); setLoading(false); return }
    let cancelled = false
    loadCheckpoints(sessionId).then(rows => {
      if (!cancelled) { setCheckpoints(rows); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [sessionId])

  // Track the currently OPEN activation for this cohort + session.
  const refreshOpen = useCallback(async () => {
    if (!sessionId || !cohortId) { setOpenActivation(null); return }
    const { data } = await supabase
      .from('checkpoint_activations')
      .select('*')
      .eq('cohort_id', cohortId)
      .eq('session_id', sessionId)
      .eq('status', 'open')
      .order('opened_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setOpenActivation((data as CheckpointActivation | null) ?? null)
  }, [sessionId, cohortId])

  useEffect(() => { refreshOpen() }, [refreshOpen])

  // Realtime: activation open/close/reveal for this cohort.
  useEffect(() => {
    if (!cohortId) return
    const channel = supabase
      .channel(`ckpt-activations:${cohortId}:${sessionId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'checkpoint_activations',
        filter: `cohort_id=eq.${cohortId}`,
      }, () => refreshOpen())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [cohortId, sessionId, refreshOpen])

  // Load my own responses for the open activation (so a refresh restores them).
  useEffect(() => {
    if (!openActivation || !user) { setMyResponses([]); return }
    supabase
      .from('checkpoint_responses')
      .select('*')
      .eq('activation_id', openActivation.id)
      .eq('user_id', user.id)
      .then(({ data }) => setMyResponses((data as CheckpointResponse[] | null) ?? []))
  }, [openActivation, user])

  // Once the mentor reveals, the answer key becomes readable — fetch it.
  useEffect(() => {
    const cp = openActivation && checkpoints.find(c => c.id === openActivation.checkpoint_id)
    if (!openActivation || !openActivation.revealed_at || !cp?.questions?.length) {
      setRevealedKey({}); return
    }
    const qIds = cp.questions.map(q => q.id)
    supabase
      .from('checkpoint_answer_keys')
      .select('question_id, correct_option_id')
      .in('question_id', qIds)
      .then(({ data }) => {
        const map: Record<string, string> = {}
        for (const r of (data as { question_id: string; correct_option_id: string }[] | null) ?? []) {
          map[r.question_id] = r.correct_option_id
        }
        setRevealedKey(map)
      })
  }, [openActivation, checkpoints])

  const activeCheckpoint = openActivation
    ? checkpoints.find(c => c.id === openActivation.checkpoint_id) ?? null
    : null

  // Submit (or change) an answer — only meaningful while an activation is open.
  const submitAnswer = useCallback(async (
    questionId: string, optionId: string,
  ): Promise<{ error?: string }> => {
    if (!user || !openActivation || !cohortId) return { error: 'No live checkpoint' }
    const { error } = await supabase
      .from('checkpoint_responses')
      .upsert({
        activation_id: openActivation.id,
        question_id: questionId,
        cohort_id: cohortId,
        user_id: user.id,
        selected_option_id: optionId,
      }, { onConflict: 'activation_id,question_id,user_id' })
      .select()
      .single()
    if (error) return { error: error.message }
    // Refresh my responses so is_correct (set by the DB trigger) is reflected.
    const { data } = await supabase
      .from('checkpoint_responses')
      .select('*')
      .eq('activation_id', openActivation.id)
      .eq('user_id', user.id)
    setMyResponses((data as CheckpointResponse[] | null) ?? [])
    return {}
  }, [user, openActivation, cohortId])

  return {
    checkpoints,
    loading,
    openActivation,
    activeCheckpoint,
    myResponses,
    revealed: !!openActivation?.revealed_at,
    revealedKey,
    submitAnswer,
  }
}

// ════════════════════════════════════════════════════════════════════
// Mentor side — drive checkpoints for one cohort's live session.
//   Flow: openCheckpoint → (students answer) → reveal → close → next.
//   Before reveal the console shows only an answered count; the caller
//   gates the distribution on `currentActivation.revealed_at`.
// ════════════════════════════════════════════════════════════════════
export function useCheckpointConsole(cohortId: string | null, sessionId: string | undefined) {
  const { user } = useAuth()
  const [checkpoints, setCheckpoints] = useState<SessionCheckpoint[]>([])
  const [answerKeys, setAnswerKeys] = useState<Record<string, string>>({})
  const [currentActivation, setCurrentActivation] = useState<CheckpointActivation | null>(null)
  const [responses, setResponses] = useState<CheckpointResponse[]>([])
  const [memberCount, setMemberCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const currentIdRef = useRef<string | null>(null)
  currentIdRef.current = currentActivation?.id ?? null

  // Checkpoints + questions + (editor-only) answer keys.
  useEffect(() => {
    if (!sessionId) { setCheckpoints([]); setLoading(false); return }
    let cancelled = false
    ;(async () => {
      const rows = await loadCheckpoints(sessionId)
      if (cancelled) return
      setCheckpoints(rows)
      const qIds = rows.flatMap(c => c.questions ?? []).map(q => q.id)
      if (qIds.length) {
        const { data } = await supabase
          .from('checkpoint_answer_keys')
          .select('question_id, correct_option_id')
          .in('question_id', qIds)
        const map: Record<string, string> = {}
        for (const r of (data as { question_id: string; correct_option_id: string }[] | null) ?? []) {
          map[r.question_id] = r.correct_option_id
        }
        if (!cancelled) setAnswerKeys(map)
      }
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [sessionId])

  // Active-member count for "answered X of N".
  useEffect(() => {
    if (!cohortId) { setMemberCount(0); return }
    supabase
      .from('cohort_enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('cohort_id', cohortId)
      .eq('status', 'active')
      .then(({ count }) => setMemberCount(count ?? 0))
  }, [cohortId])

  // The most recent activation for this cohort + session (open or last-closed).
  const refreshCurrent = useCallback(async () => {
    if (!cohortId || !sessionId) { setCurrentActivation(null); return }
    const { data } = await supabase
      .from('checkpoint_activations')
      .select('*')
      .eq('cohort_id', cohortId)
      .eq('session_id', sessionId)
      .order('opened_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setCurrentActivation((data as CheckpointActivation | null) ?? null)
  }, [cohortId, sessionId])

  useEffect(() => { refreshCurrent() }, [refreshCurrent])

  const refreshResponses = useCallback(async (activationId: string | null) => {
    if (!activationId) { setResponses([]); return }
    const { data } = await supabase
      .from('checkpoint_responses')
      .select('*')
      .eq('activation_id', activationId)
    setResponses((data as CheckpointResponse[] | null) ?? [])
  }, [])

  useEffect(() => { refreshResponses(currentActivation?.id ?? null) }, [currentActivation?.id, refreshResponses])

  // Realtime: activations + responses for this cohort.
  useEffect(() => {
    if (!cohortId) return
    const channel = supabase
      .channel(`ckpt-console:${cohortId}:${sessionId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'checkpoint_activations',
        filter: `cohort_id=eq.${cohortId}`,
      }, () => refreshCurrent())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'checkpoint_responses',
        filter: `cohort_id=eq.${cohortId}`,
      }, () => refreshResponses(currentIdRef.current))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [cohortId, sessionId, refreshCurrent, refreshResponses])

  const openCheckpoint = useCallback(async (checkpointId: string): Promise<{ error?: string }> => {
    if (!cohortId || !sessionId) return { error: 'No cohort/session' }
    const { data, error } = await supabase
      .from('checkpoint_activations')
      .insert({
        checkpoint_id: checkpointId, cohort_id: cohortId, session_id: sessionId,
        status: 'open', opened_by: user?.id ?? null,
      })
      .select()
      .single()
    if (error) return { error: error.message }
    setCurrentActivation(data as CheckpointActivation)
    return {}
  }, [cohortId, sessionId, user])

  const reveal = useCallback(async (): Promise<{ error?: string }> => {
    if (!currentActivation) return { error: 'Nothing open' }
    const { error } = await supabase
      .from('checkpoint_activations')
      .update({ revealed_at: new Date().toISOString() })
      .eq('id', currentActivation.id)
    if (!error) await refreshCurrent()
    return { error: error?.message }
  }, [currentActivation, refreshCurrent])

  const close = useCallback(async (): Promise<{ error?: string }> => {
    if (!currentActivation) return { error: 'Nothing open' }
    const { error } = await supabase
      .from('checkpoint_activations')
      .update({ status: 'closed', closed_at: new Date().toISOString() })
      .eq('id', currentActivation.id)
    if (!error) await refreshCurrent()
    return { error: error?.message }
  }, [currentActivation, refreshCurrent])

  const currentCheckpoint = currentActivation
    ? checkpoints.find(c => c.id === currentActivation.checkpoint_id) ?? null
    : null

  return {
    checkpoints,
    answerKeys,
    currentActivation,
    currentCheckpoint,
    responses,
    memberCount,
    loading,
    openCheckpoint,
    reveal,
    close,
  }
}

// ════════════════════════════════════════════════════════════════════
// Editor side — mentors author checkpoints & MCQs (editor-only via RLS).
// ════════════════════════════════════════════════════════════════════
export interface QuestionDraft {
  id?: string
  order_num: number
  prompt_id: string
  prompt_en: string
  options: { id: string; label_id: string; label_en: string }[]
  correct_option_id: string
}

export function useCheckpointEditor(sessionId: string | undefined) {
  const [checkpoints, setCheckpoints] = useState<SessionCheckpoint[]>([])
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!sessionId) { setCheckpoints([]); setLoading(false); return }
    const rows = await loadCheckpoints(sessionId)
    const qIds = rows.flatMap(c => c.questions ?? []).map(q => q.id)
    const map: Record<string, string> = {}
    if (qIds.length) {
      const { data } = await supabase
        .from('checkpoint_answer_keys')
        .select('question_id, correct_option_id')
        .in('question_id', qIds)
      for (const r of (data as { question_id: string; correct_option_id: string }[] | null) ?? []) {
        map[r.question_id] = r.correct_option_id
      }
    }
    setCheckpoints(rows); setKeys(map); setLoading(false)
  }, [sessionId])

  useEffect(() => { refetch() }, [refetch])

  const createCheckpoint = useCallback(async (): Promise<{ error?: string }> => {
    if (!sessionId) return { error: 'No session' }
    const nextOrder = Math.max(0, ...checkpoints.map(c => c.order_num)) + 1
    const { error } = await supabase.from('session_checkpoints').insert({
      session_id: sessionId, order_num: nextOrder,
      title_id: `Cek Poin ${nextOrder}`, title_en: `Checkpoint ${nextOrder}`,
    })
    if (!error) await refetch()
    return { error: error?.message }
  }, [sessionId, checkpoints, refetch])

  const updateCheckpoint = useCallback(async (
    id: string, fields: { title_id?: string; title_en?: string; order_num?: number },
  ): Promise<{ error?: string }> => {
    const { error } = await supabase.from('session_checkpoints').update(fields).eq('id', id)
    if (!error) await refetch()
    return { error: error?.message }
  }, [refetch])

  const deleteCheckpoint = useCallback(async (id: string): Promise<{ error?: string }> => {
    const { error } = await supabase.from('session_checkpoints').delete().eq('id', id)
    if (!error) await refetch()
    return { error: error?.message }
  }, [refetch])

  // Insert or update a question and its answer key together.
  const saveQuestion = useCallback(async (
    checkpointId: string, draft: QuestionDraft,
  ): Promise<{ error?: string }> => {
    const payload = {
      checkpoint_id: checkpointId,
      order_num: draft.order_num,
      prompt_id: draft.prompt_id,
      prompt_en: draft.prompt_en,
      options: draft.options,
    }
    let questionId = draft.id
    if (questionId) {
      const { error } = await supabase.from('checkpoint_questions').update(payload).eq('id', questionId)
      if (error) return { error: error.message }
    } else {
      const { data, error } = await supabase.from('checkpoint_questions').insert(payload).select('id').single()
      if (error) return { error: error.message }
      questionId = (data as { id: string }).id
    }
    const { error: keyErr } = await supabase.from('checkpoint_answer_keys')
      .upsert({ question_id: questionId, correct_option_id: draft.correct_option_id },
        { onConflict: 'question_id' })
    if (keyErr) return { error: keyErr.message }
    await refetch()
    return {}
  }, [refetch])

  const deleteQuestion = useCallback(async (id: string): Promise<{ error?: string }> => {
    const { error } = await supabase.from('checkpoint_questions').delete().eq('id', id)
    if (!error) await refetch()
    return { error: error?.message }
  }, [refetch])

  return {
    checkpoints, keys, loading, refetch,
    createCheckpoint, updateCheckpoint, deleteCheckpoint, saveQuestion, deleteQuestion,
  }
}

// ════════════════════════════════════════════════════════════════════
// Analytics — per-checkpoint correct-rate across ALL activations of a
// cohort+session (post-session summary).
// ════════════════════════════════════════════════════════════════════
export interface CheckpointSummaryRow {
  checkpointId: string
  answered: number       // distinct students who responded to any question
  totalResponses: number
  correct: number        // responses that were correct
  correctRate: number    // 0..100
}

export function useCheckpointSummary(cohortId: string | null, sessionId: string | undefined) {
  const [rows, setRows] = useState<CheckpointSummaryRow[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!cohortId || !sessionId) { setRows([]); return }
    setLoading(true)
    // Activations for this cohort+session → map activation → checkpoint.
    const { data: acts } = await supabase
      .from('checkpoint_activations')
      .select('id, checkpoint_id')
      .eq('cohort_id', cohortId)
      .eq('session_id', sessionId)
    const actList = (acts as { id: string; checkpoint_id: string }[] | null) ?? []
    if (actList.length === 0) { setRows([]); setLoading(false); return }
    const actToCp = new Map(actList.map(a => [a.id, a.checkpoint_id]))

    const { data: resp } = await supabase
      .from('checkpoint_responses')
      .select('activation_id, user_id, is_correct')
      .in('activation_id', actList.map(a => a.id))
    const responses = (resp as { activation_id: string; user_id: string; is_correct: boolean | null }[] | null) ?? []

    const byCp = new Map<string, { students: Set<string>; total: number; correct: number }>()
    for (const r of responses) {
      const cp = actToCp.get(r.activation_id)
      if (!cp) continue
      const agg = byCp.get(cp) ?? { students: new Set<string>(), total: 0, correct: 0 }
      agg.students.add(r.user_id)
      agg.total += 1
      if (r.is_correct) agg.correct += 1
      byCp.set(cp, agg)
    }
    setRows([...byCp.entries()].map(([checkpointId, a]) => ({
      checkpointId,
      answered: a.students.size,
      totalResponses: a.total,
      correct: a.correct,
      correctRate: a.total ? Math.round((a.correct / a.total) * 100) : 0,
    })))
    setLoading(false)
  }, [cohortId, sessionId])

  return { rows, loading, load }
}

// Per-question tally derived from a response set (for the mentor console).
export function tallyQuestion(
  question: CheckpointQuestion,
  responses: CheckpointResponse[],
  correctOptionId?: string,
) {
  const forQ = responses.filter(r => r.question_id === question.id)
  const counts: Record<string, number> = {}
  for (const opt of question.options) counts[opt.id] = 0
  for (const r of forQ) counts[r.selected_option_id] = (counts[r.selected_option_id] ?? 0) + 1
  const answered = forQ.length
  const correct = correctOptionId ? (counts[correctOptionId] ?? 0) : 0
  return { counts, answered, correct }
}
