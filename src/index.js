const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, getUser, getUsersInRoom, removeUser } = require('../src/utils/users');
const { Socket } = require('dgram');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('New websocket connection');

  socket.on('join', ({ username, room }, callback) => {
    const result = addUser(socket.id, username, room);

    if (result.status === 'fail') {
      return callback(result.error);
    }

    socket.join(result.room);

    socket.emit('message', generateMessage('Admin', 'Welcome!'));

    socket.broadcast
      .to(result.room)
      .emit('message', generateMessage('Admin', `${result.username} has joined!`));

    io.to(result.room).emit('roomData', {
      room: result.room,
      users: getUsersInRoom(result.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    const user = getUser(socket.id);

    const googleMapsLink = `https://google.com/maps?q=${location.latitude},${location.longitude}`;

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(user.username, googleMapsLink)
    );

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
