import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Simulator from './pages/Simulator.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Simulator" element={<Simulator />} /> 
    </Routes>
  
  </BrowserRouter>
)
