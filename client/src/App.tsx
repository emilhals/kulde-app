import { createBrowserRouter, RouterProvider } from 'react-router'

import Layout from './components/Layout'
import HomePage from './pages/Home'
import SimulatorPage from './pages/Simulator'
import DiagramPage from './pages/Diagram'
import ComponentsPage from './pages/Components'
import ErrorPage from './pages/Error'

const router = createBrowserRouter(([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/simulator', element: <SimulatorPage /> },
      { path: '/diagram', element: <DiagramPage /> },
      { path: '/components', element: <ComponentsPage /> },
    ]
  }
]));

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
