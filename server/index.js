const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const { userList, messageList, roomList } = require('./context/data');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected to server`);

  socket.on('create-room', (data) => {
    // data: {id, username, room, isPublic, isOpen}
    try {
      roomData = {
        room: data.room,
        isPublic: data.isPublic,
        isOpen: data.isOpen,
        admin: data.id,
      };
      roomList.push(roomData);
      userData = { id: data.id, username: data.username, isAdmin: true };

      socket.join(data.room);
      socket.emit('create-room', {
        success: true,
        message: 'Room created successfully',
      });
    } catch (err) {
      socket.emit('create-room', {
        success: true,
        message: err.message || 'Error occured',
      });
    }
  });

  io.on('disconnect', (reason) =>
    console.log(`${reason}: User ${socket.id} disconnected from server`)
  );
});

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
