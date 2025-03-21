import { useState } from 'react'

import { NavLink } from 'react-router'

import { SnowflakeIcon, Sun, Moon } from 'lucide-react'

export const getClassStyle = (isActive: boolean) => {
  return isActive
    ? 'text-sky-900 font-bold dark:text-dark-accent'
    : 'text-gray-400 dark:text-dark-text hover:text-sky-700 dark:hover:text-dark-accent-hover'
}

const Navigation = () => {
  const [dark, setDark] = useState<boolean>(false)

  const handleDarkMode = () => {
    setDark(!dark)
    document.body.classList.toggle('dark')
  }


  return (
    <header className='bg-white dark:bg-dark-bg z-50 flex h-20 w-full border-b-2 border-gray-300 dark:border-dark-border'>
      <nav className='flex items-center text-sm h-full justify-between'>
        <div className='md:flex px-8 h-full border-r-2 border-gray-300 dark:border-dark-border'>
          <SnowflakeIcon size={32} className='h-full text-gray-600 dark:text-dark-border' />
        </div>
        <div className='px-10 grow uppercase tracking-[0.2em] md:flex md:space-x-8 z-50'>
          <div className='group relative h-full flex flex-col'>
            <NavLink to='/simulator' className={({ isActive }) => getClassStyle(isActive)}>Simulator</NavLink>
          </div>
          <div className='group h-full relative flex flex-col'>
            <NavLink to='/diagram' className={({ isActive }) => getClassStyle(isActive)}>Diagram</NavLink>
          </div>
          <div className='group relative'>
            <NavLink to='/components' className={({ isActive }) => getClassStyle(isActive)}>Components</NavLink>
          </div>

          <div className='group fixed right-0 px-10'>
            <button onClick={handleDarkMode}>
              {dark && <Sun className='bg-dark-bg hover:text-dark-accent-hover' />}
              {!dark && <Moon />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navigation
