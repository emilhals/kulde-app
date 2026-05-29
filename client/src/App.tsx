import { SimulatorPage } from '@/features/simulator/page'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import DiagramPage from './pages/Diagram'
import Layout from './shared/Layout'
import './i18n'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/simulator" replace /> },
      { path: '/simulator', element: <SimulatorPage /> },
      { path: '/diagram-drawer', element: <DiagramPage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
