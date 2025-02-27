import { useState, useContext, useEffect } from 'react'

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
import { ACTIONS } from '@/common/constants'
import { ItemType, TextType } from '@/common/types'
import { ActionContext } from '@/common/ActionContext'

import { useAddToStore } from '@/hooks/useAddToStore'

const COMPONENTS = [
  {
    value: "compressor",
    label: "Compressor",
    img: "compressor.png",
    width: 112,
    height: 112,
  },
  {
    value: "condensator",
    label: "Condensator",
    img: "condensor.png",
    width: 112,
    height: 112,
  },
  {
    value: "evaporator",
    label: "Evaporator",
    img: "evaporator.png",
    width: 112,
    height: 112,
  },
  {
    value: "pressureswitch",
    label: "Pressure Switch",
    img: "condevap.png",
    width: 64,
    height: 64,
  },
]

/* placeholder for item creation */
let item: ItemType = {
  id: '', /* set in useAddToStore */
  img: '',
  textXOffset: 0,
  textYOffset: 0,
  height: 0,
  width: 0,
  x: 64,
  y: 64,
  lines: [],
  label: '',
  type: ''
}

/* placeholders for text creation */
let text: TextType = {
  id: '', /* set in useAddToStore */
  text: '',
  size: 16,
  bold: false,
  italic: false,
  underline: false
}

export const Actionbar = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const [itemLabel, setItemLabel] = useState('')

  const [textPlaceholder, setTextPlaceholder] = useState('')
  const [textAttributes, setTextAttributes] = useState({ isBold: false, isItalic: false, isUnderlined: false })

  const [component, setComponent] = useState('')

  const actionContext = useContext(ActionContext)
  /* from navigation menu. used for item creation */
  item.label = itemLabel
  item.type = component.type
  item.width = component.width
  item.height = component.height

  text.bold = textAttributes.isBold
  text.italic = textAttributes.isItalic
  text.underline = textAttributes.isUnderlined
  text.text = textPlaceholder
  text.x = 50
  text.y = 50
  text.independent = true

  useEffect(() => {
    console.log(textAttributes.isBold)
  }, [textAttributes.isBold])

  text.text = textPlaceholder

  return (
    <div className="flex justify-center items-center gap-4 px-3 w-fit mx-auto border shadow-lg rounded-lg">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <button onClick={() => { actionContext?.updateAction(ACTIONS.SELECT) }} className={actionContext?.action === 'SELECT' ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
              <SquareDashedMousePointer className="size-5"></SquareDashedMousePointer>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Select</p>
          </TooltipContent>
        </Tooltip>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className={actionContext?.action === ACTIONS.ADD ? "bg-white p-1 rounded" : "p-1 hover:bg-white rounded"}>
              <NavigationMenuTrigger className={actionContext?.action === ACTIONS.ADD ? "bg-white p-1 rounded" : "p-1 hover:bg-white rounded"} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                <Tooltip>
                  <TooltipTrigger onClick={() => { actionContext?.updateAction(ACTIONS.ADD) }} className={actionContext?.action === ACTIONS.ADD ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
                    <Plus className="justify-center size-5"></Plus>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add item</p>
                  </TooltipContent>
                </Tooltip>
              </NavigationMenuTrigger>
              <NavigationMenuContent onPointerEnter={(e) => e.preventDefault()} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
                  <Input type="text" id="item-label" value={itemLabel} onChange={e => setItemLabel((e.target.value))} placeholder="Label" />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
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
                                  setComponent(component)
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
                  <Button onClick={() => { useAddToStore('item', item) }} variant="outline">
                    Add component
                  </Button>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className={actionContext?.action === ACTIONS.WRITE ? "bg-white p-1 rounded" : "p-1 hover:bg-white rounded"}>
              <NavigationMenuTrigger className={actionContext?.action === ACTIONS.WRITE ? "bg-white p-1 rounded" : "p-1 hover:bg-white rounded"} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                <Tooltip>
                  <TooltipTrigger onClick={() => { actionContext?.updateAction(ACTIONS.WRITE) }} className={actionContext?.action === ACTIONS.WRITE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
                    <Type className="justify-center size-5"></Type>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add text</p>
                  </TooltipContent>
                </Tooltip>
              </NavigationMenuTrigger>
              <NavigationMenuContent onPointerEnter={(e) => e.preventDefault()} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
                  <Button onClick={() => { useAddToStore('text', text) }} variant="outline">
                    Add text
                  </Button>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>


        <Tooltip>
          <TooltipTrigger>
            <button onClick={() => actionContext.updateAction(ACTIONS.CONNECTOR)} className={actionContext.action === ACTIONS.CONNECTOR ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} >
              <Spline className="size-5"></Spline>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connect items</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <button onClick={() => { console.log("download") }} className="p-1 rounded hover:bg-violet-100" >
              <Download className="size-5"></Download>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
