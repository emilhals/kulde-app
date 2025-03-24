import { useState, useContext } from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Check, ChevronsUpDown, Spline, SquareDashedMousePointer, Type, Plus, Download, Bold, Italic, Underline } from 'lucide-react'

import { ActionContext } from '@/common/Providers'
import { ACTIONS } from '@/common/constants'

import { useAddToStore } from '@/hooks/useAddToStore'
import { ItemPreview, TextPreview } from '@/common/types'

const COMPONENTS = [
  {
    value: "compressor",
    label: "Compressor",
    img: "compressor.png",
    width: 96,
    height: 96,
  },
  {
    value: "condensator",
    label: "Condensator",
    img: "condensator.png",
    width: 96,
    height: 96,
  },
  {
    value: "evaporator",
    label: "Evaporator",
    img: "evaporator.png",
    width: 96,
    height: 96,
  },
  {
    value: "pressureswitch",
    label: "Pressure Switch",
    img: "condevap.png",
    width: 64,
    height: 64,
  },
]

export const getClassStyle = (active: boolean) => {
  return active
    ? 'bg-violet-300 dark:bg-dark-bg p-1 rounded'
    : 'dark:bg-dark-bg hover:bg-violet-100'
}

export const Actionbar = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const [textPlaceholder, setTextPlaceholder] = useState('')
  const [textAttributes, setTextAttributes] = useState({ isBold: false, isItalic: false, isUnderlined: false })
  const [component, setComponent] = useState('')

  const actionContext = useContext(ActionContext)

  const [item, setItem] = useState<ItemPreview>({
    type: 'items',
    component: '',
    height: 0,
    width: 0,
    x: 50,
    y: 50,
    textOffset: {
      placement: '',
      position: { x: 0, y: 0 }
    },
    img: '',
    locked: false,
    text: null,
  })

  const [text, setText] = useState<TextPreview>({
    type: 'texts',
    text: textPlaceholder,
    x: 0,
    y: 0,
    size: 16,
    standalone: true,
    attributes: {
      bold: false,
      italic: false,
      underline: false
    }
  })

  const createItem = (item: ItemPreview) => {
    setText({
      ...text,
      standalone: false,
    })

    const newItem: ItemPreview = {
      type: item.type,
      component: item.component,
      height: item.height,
      width: item.width,
      x: item.x,
      y: item.y,
      locked: item.locked,
      text: text,
      textOffset: item.textOffset,
      img: item.img
    }

    console.log(text)

    useAddToStore(newItem)
    setTextPlaceholder('')

    setText({
      ...text,
      text: '',
    })
    setItem({
      ...item,
      component: '',
      height: 0,
      width: 0,
      img: ''
    })
  }


  return (
    <div className='absolute z-10 flex justify-start items-center h-screen'>
      <div className='flex flex-col justify-center items-center gap-4 px-3 w-fit'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => { actionContext?.updateAction(ACTIONS.SELECT) }} className={getClassStyle(actionContext?.action === 'SELECT')}>
                <SquareDashedMousePointer className="size-5"></SquareDashedMousePointer>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select</p>
            </TooltipContent>
          </Tooltip>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavigationMenuTrigger onClick={() => { actionContext?.updateAction(ACTIONS.ADD) }} className={getClassStyle(actionContext?.action === 'ADD')} onPointerMove={(e) => { e.preventDefault() }} onPointerEnter={(e) => { e.preventDefault() }} onPointerLeave={(e) => { e.preventDefault() }}>
                      <span>
                        <Plus className={actionContext?.action === 'ADD' ? 'size-5 text-rose-300' : ' size-5'}></Plus>
                      </span>
                    </NavigationMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add item</p>
                  </TooltipContent>
                </Tooltip>

                <NavigationMenuContent onPointerEnter={(e) => e.preventDefault()} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                  <ul className="dark:bg-dark-panel dark:border-dark-accent grid bg-violet-100 gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <img className="" src={component ? component.img : 'compressor.img'} />
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <Input type="text" id="item-label" value={textPlaceholder} onChange={e => setTextPlaceholder((e.target.value))} placeholder="Label" />
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between dark:bg-dark-bg"
                        >
                          {value
                            ? COMPONENTS.find((component) => component.value === value)?.label
                            : "Select component..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search component..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No component found.</CommandEmpty>
                            <CommandGroup>
                              {COMPONENTS.map((component) => (
                                <CommandItem
                                  key={component.value}
                                  value={component.value}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setComponent(component.img)
                                    setItem({
                                      ...item,
                                      component: component.value,
                                      height: component.height,
                                      width: component.width,
                                      img: component.img,
                                    })
                                    console.log("item", item)
                                    setOpen(false)
                                  }}
                                >
                                  {component.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      value === component.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Button onClick={() => { createItem(item) }} variant="outline">
                      Add component
                    </Button>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild onClick={() => { actionContext?.updateAction(ACTIONS.WRITE) }} className={getClassStyle(actionContext?.action === ACTIONS.WRITE)}>
                    <NavigationMenuTrigger onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                      <Type className="justify-center size-5"></Type>
                    </NavigationMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add text</p>
                  </TooltipContent>
                </Tooltip>
                <NavigationMenuContent onPointerEnter={(e) => e.preventDefault()} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                  <ul className="dark:bg-dark-panel border-1 dark:border-dark-border grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <h3 className={`mt-2 ${textAttributes.isUnderlined ? 'underline' : textAttributes.isBold ? 'font-bold' : textAttributes.isItalic ? 'italic' : ''}`}>{textPlaceholder}</h3>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <Input type="text" value={textPlaceholder} onChange={(e) => setTextPlaceholder(e.target.value)} placeholder="Text" />
                    <ToggleGroup type="multiple">
                      <ToggleGroupItem onClick={() => setTextAttributes({ ...textAttributes, isBold: !textAttributes.isBold })} value="bold" aria-label="Toggle bold">
                        <Bold className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem onClick={() => setTextAttributes({ ...textAttributes, isItalic: !textAttributes.isItalic })} value="italic" aria-label="Toggle italic">
                        <Italic className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem onClick={() => setTextAttributes({ ...textAttributes, isUnderlined: !textAttributes.isUnderlined })} aria-label="Toggle strikethrough">
                        <Underline className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <Button onClick={() => { handleCreate(text) }} variant="outline">
                      Add text
                    </Button>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>


          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => actionContext?.updateAction(ACTIONS.CONNECTOR)} className={getClassStyle(actionContext?.action === ACTIONS.CONNECTOR)} >
                <Spline className="size-5"></Spline>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connect items</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => { console.log("download") }} className="dark:bg-dark-bg hover:bg-violet-100 dark:hover:bg-dark-accent-hover p-1 rounded" >
                <Download className="size-5"></Download>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>

        </TooltipProvider>
      </div>
    </div>
  )
}
