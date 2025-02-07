import { Outlet } from 'react-router'

function Layout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>

  )
}

export default Layout
