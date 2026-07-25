import i18n from '@/i18n'
import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'

type Language = 'en' | 'no'
type CanvasSettings = {
  componentPanelOpen: boolean
  showGrid: boolean
  snapToGrid: boolean
  theme: 'light' | 'dark' | 'system'
  language: Language
}

const initialCanvasSettings: CanvasSettings = {
  componentPanelOpen: true,
  showGrid: false,
  snapToGrid: true,
  theme: 'light',
  language: (i18n.language?.split('-')[0] ?? 'no') as Language,
}

export const canvasSettings = proxy(deepClone(initialCanvasSettings))
