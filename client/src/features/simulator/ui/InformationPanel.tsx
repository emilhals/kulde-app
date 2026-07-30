import { AnimatePresence, motion } from 'motion/react'
import { useSnapshot } from 'valtio'
import { simulationState } from '../stores/simulation'
import { getUnitSymbol } from '../utils/units'
import { useTranslation } from 'react-i18next'

type ComponentKey = 'compressor' | 'evaporator' | 'condensor'

export const InformationPanel = ({ show }: { show: boolean }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'symbols' })

  const components = useSnapshot(simulationState.components)

  return (
    <AnimatePresence initial={false}>
      {show ? (
        <motion.aside
          layout
          initial={{ width: 0, borderWidth: 0 }}
          animate={{ width: 240, borderWidth: 1 }}
          exit={{ width: 0, borderWidth: 0 }}
          transition={{ duration: 0.2 }}
          key="component-panel"
          className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-900"
        >
          <section className="flex min-h-0 w-full flex-1 flex-col gap-y-2 px-3 pb-3 pt-3">
            {Object.entries(components).map(([key, values]) => {
              const componentKey = key.toLowerCase() as ComponentKey

              return (
                <article key={key}>
                  <h3 className="text-md capitalize">{t(`${componentKey}`)}</h3>

                  {Object.entries(values).map(([key, data]) => (
                    <div
                      key={key}
                      className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-baseline gap-x-2 text-sm text-muted-foreground"
                    >
                      <span>{key}</span>
                      <span className="text-muted-foreground/70">
                        {data.value}
                      </span>
                      <span>{getUnitSymbol(data.unit)}</span>
                    </div>
                  ))}
                </article>
              )
            })}
          </section>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
