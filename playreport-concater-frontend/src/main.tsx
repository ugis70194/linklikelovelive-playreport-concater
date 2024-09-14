import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.tsx'
import ConcatPlayReport from './ConcatPlayReport.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="concat" element={<ConcatPlayReport />} />
      </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
