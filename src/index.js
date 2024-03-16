const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', () => {
  console.log('New websocket connection');
});

server.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
