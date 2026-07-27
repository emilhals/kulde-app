import i18n from '@/i18n'
import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'
import { ExportBackground } from '../types'

type Language = 'en' | 'no'
type StageView = { x: number; y: number; scale: number }

type CanvasSettings = {
  componentPanelOpen: boolean
  showGrid: boolean
  snapToGrid: boolean
  theme: 'light' | 'dark' | 'system'
  exportBackground: ExportBackground
  isExportRendering: boolean
  language: Language
  stageView: StageView
}

const initialCanvasSettings: CanvasSettings = {
  componentPanelOpen: true,
  showGrid: false,
  snapToGrid: false,
  theme: 'light',
  exportBackground: 'transparent',
  isExportRendering: false,
  language: (i18n.language?.split('-')[0] ?? 'no') as Language,
  stageView: { x: 0, y: 0, scale: 1 },
}

export const canvasSettings = proxy(deepClone(initialCanvasSettings))
