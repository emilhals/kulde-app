import { Canvas } from '@react-three/fiber'
import { OrthographicCamera, CameraControls, Stage, Loader, Center } from '@react-three/drei'
import { MeshStandardMaterial } from 'three';
import { Separator } from '@/components/ui/separator'

import { Suspense, useEffect, useState } from 'react';
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import Model from '@/components/canvas/Model';

import { COMPONENTS } from '@/constants';

const ComponentsPage = () => {

  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(COMPONENTS[0])

  return (
    <div className="grid grid-flow-col grid-rows-3 gap-1 h-full overflow-hidden">
      <aside id="sidebar" className="row-span-3 w-96 bg-gray-50 h-full overflow-y-auto p-4 border-r-2 border-gray-200">
        <h3 className='font-bold text-xl py-2'>Components</h3>
        <Separator />
        <ul>
          {COMPONENTS.map((component) => (
            <li key={component.id} onClick={() => { setSelectedItem(component) }} className={component === selectedItem ? 'font-bold' : ''}>{component.name}</li>
          ))}
        </ul>
      </aside>
      <div className="col-span-3 ">
        <Canvas>
          <Stage>
            <Suspense fallback={null}>
              <OrthographicCamera />
              <CameraControls />
              <ambientLight intensity={0.1} />
              <directionalLight />
              <Model item={selectedItem} />
            </Suspense>
          </Stage>
        </Canvas>
        <Loader />
      </div>

      <div className="col-span-3 row-span-2 border-t-2 p-4 ">
        <h3>{selectedItem.desc}</h3>
      </div>
    </div>
  )
}

export default ComponentsPage
