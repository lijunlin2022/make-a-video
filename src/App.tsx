import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import SVG from './pages/svg'
import Video from './pages/video'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/svg" element={<SVG />} />
        <Route path="/video" element={<Video />} />
      </Routes>
    </BrowserRouter>
  )
}
