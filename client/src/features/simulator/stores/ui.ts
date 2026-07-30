import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'

export type PanelName = 'parameters' | 'instructions'
export type ActivePanel = 'parameters' | 'instructions' | null

type PanelProperty = {
  x: number
  y: number
  width: string
  height: string
  isPinned: boolean
}

export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type PressureUnit = 'bar' | 'kPa'

export const isTemperatureUnit = (value: string): value is TemperatureUnit => {
  return (value as TemperatureUnit) !== undefined
}

export const isPressureUnit = (value: string): value is PressureUnit => {
  return (value as PressureUnit) !== undefined
}

type UIState = {
  activePanel: ActivePanel
  panels: Record<PanelName, PanelProperty>
  units: { temperature: TemperatureUnit; pressure: PressureUnit }
}

const initialUIState: UIState = {
  activePanel: null,
  panels: {
    parameters: { x: 24, y: 24, width: '420', height: '520', isPinned: false },
    instructions: {
      x: 24,
      y: 24,
      width: '620',
      height: '520',
      isPinned: false,
    },
  },
  units: { temperature: 'celsius', pressure: 'bar' },
}

export const uiState = proxy(deepClone(initialUIState))
