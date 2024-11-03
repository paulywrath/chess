import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom"

import Nav from "./Components/Nav"
import Home from "./Components/Home"
import Game from "./Components/Game"
import Auth from "./Components/Auth"
import Account from "./Components/Account"

function App() {

  return (
    <Container>
      <Nav />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/game" element={ <Game /> } />
        <Route path="/auth" element={ <Auth /> } />
        <Route path="/account" element={ <Account /> } />
      </Routes>
    </Container>
  )
}

export default App
