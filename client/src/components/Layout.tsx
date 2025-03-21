import { Outlet } from 'react-router'

import Navigation from "./Navigation"

const Layout = () => {
  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <div className='grow-0'>
        <Navigation />
      </div>
      <main className='grow min-h-0 overflow-hidden'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
