import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <img
              src={`${import.meta.env.BASE_URL}brand/talentiv-logo-white.webp`}
              alt="Talentiv"
              className="h-5 w-auto"
            />
            <span>Learning</span>
          </div>
          <p className="text-sm text-center">{t('landing.footer_copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
