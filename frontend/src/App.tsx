import { BrowserRouter, Route, Routes } from "react-router-dom"
import Sender from "./components/Sender"
import Receiver from "./components/Receiver"

export default function App(){
  return <BrowserRouter>
    <Routes>
      <Route path="/sender" element={<Sender/>}></Route>
      <Route path="/receiver" element={<Receiver/>}></Route>
    </Routes>
  </BrowserRouter>
}