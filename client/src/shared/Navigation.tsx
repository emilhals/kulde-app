import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router'

type NavigationProps = {
    center?: React.ReactNode
    right?: React.ReactNode
}

const Navigation = ({ center, right }: NavigationProps) => {
    const [showLinks, setShowLinks] = useState<boolean>(true)

    return (
        <div className="flex justify-between items-center px-4 h-14">
            <div className="flex gap-x-3 justify-center items-center ml-6 b-r">
                <span className="font-semibold">kulde.app</span>

                <button onClick={() => setShowLinks(!showLinks)}>
                    {showLinks ? (
                        <ChevronLeft size={16} />
                    ) : (
                        <ChevronRight size={16} />
                    )}
                </button>

                {showLinks && (
                    <div className="flex flex-row gap-x-4 items-center">
                        <NavLink
                            to="/simulator"
                            className={({ isActive }) =>
                                isActive ? 'font-bold' : ''
                            }
                        >
                            Simulator
                        </NavLink>

                        <NavLink
                            to="diagram-drawer"
                            className={({ isActive }) =>
                                isActive ? 'font-bold' : ''
                            }
                        >
                            Rørskjema-tegner
                        </NavLink>

                        <span className="px-2 h-screen border-r" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 justify-center">{center}</div>

            <div className="flex gap-2 items-center mr-6">{right}</div>
        </div>
    )
}

export default Navigation
