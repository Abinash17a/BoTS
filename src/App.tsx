import { BrowserRouter, Route, Routes } from "react-router-dom"
import BotBuilder from "./pages/bots/BotBuilder"
import Home from "./pages/Home"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bots" element={<BotBuilder />} />
      </Routes>
    </BrowserRouter>
  )
}
