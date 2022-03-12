const express = require('express');
const app = express();
const { createServer } = require('http');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
let { userList, messageList, roomList, logList } = require('./context/data');

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
  let userId = socket.id;
  console.log(`User ${userId} connected to server`);

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

      const logData = {
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        message: `${data.username} joined the room`,
        room: data.room,
      };

      logList.unshift(logData);

      const logRoom = logList.filter((l) => l.room === data.room);
      io.in(data.room).emit('interact-room', logRoom);
    } catch (err) {
      socket.emit('create-room', {
        success: false,
        message: err.message || 'Error occured',
      });
    }
  });

  socket.on('join-room', (data) => {
    // data -> username, room
    try {
      const findRoom = roomList.find((r) => r.room === data.room);
      if (findRoom) {
        // check if room is accessible
        if (!findRoom.isPublic) throw new Error('Room is not accessible');

        // check if username already exists
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
            id: socket.id,
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

          const logData = {
            time: `${new Date().getHours()}:${new Date().getMinutes()}`,
            message: `${data.username} joined the room`,
            room: data.room,
          };

          logList.unshift(logData);

          const logRoom = logList.filter((l) => l.room === data.room);
          io.in(data.room).emit('interact-room', logRoom);
        }
      } else {
        socket.emit('join-room', {
          success: false,
          message: 'Room does not exist',
        });
      }
    } catch (err) {
      socket.emit('join-room', {
        success: false,
        message: err.message || 'Error occured',
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

  socket.on('disconnect', (reason) => {
    const user = userList.find((u) => u.id === userId);
    userList = userList.filter((u) => u.id !== userId);
    console.log(`${reason}: User ${socket.id} disconnected from server`);
    const logData = {
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      message: `${user.username} exit the room`,
      room: user.room,
    };

    logList.unshift(logData);

    const logRoom = logList.filter((l) => l.room === user.room);
    io.in(user.room).emit('interact-room', logRoom);
  });
});

httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
