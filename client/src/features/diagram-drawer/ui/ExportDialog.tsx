import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/ui/input-group'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import { Download } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { canvasSettings } from '../store/canvas-settings'
import { ExportBackground } from '../types'

// Function from https://stackoverflow.com/a/15832662/512042
const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getFormattedDateTime = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${hours}-${minutes}-${day}-${month}-${year}`
}

type ExportDialogProps = {
  canvasPreviewURL: string
  background: ExportBackground
  onBackgroundChange: (value: ExportBackground) => void
}

export const ExportDialog = ({
  canvasPreviewURL,
  background,
  onBackgroundChange,
}: ExportDialogProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'export-dialog' })

  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const [fileName, setFileName] = useState<string>(getFormattedDateTime)

  const handleExport = () => {
    const trimmedFileName = fileName.trim() || getFormattedDateTime()

    downloadURI(canvasPreviewURL, `${trimmedFileName}.png`)
  }

  const handleBackgroundChange = (value: ExportBackground) => {
    canvasSettings.exportBackground = value
    onBackgroundChange(value)
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Download />
            {t('export')}
          </Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-sm"
          onOpenAutoFocus={(e) => {
            e.preventDefault()

            if (!cancelButtonRef.current) return
            cancelButtonRef.current.focus()
          }}
        >
          <DialogHeader>
            <DialogTitle>{t('export-diagram')}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex min-h-16 items-center justify-center overflow-hidden rounded-md border bg-muted">
            {canvasPreviewURL ? (
              <img
                ref={imageRef}
                src={canvasPreviewURL}
                alt="Forhåndsvisning av diagrammet"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className={cn('font-mono text-sm text-muted-foreground')}>
                {t('no-preview')}
              </span>
            )}
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel>{t('background')}</FieldLabel>
              <ToggleGroup
                type="single"
                value={background}
                onValueChange={handleBackgroundChange}
                className="grid w-full grid-cols-3 gap-1 rounded-lg bg-muted p-1 font-mono"
              >
                <ToggleGroupItem
                  value="transparent"
                  aria-label={t('transparent')}
                  className="h-9 gap-2 rounded-md border-0 px-2 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                  {t('transparent')}
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="light"
                  aria-label={t('light')}
                  className="h-9 gap-2 rounded-md border-0 px-2 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                  {t('light')}
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="dark"
                  aria-label={t('dark')}
                  className="h-9 gap-2 rounded-md border-0 px-2 text-xs data-[state=on]:bg-background data-[state=on]:shadow-sm"
                >
                  {t('dark')}
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>

            <Field>
              <FieldLabel className="text-muted-foreground" htmlFor="filename">
                {t('save-as')}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="filename"
                  name="name"
                  value={fileName}
                  onChange={(e) => {
                    setFileName(e.target.value)
                  }}
                />
                <InputGroupAddon align="inline-end">
                  <span>.png</span>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button ref={cancelButtonRef} variant="ghost">
                {t('cancel')}
              </Button>
            </DialogClose>
            <Button
              onClick={handleExport}
              disabled={!canvasPreviewURL}
              className={cn('bg-blue-600 hover:bg-blue-500 dark:text-white')}
            >
              {t('export')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
