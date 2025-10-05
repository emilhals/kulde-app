import { NavLink } from 'react-router'

import { SnowflakeIcon } from 'lucide-react'

const getClassStyle = (isActive: boolean) => {
  return isActive
    ? 'text-sky-900 font-bold dark:text-dark-accent'
    : 'text-gray-400 dark:text-dark-text hover:text-sky-700 dark:hover:text-dark-accent-hover'
}

const Navigation = () => {
  return (
    <header className="bg-white z-50 h-20 w-full border-b-2 border-gray-300">
      <nav className="flex items-center text-sm h-full justify-center">
        <div className="md:flex px-8 h-full border-r-2 border-gray-300 dark:border-dark-border">
          <SnowflakeIcon
            size={32}
            className="h-full text-gray-600 dark:text-dark-border"
          />
        </div>
        <div className="px-10 grow items-center justify-center uppercase tracking-[0.2em] md:flex md:space-x-8 z-50">
          <div className="group">
            <NavLink
              to="/simulator"
              className={({ isActive }) => getClassStyle(isActive)}
            >
              Simulator
            </NavLink>
          </div>
          <div className="group">
            <NavLink
              to="/diagram"
              className={({ isActive }) => getClassStyle(isActive)}
            >
              Diagram
            </NavLink>
          </div>
          <div className="group">
            <NavLink
              to="/components"
              className={({ isActive }) => getClassStyle(isActive)}
            >
              Components
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navigation
