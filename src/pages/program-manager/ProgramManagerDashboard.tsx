import { useNavigate } from 'react-router-dom'
import { Briefcase, ChevronRight, Loader2 } from 'lucide-react'
import { usePMPrograms } from '../../hooks/useProgramManager'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'

export default function ProgramManagerDashboard() {
  const { profile } = useAuth()
  const { programs, loading } = usePMPrograms()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage === 'id' ? 'id' : 'en'

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0d1221]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Briefcase size={14} className="text-violet-400" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Program Management</span>
              <span className="ml-2 text-xs text-gray-500">
                {isAdmin ? 'All programs' : 'Your assigned programs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-gray-500" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No programs assigned yet.</p>
            {isAdmin && (
              <p className="text-gray-600 text-xs mt-1">
                Assign program managers via the profiles and program_manager_assignments tables.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map(p => (
              <button
                key={p.id}
                onClick={() => navigate(`/program-manager/${p.id}`)}
                className="cursor-pointer text-left group rounded-2xl border border-white/[0.06] bg-[#0d1221] hover:border-violet-500/30 hover:bg-[#10172a] transition-all p-5"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-xl`}>
                    {p.icon}
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-violet-400 transition-colors mt-1" />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-white">
                    {lang === 'id' ? p.name_id : p.name_en}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {lang === 'id' ? p.description_id : p.description_en}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    p.is_published ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
