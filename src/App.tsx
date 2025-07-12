import { BrowserRouter, Route, Routes } from "react-router-dom"
import BotBuilder from "./pages/bots/BotBuilder"
import Home from "./pages/Home"
import FlowDemo from "./pages/bots/FlowDemo";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bots" element={<BotBuilder />} />
        <Route path="/bots/flow-demo" element={<FlowDemo />} />
      </Routes>
    </BrowserRouter>
  )
}
