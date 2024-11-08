import { useState } from "react";
import { Container, TextField } from "@mui/material";
import { Route, Routes } from "react-router-dom";

import socket from './socket';
import CustomDialog from "./Components/CustomDialog";
import Nav from "./Components/Nav";
import Home from "./Components/Home";
import Game from "./Components/Game";
import Auth from "./Components/Auth";
import Account from "./Components/Account";

function App() {

  const [username, setUsername] = useState('');

  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  return (
    <Container>
      <Nav />
      <CustomDialog
        open={!usernameSubmitted}
        title="Pick a username"
        contentText="Please select a username"
        handleContinue={() => {
          if (!username) return;
          socket.emit("username", username);
          setUsernameSubmitted(true);
        }}
      >
        <TextField 
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          name="username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
        />
      </CustomDialog>
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
