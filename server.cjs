const express = require('express');
const { Server } = require("socket.io");
const { v4: uuidV4 } = require('uuid');
const http = require('http');

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 8080 

const io = new Server(server, {
  cors: '*',
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');

  socket.on('username', (username) => {
    console.log('username:', username);
    socket.data.username = username;
  });

  socket.on('createRoom', async (callback) => {
    const roomId = uuidV4();
    await socket.join(roomId);
   
    rooms.set(roomId, {
      roomId,
      players: [{ id: socket.id, username: socket.data?.username }]
    });

    callback(roomId);
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});