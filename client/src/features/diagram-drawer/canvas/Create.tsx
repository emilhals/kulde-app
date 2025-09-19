import { useState } from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const COMPONENTS = [
  {
    value: 'compressor',
    label: 'Compressor',
    img: 'compressor.png',
    width: 96,
    height: 96,
  },
  {
    value: 'condensator',
    label: 'Condensator',
    img: 'condensator.png',
    width: 96,
    height: 96,
  },
  {
    value: 'evaporator',
    label: 'Evaporator',
    img: 'evaporator.png',
    width: 96,
    height: 96,
  },
  {
    value: 'pressureswitch',
    label: 'Pressure Switch',
    img: 'condevap.png',
    width: 64,
    height: 64,
  },
]

import { CirclePlus, ChevronsUpDown, Check } from 'lucide-react'

import { ItemPreview, TextPreview } from '@/features/diagram-drawer/types'

import { useAddToStore } from '@/hooks/useAddToStore'

export const Create = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const [textPlaceholder, setTextPlaceholder] = useState('')
  const [component, setComponent] = useState('')

  const [item, setItem] = useState<ItemPreview>({
    type: 'items',
    component: '',
    height: 0,
    width: 0,
    x: 50,
    y: 50,
    textOffset: {
      placement: '',
      position: { x: 0, y: 0 },
    },
    img: '',
    locked: false,
    text: null,
  })

  const [text] = useState<TextPreview>({
    type: 'texts',
    text: textPlaceholder,
    x: 0,
    y: 0,
    size: 16,
    standalone: true,
    attributes: {
      bold: false,
      italic: false,
      underline: false,
    },
  })

  const createItem = (item: ItemPreview) => {
    const newText: TextPreview = {
      ...text,
      text: textPlaceholder,
    }

    const newItem: ItemPreview = {
      type: item.type,
      component: item.component,
      height: item.height,
      width: item.width,
      x: item.x,
      y: item.y,
      locked: item.locked,
      text: newText,
      textOffset: item.textOffset,
      img: item.img,
    }

    useAddToStore(newItem)
    setTextPlaceholder('')

    setItem({
      ...item,
      component: '',
      height: 0,
      width: 0,
      img: '',
    })
  }

  return (
    <div className="absolute z-50 bottom-0 mx-4 mb-4">
      <Popover>
        <PopoverTrigger className="bg-transparent">
          <CirclePlus
            size={24}
            onClick={() => {
              setOpen(!open)
            }}
          />
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={8}
          className="bg-transparent border-none transition-none duration-0"
        >
          <ul className="dark:bg-dark-panel dark:border-dark-accent grid bg-violet-100 gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            <li className="row-span-3">
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/"
              >
                <img
                  className=""
                  src={component ? component.img : 'compressor.img'}
                />
              </a>
            </li>
            <Input
              type="text"
              id="item-label"
              value={textPlaceholder}
              onChange={(e) => setTextPlaceholder(e.target.value)}
              placeholder="Label"
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between dark:bg-dark-bg"
                >
                  {value
                    ? COMPONENTS.find((component) => component.value === value)
                        ?.label
                    : 'Select component...'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command className="transition-none duration-0">
                  <CommandInput
                    placeholder="Search component..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No component found.</CommandEmpty>
                    <CommandGroup>
                      {COMPONENTS.map((component) => (
                        <CommandItem
                          key={component.value}
                          value={component.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? '' : currentValue)
                            setComponent(component.img)
                            setItem({
                              ...item,
                              component: component.value,
                              height: component.height,
                              width: component.width,
                              img: component.img,
                            })
                            console.log('item', item)
                            setOpen(false)
                          }}
                        >
                          {component.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              value === component.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => {
                createItem(item)
              }}
              variant="outline"
            >
              Add component
            </Button>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}
