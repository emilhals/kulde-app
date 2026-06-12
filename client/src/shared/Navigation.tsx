import { Snowflake } from 'lucide-react'
import { NavLink } from 'react-router'

type NavigationProps = { center?: React.ReactNode; right?: React.ReactNode }

const Navigation = ({ center, right }: NavigationProps) => {
  return (
    <div className="flex justify-between items-center px-4 h-14">
      <div className="flex gap-x-3 justify-center items-center ml-6 b-r">
        <span>
          <Snowflake />
        </span>

        <div className="flex flex-row gap-x-4 items-center">
          <NavLink
            to="/simulator"
            className={({ isActive }) =>
              `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Simulator
          </NavLink>

          <NavLink
            to="diagram-drawer"
            className={({ isActive }) =>
              `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Rørskjema-tegner
          </NavLink>
        </div>
      </div>

      <div className="flex flex-1 justify-center">{center}</div>

      <div className="flex gap-2 items-center mr-6">{right}</div>
    </div>
  )
}

export default Navigation
