import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            DataLearn
          </div>
          <p className="text-sm text-center">{t('landing.footer_copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
