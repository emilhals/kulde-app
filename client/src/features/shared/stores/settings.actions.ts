import i18n from '@/i18n'
import { Language } from '../types'
import { globalSettings } from './settings'

export const setLanguage = (language: Language) => {
  globalSettings.language = language as Language
  i18n.changeLanguage(language)
}
