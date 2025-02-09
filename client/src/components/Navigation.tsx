import { NavLink } from 'react-router'

import { SnowflakeIcon } from 'lucide-react'

function Navigation() {
  return (
    <header className="z-50 h-20 bg-white w-full border-b-2 border-gray-300">
      <nav className="flex items-center text-sm h-full justify-between">
        <div className='md:flex px-8 h-full border-r-2 border-gray-300'>
          <SnowflakeIcon size={32} className='h-full text-gray-600' />
        </div>
        <div className="px-10 grow uppercase tracking-[0.2em] md:flex md:space-x-8 z-50">
          <div className="group relative h-full flex flex-col">
            <NavLink to="/simulator" className={({ isActive }) => isActive ? "text-sky-900 font-bold" : "text-gray-400 hover:text-sky-700"}>Simulator</NavLink>
          </div>
          <div className="group h-full relative flex flex-col">
            <NavLink to="/diagram" className={({ isActive }) => isActive ? "text-sky-900 font-bold" : "text-gray-400 hover:text-sky-700"}>Diagram</NavLink>
          </div>
          <div className="group relative">
            <NavLink to="/components" className={({ isActive }) => isActive ? "text-sky-900 font-bold" : "text-gray-400 hover:text-sky-700"}>Components</NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navigation
