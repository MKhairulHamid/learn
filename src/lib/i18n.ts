import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from '../locales/en/common.json'
import enCurriculum from '../locales/en/curriculum.json'
import enOnboarding from '../locales/en/onboarding.json'
import idCommon from '../locales/id/common.json'
import idCurriculum from '../locales/id/curriculum.json'
import idOnboarding from '../locales/id/onboarding.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        curriculum: enCurriculum,
        onboarding: enOnboarding,
      },
      id: {
        common: idCommon,
        curriculum: idCurriculum,
        onboarding: idOnboarding,
      },
    },
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: ['en', 'id'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
