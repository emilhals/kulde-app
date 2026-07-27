import { Outlet } from 'react-router'
import { Navigation } from '@/shared/Navigation'

const Layout = () => {
  return (
    <div className="flex overflow-hidden flex-col h-screen dark:bg-slate-900">
      <div className="grow-0">
        <Navigation />
      </div>
      <main className="overflow-hidden relative min-h-0 grow">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
