import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from '../locales/en/common.json'
import enCurriculum from '../locales/en/curriculum.json'
import idCommon from '../locales/id/common.json'
import idCurriculum from '../locales/id/curriculum.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        curriculum: enCurriculum,
      },
      id: {
        common: idCommon,
        curriculum: idCurriculum,
      },
    },
    defaultNS: 'common',
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'id'],
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
