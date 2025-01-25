import { NavLink } from 'react-router'

function Navigation() {
  return (
    <header className="container fixed top-0 max-w-6xl mx-auto px-6 py-12 md:px-0">
      <nav className="flex items-center justify-between">
        <div className="hidden h-10 md:flex md:space-x-8 z-50">
          <div className="group">
            <NavLink to="/simulator">Simulator</NavLink>
            <div className="mx-2 group-hover:border-b group-hover:red-blue-50">
            </div>
          </div>
          <div className="group">
            <NavLink to="/diagram">Diagram</NavLink>
            <div className="mx-2 group-hover:border-b group-hover:red-blue-50">
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navigation
