import { DiagramPage } from '@/features/diagram-drawer/page'
import { ThemeProvider } from '@/features/shared/contexts/theme-provider'
import Layout from '@/features/shared/Layout'
import { SimulatorPage } from '@/features/simulator/page'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { NotFound } from './404'
import './i18n'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/simulator" replace /> },
      { path: '/simulator', element: <SimulatorPage /> },
      { path: '/diagram-drawer', element: <DiagramPage /> },
      { path: '*', element: <NotFound /> },
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
