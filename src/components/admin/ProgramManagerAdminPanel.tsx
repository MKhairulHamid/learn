import { useState } from 'react'
import { UserCog, Plus, X, ChevronDown, AlertCircle, Loader2 } from 'lucide-react'
import { useProgramManagerAdmin } from '../../hooks/useProgramManagerAdmin'
import type { PMUser } from '../../hooks/useProgramManagerAdmin'

function roleBadge(role: string) {
  const map: Record<string, string> = {
    admin:           'text-yellow-400 bg-yellow-950/40 border-yellow-900',
    program_manager: 'text-purple-400 bg-purple-950/40 border-purple-900',
    mentor:          'text-blue-400 bg-blue-950/40 border-blue-900',
    student:         'text-gray-400 bg-gray-800 border-gray-700',
  }
  return map[role] ?? map.student
}

interface AssignDropdownProps {
  programId: string
  assignedUserIds: Set<string>
  users: PMUser[]
  onAssign: (userId: string) => Promise<boolean>
  saving: boolean
}

function AssignDropdown({ programId: _programId, assignedUserIds, users, onAssign, saving }: AssignDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const eligible = users.filter(u => !assignedUserIds.has(u.id)).filter(u => {
    const q = search.toLowerCase()
    return !q || (u.full_name ?? '').toLowerCase().includes(q) || (u.username ?? '').toLowerCase().includes(q)
  }).slice(0, 20)

  async function handleSelect(userId: string) {
    setOpen(false)
    setSearch('')
    await onAssign(userId)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={saving}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-dashed border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
        Assign PM
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); setSearch('') }} />
          <div className="absolute left-0 top-full mt-1.5 z-20 w-64 bg-[#1a2035] border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-gray-800">
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users…"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-primary-500"
              />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {eligible.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">No users found</p>
              ) : eligible.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSelect(u.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800/60 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-400 shrink-0">
                    {(u.full_name ?? u.username ?? '?')[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-200 truncate">{u.full_name ?? u.username ?? '—'}</p>
                    <p className="text-xs text-gray-600 truncate">@{u.username ?? 'no username'}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${roleBadge(u.role)}`}>
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function ProgramManagerAdminPanel() {
  const { users, programs, assignments, loading, saving, error, assignPM, removeAssignment } = useProgramManagerAdmin()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <UserCog size={16} className="text-purple-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Program Managers</h2>
          <p className="text-xs text-gray-500">Assign users as Program Managers and scope them to programs</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-3">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Programs list */}
      <div className="space-y-3">
        {programs.length === 0 && (
          <p className="text-sm text-gray-600 text-center py-10">No programs found.</p>
        )}
        {programs.map(program => {
          const programAssignments = assignments.filter(a => a.program_id === program.id)
          const assignedUserIds = new Set(programAssignments.map(a => a.user_id))

          return (
            <div key={program.id} className="bg-[#111827] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-100">{program.title}</h3>
                    {!program.is_published && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-700 text-gray-500">
                        draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {programAssignments.length === 0
                      ? 'No PM assigned'
                      : `${programAssignments.length} PM${programAssignments.length > 1 ? 's' : ''} assigned`}
                  </p>
                </div>
                <AssignDropdown
                  programId={program.id}
                  assignedUserIds={assignedUserIds}
                  users={users}
                  onAssign={(userId) => assignPM(userId, program.id)}
                  saving={saving}
                />
              </div>

              {programAssignments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {programAssignments.map(a => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-1.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-purple-900/60 border border-purple-800 flex items-center justify-center text-[10px] font-semibold text-purple-300 shrink-0">
                        {(a.user.full_name ?? a.user.username ?? '?')[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-200">{a.user.full_name ?? a.user.username ?? '—'}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${roleBadge(a.user.role)}`}>
                        {a.user.role}
                      </span>
                      <button
                        onClick={() => removeAssignment(a.id)}
                        disabled={saving}
                        className="ml-1 text-gray-600 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Remove assignment"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Info note */}
      <p className="text-xs text-gray-700 text-center">
        Assigning a user who is not yet a PM will automatically upgrade their role to <span className="text-purple-500">program_manager</span>.
      </p>
    </div>
  )
}
