import { useTheme } from '@/features/shared/contexts/theme-provider'
import { globalSettings, isLanguage } from '@/features/shared/stores/settings'
import { setLanguage } from '@/features/shared/stores/settings.actions'
import { Theme } from '@/features/shared/types'
import { Button } from '@/features/shared/ui/button'
import {
  DropdownMenu,
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
  isSpeed,
  simulationState,
} from '@/features/simulator/stores/simulation'
import {
  isPressureUnit,
  isTemperatureUnit,
  uiState,
} from '@/features/simulator/stores/ui'
import {
  CircleQuestionMark,
  Gauge,
  Globe,
  Menu,
  Monitor,
  Moon,
  Palette,
  Play,
  RotateCcw,
  Square,
  Sun,
  TableProperties,
  Thermometer,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'
import { setSimulationSpeed } from '../stores/simulation.actions'
import {
  setActivePanel,
  setPressureUnit,
  setTemperatureUnit,
} from '../stores/ui.actions'

type SimulationMenuProps = {
  onStart: () => void
  onStop: () => void
  onRestart: () => void
}

export const SimulationMenu = ({
  onStart,
  onRestart,
  onStop,
}: SimulationMenuProps) => {
  const { t } = useTranslation(['simulator', 'common'])
  const { theme, setTheme } = useTheme()

  const controls = useSnapshot(simulationState.controls)
  const ui = useSnapshot(uiState)
  const settings = useSnapshot(globalSettings)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-58" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('simulation')}</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={onStart}
            disabled={controls.status === 'running'}
          >
            <Play size={5} />
            {t('start-simulation')}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onStop}
            disabled={controls.status === 'idle'}
          >
            <Square />
            {t('stop-simulation')}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Gauge />
              {t('menu.speed')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>{t('menu.set-speed')}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={controls.speed}
                  onValueChange={(value) => {
                    if (!isSpeed(value)) return
                    setSimulationSpeed(value)
                  }}
                >
                  <DropdownMenuRadioItem value="slow">
                    {t('menu.slow')}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="normal">
                    {t('menu.normal')}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="fast">
                    {t('menu.fast')}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem onSelect={onRestart}>
            <RotateCcw />
            {t('menu.reset-simulation')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('controller.title')}</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => {
              setActivePanel('instructions')
            }}
          >
            <CircleQuestionMark />
            {t('controller.instructions')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setActivePanel('parameters')
            }}
          >
            <TableProperties />
            {t('controller.parameters')}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RotateCcw />
            {t('controller.reset-parameters')}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {t('preferences', { ns: 'common' })}
          </DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Thermometer />
              {t('menu.units', { ns: 'simulator' })}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>
                  {t('menu.set-units', { ns: 'simulator' })}
                </DropdownMenuLabel>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {t('menu.temperature', { ns: 'simulator' })}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={ui.units.temperature}
                        onValueChange={(value) => {
                          if (!isTemperatureUnit(value)) return
                          setTemperatureUnit(value)
                        }}
                      >
                        <DropdownMenuRadioItem value="celsius">
                          Celsius
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="fahrenheit">
                          Fahrenheit
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {t('menu.pressure', { ns: 'simulator' })}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={ui.units.pressure}
                        onValueChange={(value) => {
                          if (!isPressureUnit(value)) return
                          setPressureUnit(value)
                        }}
                      >
                        <DropdownMenuRadioItem value="bar">
                          Bar
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="kpa">
                          kPa
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette />
              {t('theme', { ns: 'common' })}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>
                  {t('appearance', { ns: 'common' })}
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(theme) => {
                    setTheme(theme as Theme)
                  }}
                >
                  <DropdownMenuRadioItem value="light">
                    <Sun />
                    {t('light', { ns: 'common' })}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <Moon />
                    {t('dark', { ns: 'common' })}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <Monitor />
                    {t('system', { ns: 'common' })}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Globe />
              {t('language', { ns: 'common' })}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>
                  {t('select-language', { ns: 'common' })}
                </DropdownMenuLabel>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
