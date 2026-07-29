import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type {
  SessionCheckpoint, CheckpointQuestion, CheckpointActivation, CheckpointResponse,
} from '../types'

// A checkpoint the mentor closed this recently is still shown to learners so
// they keep their result on screen instead of being dumped back to the lesson.
const RECENT_CLOSE_MS = 30 * 60 * 1000

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

async function loadAnswerKeys(questionIds: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {}
  if (questionIds.length === 0) return map
  const { data } = await supabase
    .from('checkpoint_answer_keys')
    .select('question_id, correct_option_id')
    .in('question_id', questionIds)
  for (const r of (data as { question_id: string; correct_option_id: string }[] | null) ?? []) {
    map[r.question_id] = r.correct_option_id
  }
  return map
}

// Merge a realtime row into a keyed list without refetching the whole set.
function mergeById<T extends { id: string }>(rows: T[], incoming: T): T[] {
  const i = rows.findIndex(r => r.id === incoming.id)
  if (i === -1) return [...rows, incoming]
  const next = rows.slice()
  next[i] = incoming
  return next
}

/**
 * Seconds remaining on the current question, or null when the checkpoint is
 * mentor-paced (`time_limit_seconds = 0`) or no question is running.
 */
export function useCountdown(
  startedAt: string | null | undefined, limitSeconds: number, running: boolean,
): number | null {
  const [now, setNow] = useState(() => Date.now())
  const ticking = running && !!startedAt && limitSeconds > 0

  useEffect(() => {
    if (!ticking) return
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [ticking, startedAt, limitSeconds])

  if (!startedAt || limitSeconds <= 0) return null
  const endsAt = new Date(startedAt).getTime() + limitSeconds * 1000
  return Math.max(0, Math.ceil((endsAt - now) / 1000))
}

/**
 * Reports "I have this lesson open" to the cohort's presence channel and
 * returns how many learners are currently there. Both roles join the same
 * channel; only learners are counted so the mentor isn't in their own N.
 */
export function useCheckpointPresence(
  cohortId: string | null, sessionId: string | undefined,
  opts: { asLearner: boolean; enabled?: boolean },
): number {
  const { user } = useAuth()
  const { asLearner, enabled = true } = opts
  const [present, setPresent] = useState(0)

  useEffect(() => {
    if (!enabled || !cohortId || !sessionId || !user) { setPresent(0); return }
    const channel = supabase.channel(`ckpt-presence:${cohortId}:${sessionId}`, {
      config: { presence: { key: user.id } },
    })
    const recount = () => {
      const state = channel.presenceState<{ learner: boolean }>()
      const learners = Object.values(state)
        .flat()
        .filter(m => (m as unknown as { learner?: boolean }).learner)
      setPresent(learners.length)
    }
    channel
      .on('presence', { event: 'sync' }, recount)
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ learner: asLearner })
        }
      })
    return () => { supabase.removeChannel(channel) }
  }, [cohortId, sessionId, user, asLearner, enabled])

  return present
}

// ════════════════════════════════════════════════════════════════════
// Learner side — follow the mentor through one question at a time.
//   * Nothing open        → the checkpoints are a local practice preview.
//   * Open activation     → answer the CURRENT question only, on a clock;
//                           the first answer is final (server-enforced).
//   * Revealed            → the key for that question becomes readable.
//   * Closed recently     → results stay on screen.
// ════════════════════════════════════════════════════════════════════
export function useLiveCheckpoints(sessionId: string | undefined, cohortId: string | null) {
  const { user } = useAuth()
  const [checkpoints, setCheckpoints] = useState<SessionCheckpoint[]>([])
  const [activation, setActivation] = useState<CheckpointActivation | null>(null)
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

  // Latest activation for this cohort + session, open OR just-closed.
  const refreshActivation = useCallback(async () => {
    if (!sessionId || !cohortId) { setActivation(null); return }
    const { data } = await supabase
      .from('checkpoint_activations')
      .select('*')
      .eq('cohort_id', cohortId)
      .eq('session_id', sessionId)
      .order('opened_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setActivation((data as CheckpointActivation | null) ?? null)
  }, [sessionId, cohortId])

  useEffect(() => { refreshActivation() }, [refreshActivation])

  // Realtime: apply the row the server sends instead of refetching it.
  useEffect(() => {
    if (!cohortId || !sessionId) return
    const channel = supabase
      .channel(`ckpt-activations:${cohortId}:${sessionId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'checkpoint_activations',
        filter: `cohort_id=eq.${cohortId}`,
      }, payload => {
        const row = payload.new as CheckpointActivation | undefined
        if (payload.eventType === 'DELETE') { refreshActivation(); return }
        if (!row || row.session_id !== sessionId) return
        setActivation(prev =>
          !prev || row.id === prev.id || row.opened_at >= prev.opened_at ? row : prev)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [cohortId, sessionId, refreshActivation])

  // My own answers for this activation (so a refresh or reconnect restores them).
  useEffect(() => {
    if (!activation || !user) { setMyResponses([]); return }
    let cancelled = false
    supabase
      .from('checkpoint_responses')
      .select('*')
      .eq('activation_id', activation.id)
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!cancelled) setMyResponses((data as CheckpointResponse[] | null) ?? [])
      })
    return () => { cancelled = true }
  }, [activation?.id, user])   // eslint-disable-line react-hooks/exhaustive-deps

  // Keys unlock one question at a time; refetch as the revealed set grows.
  const revealedIds = useMemo(
    () => activation?.revealed_question_ids ?? [], [activation?.revealed_question_ids])
  const revealedFingerprint = revealedIds.join(',')

  useEffect(() => {
    if (revealedIds.length === 0) { setRevealedKey({}); return }
    let cancelled = false
    loadAnswerKeys(revealedIds).then(map => { if (!cancelled) setRevealedKey(map) })
    return () => { cancelled = true }
  }, [revealedFingerprint])   // eslint-disable-line react-hooks/exhaustive-deps

  // Keys for everything this learner is already allowed to see — RLS returns
  // only questions revealed in a past activation, which turns the idle
  // practice list into an honest post-class review instead of a dead end.
  const [reviewKey, setReviewKey] = useState<Record<string, string>>({})
  const allQuestionIds = useMemo(
    () => checkpoints.flatMap(c => c.questions ?? []).map(q => q.id),
    [checkpoints])

  useEffect(() => {
    if (allQuestionIds.length === 0) { setReviewKey({}); return }
    let cancelled = false
    loadAnswerKeys(allQuestionIds).then(map => { if (!cancelled) setReviewKey(map) })
    return () => { cancelled = true }
  }, [allQuestionIds])

  const activeCheckpoint = activation
    ? checkpoints.find(c => c.id === activation.checkpoint_id) ?? null
    : null

  const currentQuestion: CheckpointQuestion | null = activation?.current_question_id
    ? activeCheckpoint?.questions?.find(q => q.id === activation.current_question_id) ?? null
    : null

  const isLive = activation?.status === 'open'

  // A finished checkpoint ages out on a timer rather than being compared to
  // the clock during render — otherwise nothing re-renders when it expires
  // and the result would sit there for the rest of the session.
  const [closeIsStale, setCloseIsStale] = useState(false)
  const closedAt = activation?.closed_at ?? null
  useEffect(() => {
    setCloseIsStale(false)
    if (!closedAt) return
    const remaining = RECENT_CLOSE_MS - (Date.now() - new Date(closedAt).getTime())
    if (remaining <= 0) { setCloseIsStale(true); return }
    const timer = setTimeout(() => setCloseIsStale(true), remaining)
    return () => clearTimeout(timer)
  }, [closedAt])

  // What the learner should have on screen: the live question, or the result
  // of a checkpoint that just ended.
  const showLive = isLive || (!!closedAt && !closeIsStale)

  const currentRevealed = !!currentQuestion && revealedIds.includes(currentQuestion.id)
  const myAnswer = currentQuestion
    ? myResponses.find(r => r.question_id === currentQuestion.id) ?? null
    : null

  const secondsLeft = useCountdown(
    activation?.question_started_at,
    activation?.time_limit_seconds ?? 0,
    !!isLive && !activation?.locked && !currentRevealed,
  )
  const timeUp = secondsLeft !== null && secondsLeft <= 0
  const canAnswer = !!isLive && !activation?.locked && !currentRevealed && !myAnswer && !timeUp

  const submitAnswer = useCallback(async (
    questionId: string, optionId: string,
  ): Promise<{ error?: string }> => {
    if (!user || !activation || !cohortId) return { error: 'No live checkpoint' }
    // Optimistic: lock the UI on the tap, the answer is final anyway.
    const optimistic: CheckpointResponse = {
      id: `pending:${questionId}`,
      activation_id: activation.id,
      question_id: questionId,
      cohort_id: cohortId,
      user_id: user.id,
      selected_option_id: optionId,
      is_correct: null,
      responded_at: new Date().toISOString(),
    }
    setMyResponses(prev => prev.some(r => r.question_id === questionId)
      ? prev : [...prev, optimistic])

    const { error } = await supabase
      .from('checkpoint_responses')
      .upsert({
        activation_id: activation.id,
        question_id: questionId,
        cohort_id: cohortId,
        user_id: user.id,
        selected_option_id: optionId,
      }, { onConflict: 'activation_id,question_id,user_id', ignoreDuplicates: true })

    if (error) {
      setMyResponses(prev => prev.filter(r => r.id !== optimistic.id))
      return { error: error.message }
    }
    // Reconcile against what actually landed (the first answer wins).
    const { data } = await supabase
      .from('checkpoint_responses')
      .select('*')
      .eq('activation_id', activation.id)
      .eq('user_id', user.id)
    setMyResponses((data as CheckpointResponse[] | null) ?? [])
    return {}
  }, [user, activation, cohortId])

  return {
    checkpoints,
    loading,
    activation,
    activeCheckpoint,
    currentQuestion,
    myResponses,
    myAnswer,
    revealedIds,
    revealedKey,
    reviewKey,
    isLive,
    showLive,
    currentRevealed,
    locked: !!activation?.locked || timeUp,
    canAnswer,
    secondsLeft,
    submitAnswer,
  }
}

// ════════════════════════════════════════════════════════════════════
// Mentor side — drive one cohort's live session.
//   open → (answer) → lock/reveal → next question → close
// ════════════════════════════════════════════════════════════════════
export function useCheckpointConsole(cohortId: string | null, sessionId: string | undefined) {
  const [checkpoints, setCheckpoints] = useState<SessionCheckpoint[]>([])
  const [answerKeys, setAnswerKeys] = useState<Record<string, string>>({})
  const [currentActivation, setCurrentActivation] = useState<CheckpointActivation | null>(null)
  const [responses, setResponses] = useState<CheckpointResponse[]>([])
  const [roster, setRoster] = useState<{ user_id: string; display_name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const currentIdRef = useRef<string | null>(null)

  useEffect(() => { currentIdRef.current = currentActivation?.id ?? null }, [currentActivation?.id])

  // Checkpoints + questions + (editor-only) answer keys.
  useEffect(() => {
    if (!sessionId) { setCheckpoints([]); setLoading(false); return }
    let cancelled = false
    ;(async () => {
      const rows = await loadCheckpoints(sessionId)
      if (cancelled) return
      setCheckpoints(rows)
      const map = await loadAnswerKeys(rows.flatMap(c => c.questions ?? []).map(q => q.id))
      if (cancelled) return
      setAnswerKeys(map)
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [sessionId])

  // Cohort roster — names for the per-learner grid (mentors cannot select
  // profiles directly, so this comes back through a definer RPC).
  useEffect(() => {
    if (!cohortId) { setRoster([]); return }
    let cancelled = false
    supabase.rpc('checkpoint_cohort_roster', { p_cohort: cohortId }).then(({ data }) => {
      if (!cancelled) setRoster((data as { user_id: string; display_name: string }[] | null) ?? [])
    })
    return () => { cancelled = true }
  }, [cohortId])

  const memberCount = roster.length
  const presentCount = useCheckpointPresence(cohortId, sessionId, { asLearner: false })

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

  useEffect(() => {
    refreshResponses(currentActivation?.id ?? null)
  }, [currentActivation?.id, refreshResponses])

  // Realtime: apply deltas. 035 refetched every response on every insert,
  // which is ~N×Q full table reads over one checkpoint.
  useEffect(() => {
    if (!cohortId || !sessionId) return
    const channel = supabase
      .channel(`ckpt-console:${cohortId}:${sessionId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'checkpoint_activations',
        filter: `cohort_id=eq.${cohortId}`,
      }, payload => {
        const row = payload.new as CheckpointActivation | undefined
        if (payload.eventType === 'DELETE') { refreshCurrent(); return }
        if (!row || row.session_id !== sessionId) return
        setCurrentActivation(prev =>
          !prev || row.id === prev.id || row.opened_at >= prev.opened_at ? row : prev)
      })
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'checkpoint_responses',
        filter: `cohort_id=eq.${cohortId}`,
      }, payload => {
        const row = (payload.new ?? payload.old) as CheckpointResponse | undefined
        if (!row || row.activation_id !== currentIdRef.current) return
        setResponses(prev => payload.eventType === 'DELETE'
          ? prev.filter(r => r.id !== row.id)
          : mergeById(prev, row))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [cohortId, sessionId, refreshCurrent])

  // ── Drive actions (all server-side RPCs, mentor-gated) ────────────
  const drive = useCallback(async (
    fn: string, params: Record<string, unknown>,
  ): Promise<{ error?: string }> => {
    const { data, error } = await supabase.rpc(fn, params)
    if (error) return { error: error.message }
    const row = (Array.isArray(data) ? data[0] : data) as CheckpointActivation | null
    if (row) setCurrentActivation(row)
    return {}
  }, [])

  const openCheckpoint = useCallback((checkpointId: string, timeLimit = 30) => {
    if (!cohortId || !sessionId) return Promise.resolve({ error: 'No cohort/session' })
    return drive('open_checkpoint', {
      p_checkpoint: checkpointId, p_cohort: cohortId,
      p_session: sessionId, p_time_limit: timeLimit,
    })
  }, [cohortId, sessionId, drive])

  const setQuestion = useCallback((questionId: string) => {
    if (!currentActivation) return Promise.resolve({ error: 'Nothing open' })
    return drive('set_checkpoint_question', {
      p_activation: currentActivation.id, p_question: questionId,
    })
  }, [currentActivation, drive])

  const lockQuestion = useCallback(() => {
    if (!currentActivation) return Promise.resolve({ error: 'Nothing open' })
    return drive('lock_checkpoint_question', { p_activation: currentActivation.id })
  }, [currentActivation, drive])

  const revealQuestion = useCallback((questionId?: string) => {
    if (!currentActivation) return Promise.resolve({ error: 'Nothing open' })
    return drive('reveal_checkpoint_question', {
      p_activation: currentActivation.id,
      p_question: questionId ?? currentActivation.current_question_id,
    })
  }, [currentActivation, drive])

  const close = useCallback(() => {
    if (!currentActivation) return Promise.resolve({ error: 'Nothing open' })
    return drive('close_checkpoint', { p_activation: currentActivation.id })
  }, [currentActivation, drive])

  const currentCheckpoint = currentActivation
    ? checkpoints.find(c => c.id === currentActivation.checkpoint_id) ?? null
    : null

  const questions = currentCheckpoint?.questions ?? []
  const currentIndex = currentActivation?.current_question_id
    ? questions.findIndex(q => q.id === currentActivation.current_question_id)
    : -1
  const currentQuestion = currentIndex >= 0 ? questions[currentIndex] : null
  const nextQuestion = currentIndex >= 0 ? questions[currentIndex + 1] ?? null : null

  const currentRevealed = !!currentQuestion
    && (currentActivation?.revealed_question_ids ?? []).includes(currentQuestion.id)

  const secondsLeft = useCountdown(
    currentActivation?.question_started_at,
    currentActivation?.time_limit_seconds ?? 0,
    currentActivation?.status === 'open' && !currentActivation?.locked && !currentRevealed,
  )

  return {
    checkpoints,
    answerKeys,
    currentActivation,
    currentCheckpoint,
    questions,
    currentQuestion,
    currentIndex,
    nextQuestion,
    currentRevealed,
    secondsLeft,
    responses,
    roster,
    memberCount,
    presentCount,
    loading,
    openCheckpoint,
    setQuestion,
    lockQuestion,
    revealQuestion,
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

/** Blocking problems with a draft, as i18n keys. Empty array = saveable. */
export function validateDraft(d: QuestionDraft): string[] {
  const errs: string[] = []
  if (!d.prompt_en.trim() && !d.prompt_id.trim()) errs.push('checkpoint.err_prompt')
  if (d.options.length < 2) errs.push('checkpoint.err_min_options')
  if (d.options.some(o => !o.label_en.trim() && !o.label_id.trim())) errs.push('checkpoint.err_option_blank')
  if (!d.options.some(o => o.id === d.correct_option_id)) errs.push('checkpoint.err_no_correct')
  return errs
}

export function useCheckpointEditor(sessionId: string | undefined) {
  const [checkpoints, setCheckpoints] = useState<SessionCheckpoint[]>([])
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!sessionId) { setCheckpoints([]); setLoading(false); return }
    const rows = await loadCheckpoints(sessionId)
    const map = await loadAnswerKeys(rows.flatMap(c => c.questions ?? []).map(q => q.id))
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
      prompt_id: draft.prompt_id.trim(),
      prompt_en: draft.prompt_en.trim(),
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
    if (error) return { error: error.message }
    await refetch()
    return {}
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
