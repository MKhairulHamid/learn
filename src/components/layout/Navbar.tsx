import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe, BookOpen, LogOut, LayoutDashboard, Code2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

export function Navbar() {
  const { t, i18n } = useTranslation('common')
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'id' : 'en'
    i18n.changeLanguage(next)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path: string) =>
    location.pathname === path ? 'text-primary-600 font-semibold' : 'text-gray-600 hover:text-primary-600'

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-700 font-bold text-lg">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="hidden sm:block">DataLearn</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link to="/dashboard" className={`text-sm transition-colors ${isActive('/dashboard')}`}>
                  {t('nav.dashboard')}
                </Link>
                <Link to="/curriculum" className={`text-sm transition-colors ${isActive('/curriculum')}`}>
                  {t('nav.curriculum')}
                </Link>
                <Link to="/playground" className={`text-sm transition-colors ${isActive('/playground')}`}>
                  {t('nav.playground')}
                </Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className={`text-sm transition-colors ${isActive('/admin')}`}>
                    {t('nav.admin')}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-100"
            >
              <Globe size={16} />
              <span className="hidden sm:block">{t('common.language_toggle')}</span>
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut size={16} />
                  <span>{t('nav.logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {user ? (
            <>
              <MobileLink to="/dashboard" icon={<LayoutDashboard size={16} />} label={t('nav.dashboard')} onClick={() => setMobileOpen(false)} />
              <MobileLink to="/curriculum" icon={<BookOpen size={16} />} label={t('nav.curriculum')} onClick={() => setMobileOpen(false)} />
              <MobileLink to="/playground" icon={<Code2 size={16} />} label={t('nav.playground')} onClick={() => setMobileOpen(false)} />
              {profile?.role === 'admin' && (
                <MobileLink to="/admin" icon={<ShieldCheck size={16} />} label={t('nav.admin')} onClick={() => setMobileOpen(false)} />
              )}
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false) }}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} />
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setMobileOpen(false) }}
                className="block w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                {t('nav.login')}
              </button>
              <button onClick={() => { navigate('/register'); setMobileOpen(false) }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg">
                {t('nav.register')}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

function MobileLink({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
    >
      {icon}
      {label}
    </Link>
  )
}
