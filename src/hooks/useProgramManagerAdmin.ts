import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface PMUser {
  id: string
  full_name: string | null
  username: string | null
  role: string
}

export interface ProgramRow {
  id: string
  title: string
  is_published: boolean
}

export interface PMAssignment {
  id: string
  user_id: string
  program_id: string
  assigned_at: string
  user: PMUser
}

export function useProgramManagerAdmin() {
  const [users, setUsers] = useState<PMUser[]>([])
  const [programs, setPrograms] = useState<ProgramRow[]>([])
  const [assignments, setAssignments] = useState<PMAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [
      { data: profileData, error: profileErr },
      { data: programData, error: programErr },
      { data: assignData, error: assignErr },
    ] = await Promise.all([
      supabase.from('profiles').select('id, full_name, username, role').order('full_name'),
      supabase.from('programs').select('id, title, is_published').order('order_num'),
      supabase.from('program_manager_assignments')
        .select('id, user_id, program_id, assigned_at')
        .order('assigned_at', { ascending: false }),
    ])

    if (profileErr) { setError(profileErr.message); setLoading(false); return }
    if (programErr) { setError(programErr.message); setLoading(false); return }
    if (assignErr)  { setError(assignErr.message);  setLoading(false); return }

    const profileById = new Map((profileData ?? []).map(p => [p.id, p as PMUser]))

    const hydratedAssignments: PMAssignment[] = (assignData ?? [])
      .filter(a => profileById.has(a.user_id))
      .map(a => ({ ...a, user: profileById.get(a.user_id)! }))

    setUsers((profileData ?? []) as PMUser[])
    setPrograms((programData ?? []) as ProgramRow[])
    setAssignments(hydratedAssignments)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const assignPM = useCallback(async (userId: string, programId: string) => {
    setSaving(true)
    setError(null)

    const user = users.find(u => u.id === userId)
    const roleUpdate = user && user.role !== 'program_manager' && user.role !== 'admin'
      ? supabase.from('profiles').update({ role: 'program_manager' }).eq('id', userId)
      : Promise.resolve({ error: null })

    const [{ error: roleErr }, { error: assignErr }] = await Promise.all([
      roleUpdate,
      supabase.from('program_manager_assignments').insert({ user_id: userId, program_id: programId }),
    ])

    if (roleErr || assignErr) {
      setError((roleErr ?? assignErr)!.message)
      setSaving(false)
      return false
    }

    await load()
    setSaving(false)
    return true
  }, [users, load])

  const removeAssignment = useCallback(async (assignmentId: string) => {
    setSaving(true)
    setError(null)

    const { error: delErr } = await supabase
      .from('program_manager_assignments')
      .delete()
      .eq('id', assignmentId)

    if (delErr) { setError(delErr.message); setSaving(false); return false }

    await load()
    setSaving(false)
    return true
  }, [load])

  const updateUserRole = useCallback(async (userId: string, role: string) => {
    setSaving(true)
    setError(null)

    const { error: roleErr } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)

    if (roleErr) { setError(roleErr.message); setSaving(false); return false }

    await load()
    setSaving(false)
    return true
  }, [load])

  return { users, programs, assignments, loading, saving, error, assignPM, removeAssignment, updateUserRole, refetch: load }
}
