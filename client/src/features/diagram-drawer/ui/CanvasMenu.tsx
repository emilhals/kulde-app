import { canvasSettings } from '@/features/diagram-drawer/store/canvas-settings'
import { useTheme } from '@/features/shared/contexts/theme-provider'
import { isLanguage, isTheme } from '@/features/shared/stores/settings'
import { setLanguage } from '@/features/shared/stores/settings.actions'
import { Button } from '@/features/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/features/shared/ui/dropdown-menu'
import {
  Globe,
  Grid2x2,
  Keyboard,
  Magnet,
  Menu,
  Monitor,
  Moon,
  Palette,
  PanelRight,
  Sun,
  View,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'
import { toggleComponentPanel } from '../store/canvas-settings.actions'

export const CanvasMenu = ({
  onOpenShortcuts,
}: {
  onOpenShortcuts: () => void
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'menu' })
  const { theme, setTheme } = useTheme()

  const settings = useSnapshot(canvasSettings)
  const stageView = canvasSettings.stageView

  const canResetStageView =
    stageView.x != 0 || stageView.y != 0 || stageView.scale != 1

  const resetStageView = () => {
    stageView.x = 0
    stageView.y = 0
    stageView.scale = 1
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-58" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('view')}</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={settings.componentPanelOpen}
            onCheckedChange={() => {
              toggleComponentPanel()
            }}
          >
            <PanelRight />
            {t('component-panel')}
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={settings.showGrid}
            onCheckedChange={(value) => {
              canvasSettings.showGrid = value
            }}
          >
            <Grid2x2 />
            {t('grid')}
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={settings.snapToGrid}
            onCheckedChange={(value) => {
              canvasSettings.snapToGrid = value
            }}
          >
            <Magnet />
            {t('snap-to-grid')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuItem
            disabled={!canResetStageView}
            onSelect={resetStageView}
          >
            <View />
            {t('reset-view')}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('preferences')}</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette />
              {t('theme')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>{t('appearance')}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    if (!isTheme(value)) return
                    setTheme(value)
                  }}
                >
                  <DropdownMenuRadioItem value="light">
                    <Sun />
                    {t('light')}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <Moon />
                    {t('dark')}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <Monitor />
                    {t('system')}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Globe />
              {t('language')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>{t('select-language')}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={settings.language}
                  onValueChange={(value) => {
                    if (!isLanguage(value)) return
                    setLanguage(value)
                  }}
                >
                  <DropdownMenuRadioItem value="en">
                    English
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="no">
                    Norsk
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem onSelect={onOpenShortcuts}>
            <Keyboard />
            {t('keyboard-shortcuts')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
