import { Outlet } from 'react-router'

import Navigation from "./Navigation"

function Layout() {
  return (
    <div className='h-screen flex flex-col'>
      <div className='grow-0'>
        <Navigation />
      </div>
      <main className='grow'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
