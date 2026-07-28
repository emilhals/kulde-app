import { AirVent, ChevronRight, PencilRuler, Snowflake } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

export const NotFound = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'not-found' })
  const navigate = useNavigate()

  return (
    <main className="flex flex-col items-center justify-center gap-12 pt-20">
      <section className="flex flex-col gap-2">
        <h3 className="text-5xl font-bold">{t('title')}!</h3>
        <h4>{t('description')}</h4>
      </section>

      <section className="z-10 flex w-96 max-w-96 flex-col gap-8 pt-20">
        <div
          onClick={() => {
            navigate('/simulator')
          }}
          className="flex h-32 min-h-32 items-center gap-6 rounded-md border border-dashed border-muted-foreground p-5 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-800"
        >
          <AirVent className="size-4 shrink-0" />
          <div>
            <h3 className="text-base font-semibold">{t('simulator.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('simulator.description')}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0" />
        </div>

        <div
          onClick={() => {
            navigate('/diagram-drawer')
          }}
          className="flex h-32 min-h-32 items-center gap-6 rounded-md border border-dashed border-muted-foreground p-5 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-800"
        >
          <PencilRuler className="size-4 shrink-0" />
          <div>
            <h3 className="text-base font-semibold">
              {t('diagram-drawer.title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('diagram-drawer.description')}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0" />
        </div>
      </section>

      <div className="absolute bottom-0 left-1/2 z-0 translate-x-1/2 translate-y-1/4 text-muted-foreground opacity-10 transition">
        <Snowflake className="glow" size={512} />
      </div>
    </main>
  )
}
