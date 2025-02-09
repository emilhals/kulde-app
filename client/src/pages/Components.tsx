
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

const ComponentsPage = () => {
  return (
    <div className="grid grid-flow-col grid-rows-3 gap-1">
      <aside id="sidebar" className="row-span-3 w-96 bg-gray-50 h-full">
        <h3>Components</h3>
      </aside>
      <div className="col-span-3 bg-gray-300">
        <h3>Evaporator</h3>
      </div>
      <div className="col-span-2 row-span-2 bg-gray-100">
        <Canvas>
          <Stars />
        </Canvas>
      </div>
    </div>
  )
}

export default ComponentsPage
