const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

let count = 0;

io.on('connection', (socket) => {
  console.log('New websocket connection');

  socket.emit('message', generateMessage('Welcome!'));

  socket.broadcast.emit('message', generateMessage('A new user has joined!'));

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    const googleMapsLink = `https://google.com/maps?q=${location.latitude},${location.longitude}`;

    io.emit('locationMessage', generateLocationMessage(googleMapsLink));

    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  });
});

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
