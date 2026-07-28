import { Navigation } from '@/features/shared/Navigation'
import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden dark:bg-slate-900">
      <div className="grow-0">
        <Navigation />
      </div>
      <main className="relative min-h-0 grow overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
