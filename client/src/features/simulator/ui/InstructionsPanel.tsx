import { CloudSnow, Fan, Snowflake } from 'lucide-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Rnd } from 'react-rnd'
import { uiState } from '../stores/ui'
import { FloatingPanelHeader } from './FloatingPanelHeader'
import { useSnapshot } from 'valtio'
import {
  resizePanel,
  setActivePanel,
  setPanelPosition,
  togglePin,
} from '../stores/ui.actions'

export const InstructionsPanel = () => {
  const { t } = useTranslation('simulator', { keyPrefix: 'instructions' })

  const uiSnap = useSnapshot(uiState)
  const panel = uiSnap.panels.instructions

  const nodeRef = useRef<HTMLDivElement>({} as any)

  return (
    <Rnd
      size={{ width: panel.width, height: panel.height }}
      position={{ x: panel.x, y: panel.y }}
      onDragStop={(_, d) => {
        setPanelPosition('instructions', { x: d.x, y: d.y })
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        const { width, height } = ref.style

        resizePanel(
          'instructions',
          { width: width, height: height },
          { x: position.x, y: position.y },
        )
      }}
      bounds="#container"
      dragHandleClassName="instructions-drag-handle"
      className="z-50"
    >
      <div
        ref={nodeRef}
        className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow-lg"
      >
        <FloatingPanelHeader
          dragHandleClassName="instructions-drag-handle"
          title="instructions"
          isPinned={uiSnap.panels.instructions.isPinned}
          onPin={() => {
            togglePin('instructions')
          }}
          onClose={() => {
            setActivePanel(null)
          }}
        />

        <div className="grid gap-8 bg-background p-6 md:grid-cols-2">
          <div className="flex flex-col gap-8">
            <section>
              <h3 className="mb-3 font-semibold">{t('symbols.title')}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Snowflake className="size-5 border border-muted-foreground" />
                  <span className="w-3 text-center">=</span>
                  <span>{t('symbols.cooling')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CloudSnow className="size-5 border border-muted-foreground" />
                  <span className="w-3 text-center">=</span>
                  <span> {t('symbols.defrosting')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Fan className="size-5 border border-muted-foreground" />
                  <span className="w-3 text-center">=</span>
                  <span>{t('symbols.fan-running')}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold">{t('setpoint.title')}</h3>

              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                <li>{t('setpoint.steps.open')}</li>
                <li>{t('setpoint.steps.adjust')}</li>
                <li>{t('setpoint.steps.save')}</li>
              </ol>
            </section>
          </div>

          <div className="flex flex-col gap-8">
            <section>
              <h3 className="mb-3 font-semibold">{t('parameters.title')}</h3>

              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                <li>{t('parameters.steps.open')}</li>
                <li>{t('parameters.steps.navigate')}</li>
                <li>{t('parameters.steps.edit')}</li>
                <li>{t('parameters.steps.adjust')}</li>
                <li>{t('parameters.steps.save')}</li>
              </ol>
            </section>

            <section>
              <h3 className="mb-3 font-semibold">
                {t('other-functions.title')}
              </h3>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-medium">
                    {t('other-functions.defrost-sensor.title')}
                  </dt>
                  <dd className="text-muted-foreground">
                    {t('other-functions.defrost-sensor.instruction')}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium">
                    {t('other-functions.manual-defrost.title')}
                  </dt>
                  <dd className="text-muted-foreground">
                    {t('other-functions.manual-defrost.instruction')}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </Rnd>
  )
}
