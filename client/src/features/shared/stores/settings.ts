import i18n from '@/i18n'
import { proxy } from 'valtio'
import { Language, Theme } from '../types'

const VALID_LANGUAGES = ['en', 'no'] as const
export const isLanguage = (value: string): value is Language =>
  VALID_LANGUAGES.includes(value as Language)

const VALID_THEMES = ['light', 'dark', 'system'] as const
export const isTheme = (value: string): value is Theme =>
  VALID_THEMES.includes(value as Theme)

type Settings = { theme: 'light' | 'dark' | 'system'; language: Language }

const initialSettings: Settings = {
  theme: 'light',
  language: (i18n.language?.split('-')[0] ?? 'no') as Language,
}

export const globalSettings = proxy(initialSettings)
