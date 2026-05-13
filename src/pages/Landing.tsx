import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, ArrowRight, Database, BarChart3, FileSpreadsheet, Brain, CheckCircle2, Play } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CURRICULUM, TOOLS } from '../data/curriculum'

const PHASE_ICONS = [Brain, Database, BarChart3, FileSpreadsheet]

const HOW_STEPS = [
  { icon: '📖', step: 1 },
  { icon: '💻', step: 2 },
  { icon: '🏆', step: 3 },
]

export default function Landing() {
  const { t } = useTranslation(['common', 'curriculum'])
  const navigate = useNavigate()
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)

  const phaseNameKey = (i: number) => `curriculum:phase${i + 1}_name` as const
  const phaseDescKey = (i: number) => `curriculum:phase${i + 1}_desc` as const

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" size="md">
              <span className="mr-1">🎓</span> {t('common:landing.hero_badge')}
            </Badge>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              {t('common:landing.hero_title')}{' '}
              <span className="text-primary-400">{t('common:landing.hero_title_highlight')}</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {t('common:landing.hero_subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto">
                <Play size={18} />
                {t('common:landing.cta_start')}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/curriculum')}
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10">
                {t('common:landing.cta_curriculum')}
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: '12', label: t('common:landing.stats_sessions') },
              { value: '6', label: t('common:landing.stats_tools') },
              { value: '40+', label: t('common:landing.stats_exercises') },
              { value: '4', label: t('common:landing.stats_phases') },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-primary-300">{value}</div>
                <div className="text-sm text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('common:landing.how_title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {HOW_STEPS.map(({ icon, step }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                {step < 3 && (
                  <div className="hidden md:block absolute left-3/4 top-8 w-1/2 border-t-2 border-dashed border-primary-200" />
                )}
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-primary-100">
                  {icon}
                </div>
                <div className="absolute -top-2 -right-2 md:static md:hidden w-6 h-6 bg-primary-600 rounded-full text-white text-xs flex items-center justify-center font-bold">{step}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t(`common:landing.how_step${step}_title`)}
                </h3>
                <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                  {t(`common:landing.how_step${step}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools covered */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {TOOLS.map(({ name, icon }) => (
              <div key={name} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
                <span>{icon}</span> {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('common:landing.phases_title')}</h2>
            <p className="mt-3 text-gray-500">{t('common:landing.phases_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CURRICULUM.map((phase, idx) => {
              const Icon = PHASE_ICONS[idx]
              return (
                <div key={phase.phase}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-2xl`}>
                    {phase.icon}
                  </div>
                  <div>
                    <Badge variant="gray" size="sm">{t('common:common.phase')} {phase.phase}</Badge>
                    <h3 className="mt-2 font-semibold text-gray-900 leading-snug">
                      {t(phaseNameKey(idx))}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                      {t(phaseDescKey(idx))}
                    </p>
                  </div>
                  <div className="mt-auto pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Icon size={13} />
                      <span>{phase.sessions.length} {t('common:common.session')}s</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Full curriculum accordion */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">{t('common:landing.curriculum_title')}</h2>
            <p className="mt-3 text-gray-500">{t('common:landing.curriculum_subtitle')}</p>
          </div>
          <div className="space-y-3">
            {CURRICULUM.map((phase, idx) => (
              <div key={phase.phase} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{phase.icon}</span>
                    <div>
                      <div className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                        {t('common:common.phase')} {phase.phase}
                      </div>
                      <div className="font-semibold text-gray-900">{t(phaseNameKey(idx))}</div>
                    </div>
                  </div>
                  {expandedPhase === phase.phase ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {expandedPhase === phase.phase && (
                  <div className="px-5 pb-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 py-3">{t(phaseDescKey(idx))}</p>
                    <div className="space-y-2">
                      {phase.sessions.map((s) => (
                        <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                          <CheckCircle2 size={16} className="text-primary-500 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800">
                              {t('common:landing.session_label')} {s.id}: {t(`curriculum:sessions.${s.id}_title`)}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {s.tools.map((tool) => (
                                <Badge key={tool} variant="primary" size="sm">{tool}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-600 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to start your data journey?</h2>
          <p className="mt-4 text-primary-200">Join now and get instant access to all 12 sessions and interactive exercises.</p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/register')} className="mt-8">
            {t('common:landing.cta_start')} <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </div>
  )
}
