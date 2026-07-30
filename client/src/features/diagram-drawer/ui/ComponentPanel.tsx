import { COMPONENTS } from '@/features/diagram-drawer/constants/components'
import { addTextToStore } from '@/features/diagram-drawer/store/actions'
import { Attribute, Point } from '@/features/diagram-drawer/types'
import { ComponentItem } from '@/features/diagram-drawer/ui/ComponentItem'
import { Button } from '@/features/shared/ui/button'
import { Popover, PopoverTrigger } from '@/features/shared/ui/popover'
import { ScrollArea } from '@/features/shared/ui/scroll-area'
import { PopoverContent } from '@radix-ui/react-popover'
import { Type } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { TextPopover } from './TextPopover'

export const ComponentPanel = ({ show }: { show: boolean }) => {
  const [openTextPopover, setOpenTextPopover] = useState(false)

  const { width, height } = useWindowSize()

  const handleAddText = (text: string, attributes: Attribute[]) => {
    const position: Point = { x: width / 2, y: height / 2 }

    addTextToStore(text, attributes, position)
  }

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
          className="flex w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-900"
        >
          <section className="flex min-h-0 w-full flex-1 flex-col items-center pt-2">
            <ScrollArea className="min-h-0 w-full flex-1">
              <div className="grid grid-cols-2 justify-items-center gap-y-2">
                {COMPONENTS.map((c) => (
                  <ComponentItem key={c.component} item={c} />
                ))}
              </div>
            </ScrollArea>
          </section>

          <section className="flex shrink-0 items-center justify-center border-t p-2 pt-2 text-base">
            <Popover open={openTextPopover} onOpenChange={setOpenTextPopover}>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => {
                    setOpenTextPopover(!openTextPopover)
                  }}
                  variant="ghost"
                  size="sm"
                  className="[&_svg]:size-3.5"
                >
                  <Type />
                  <span className="text-sm">Legg til tekst</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-52 rounded-lg border bg-popover text-popover-foreground shadow-md"
                align="end"
                side="left"
                sideOffset={8}
              >
                <TextPopover
                  onAddText={handleAddText}
                  onClose={() => {
                    setOpenTextPopover(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </section>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
