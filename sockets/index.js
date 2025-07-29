const { Server } = require('socket.io');


let io;
const onlineUsers = new Map(); // userId <-> socketId

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // Authenticate user from token
    const token = socket.handshake.auth?.token;
    let userId = null;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.id;
        onlineUsers.set(userId, socket.id);
        io.emit('presence', Array.from(onlineUsers.keys()));
      } catch {}
    }

    socket.on('join', (roomId) => {
      socket.join(roomId);
      // Emit presence to room
      io.to(roomId).emit('presence', Array.from(onlineUsers.keys()));
    });

    socket.on('message', (data) => {
      io.to(data.roomId).emit('message', data);
    });

    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('typing', { userId });
    });

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        // Emit presence to all rooms this socket was in
        socket.rooms.forEach(roomId => {
          if (roomId !== socket.id) {
            io.to(roomId).emit('presence', Array.from(onlineUsers.keys()));
          }
        });
      }
    });
  });
}

module.exports = { initSocket }; 