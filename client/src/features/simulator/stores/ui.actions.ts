import { Position } from '../types'
import {
  ActivePanel,
  PanelName,
  PressureUnit,
  TemperatureUnit,
  uiState,
} from './ui'

type Size = { width: string; height: string }

export const setActivePanel = (panel: ActivePanel) => {
  uiState.activePanel = panel
}

export const movePanel = (panel: PanelName, position: Position) => {
  uiState.panels[panel].x += position.x
  uiState.panels[panel].y += position.y
}

export const resizePanel = (
  panel: PanelName,
  size: Size,
  position: Position,
) => {
  uiState.panels[panel].width = size.width
  uiState.panels[panel].height = size.height
  uiState.panels[panel].x = position.x
  uiState.panels[panel].y = position.y
}

export const setPanelPosition = (panel: PanelName, position: Position) => {
  uiState.panels[panel].x = position.x
  uiState.panels[panel].y = position.y
}

export const togglePin = (panel: PanelName) => {
  uiState.panels[panel].isPinned = !uiState.panels[panel].isPinned
}

export const setTemperatureUnit = (temperature: TemperatureUnit) => {
  uiState.units.temperature = temperature
}

export const setPressureUnit = (pressure: PressureUnit) => {
  uiState.units.pressure = pressure
}
