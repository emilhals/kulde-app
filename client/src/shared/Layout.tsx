import { useState } from 'react'
import { Outlet } from 'react-router'
import Navigation from './Navigation'

const Layout = () => {
    const [navContent, setNavContent] = useState({
        center: null,
        right: null,
    })

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="grow-0">
                <Navigation
                    center={navContent.center}
                    right={navContent.right}
                />
            </div>
            <main className="grow min-h-0 overflow-hidden relative">
                <Outlet context={{ setNavContent }} />
            </main>
        </div>
    )
}

export default Layout
