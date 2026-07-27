import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import { Bold, Italic, Underline } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Attribute } from '@/features/diagram-drawer/types'

export const TextPopover = ({
  onAddText,
  onClose,
}: {
  onAddText: (text: string, attributes: Attribute[]) => void
  onClose: () => void
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'diagram-drawer' })

  const [text, setText] = useState('')
  const [attributes, setAttributes] = useState<Attribute[]>([])

  const handleAdd = () => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    onAddText(trimmedText, attributes)

    setText('')
    setAttributes([])

    onClose()
  }

  return (
    <form
      className="flex w-52 flex-col gap-2 rounded-lg px-2 py-2"
      onSubmit={(event) => {
        event.preventDefault()
        handleAdd()
      }}
    >
      <div className="flex flex-row items-center justify-center gap-2">
        <Input
          name="text"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder={t('enter-text')}
        />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Stil</p>
        <ToggleGroup
          value={attributes}
          onValueChange={(values) => setAttributes(values as Attribute[])}
          className="flex"
          variant="outline"
          type="multiple"
        >
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <Underline aria-hidden="true" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Button type="submit" disabled={!text.trim()} variant="outline">
        {t('add')}
      </Button>
    </form>
  )
}
