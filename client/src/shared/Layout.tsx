import { useState } from 'react'
import { Outlet } from 'react-router'
import Navigation from './Navigation'

const Layout = () => {
    const [navContent, setNavContent] = useState({
        center: null,
        right: null,
    })

    return (
        <div className="flex overflow-hidden flex-col h-screen">
            <div className="grow-0">
                <Navigation
                    center={navContent.center}
                    right={navContent.right}
                />
            </div>
            <main className="overflow-hidden relative min-h-0 grow">
                <Outlet context={{ setNavContent }} />
            </main>
        </div>
    )
}

export default Layout
