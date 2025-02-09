import { Outlet } from 'react-router'

import Navigation from "./Navigation"

function Layout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navigation />
      <main className='grow'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
