import { canvasSettings } from '@/features/diagram-drawer/store/canvas-settings'
import { useTheme } from '@/features/shared/contexts/theme-provider'
import { useSnapshot } from 'valtio'

export const useCanvasTheme = () => {
  const { resolvedTheme } = useTheme()
  const settings = useSnapshot(canvasSettings)

  console.log(settings.isExportRendering)

  if (!settings.isExportRendering) {
    return resolvedTheme
  }

  if (settings.exportBackground === 'transparent') {
    return resolvedTheme
  }

  return settings.exportBackground
}
