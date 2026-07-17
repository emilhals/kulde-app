import { SimulatorPage } from '@/features/simulator/page'
import Layout from '@/shared/Layout'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import DiagramPage from './pages/Diagram'
import './i18n'
import { ThemeProvider } from '@/shared/contexts/theme-provider'

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
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
