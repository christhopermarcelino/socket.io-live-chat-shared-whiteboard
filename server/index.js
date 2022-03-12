const express = require('express');
const app = express();
const { createServer } = require('http');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const { userList, messageList, roomList } = require('./context/data');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// route
app.use(express.static(path.join(__dirname, '..', '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client/index.html'));
});
app.get('/create-room', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client/create-room.html'));
});
app.get('/join-room', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client/join-room.html'));
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected to server`);

  // socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  socket.on('drawing', (data, room) => socket.to(room).emit('drawing', data));

  socket.on('create-room', (data) => {
    // data: {id, username, room, isPublic, isOpen}
    try {
      // check if room already exists
      const isRoomAlreadyExists = roomList.find((r) => r.room === data.room);
      if (isRoomAlreadyExists) throw new Error('Room already exists');

      // check if username already exists
      // current state: not allow same username in different room
      const isUsernameAlreadyExists = userList.find(
        (u) => u.username === data.username && u.room === data.room
      );
      if (isUsernameAlreadyExists) throw new Error('Username already exists');

      roomData = {
        room: data.room,
        isPublic: data.isPublic,
        isOpen: data.isOpen,
        admin: data.id,
      };

      roomList.push(roomData);
      const userData = {
        id: data.id,
        username: data.username,
        isAdmin: true,
        room: data.room,
      };
      userList.push(userData);

      socket.join(data.room);
      socket.emit('create-room', {
        success: true,
        message: 'Room created successfully',
      });
    } catch (err) {
      socket.emit('create-room', {
        success: false,
        message: err.message || 'Error occured',
      });
    }
  });

  socket.on('join-room', (data) => {
    // data -> username, room
    const findRoom = roomList.find((r) => r.room === data.room);
    if (findRoom) {
      const isUserAlreadyJoined = userList.find(
        (u) => u.room === data.room && u.username === data.username
      );
      if (isUserAlreadyJoined) {
        socket.emit('join-room', {
          success: false,
          message: `User named ${data.username} has already joined the room`,
        });
      } else {
        const userData = {
          id: data.id,
          username: data.username,
          room: data.room,
          isAdmin: false,
        };
        userList.push(userData);

        socket.join(data.room);

        const activeUser = userList.filter((u) => u.room === data.room);
        io.in(data.room).emit('update-users', activeUser);

        socket.emit('join-room', {
          success: true,
          message: 'Joining room successfully',
          data: {
            isPublic: data.isPublic,
            isOpen: data.isOpen,
          },
        });
      }
    } else {
      socket.emit('join-room', {
        success: false,
        message: 'Room does not exist',
      });
    }
  });

  socket.on('send-message', (data) => {
    // data = {message, author, time, room}
    messageList.push(data);

    io.in(data.room).emit('send-message', {
      success: true,
      message: 'Chat message sent successfully',
      messageList: messageList,
    });
  });

  io.on('disconnect', (reason) =>
    console.log(`${reason}: User ${socket.id} disconnected from server`)
  );
});

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
