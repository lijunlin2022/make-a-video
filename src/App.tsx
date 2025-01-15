import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Nib from './pages/nib'
import SVG from './pages/svg'
import Video from './pages/video'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/svg" element={<SVG />} />
        <Route path="/video" element={<Video />} />
        <Route path="/nib" element={<Nib />} />
      </Routes>
    </BrowserRouter>
  )
}
