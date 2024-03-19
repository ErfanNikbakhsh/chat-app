const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

let count = 0;

io.on('connection', (socket) => {
  console.log('New websocket connection');

  socket.emit('message', 'Welcome!');

  socket.broadcast.emit('message', 'A new user has joined!');

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('sendLocation', (location) => {
    const googleMapsLink = `https://google.com/maps?q=${location.latitude},${location.longitude}`;
    io.emit('message', googleMapsLink);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
