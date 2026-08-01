import { canvasSettings } from './canvas-settings'

export const toggleComponentPanel = () => {
  canvasSettings.componentPanelOpen = !canvasSettings.componentPanelOpen
}

export const toggleGrid = () => {
  canvasSettings.showGrid = !canvasSettings.showGrid
}

export const toggleSnapToGrid = () => {
  canvasSettings.snapToGrid = !canvasSettings.snapToGrid
}

export const resetStageView = () => {
  canvasSettings.stageView.x = 0
  canvasSettings.stageView.y = 0
  canvasSettings.stageView.scale = 1
}
