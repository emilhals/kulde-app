import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

export const defaultNS = 'translation'
export const supportedLanguages = ['en', 'no'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

i18n
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    ns: [defaultNS, 'common', 'simulator'],
    defaultNS,
    load: 'languageOnly', // strips region, e.g. "en-US" -> "en"
    debug: false,
    interpolation: {
      escapeValue: false, // not needed, React escapes by default
    },
    detection: {
      // order it checks, and where it caches the result
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
