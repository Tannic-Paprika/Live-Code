const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./actions/Action");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'https://live-code-mu.vercel.app/', // Replace with your frontend domain
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
};
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  secure: true,
});
const users = new Map();
const getAllUsers = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId) => {
    return {
      socketId,
      userName: users.get(socketId),
    };
  });
};
io.on("connect", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    socket.join(roomId);
    users.set(socket.id, userName);
    const userList = getAllUsers(roomId).map((user) => user.userName);
    // Notify all other users in the room about the new user
    socket
      .to(roomId)
      .emit(ACTIONS.JOINED, { userList, userName, socketId: socket.id }); // this is for all other users except the new user
    socket.emit(ACTIONS.JOINED, { userList, userName, socketId: socket.id }); // this is for the new user
  });
  socket.on(ACTIONS.LEAVE, ({ roomId, userName }) => {
    const rooms = [...socket.rooms];
    rooms.forEach((room) => {
      if (room === roomId && users.get(socket.id) === userName) {
        socket.to(room).emit(ACTIONS.USER_LEFT, userName);
      }
    });
    users.delete(socket.id);
    socket.leave(roomId);
  });
  socket.on(ACTIONS.CODE_CHANGE, ({ value, roomId }) => {
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, value);
  });
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code}) => {
    socket.to(socketId).emit(ACTIONS.CODE_CHANGE, code);
  });
  socket.on(ACTIONS.SYNC_LANGUAGE, ({socketId, language})=>{
    socket.to(socketId).emit(ACTIONS.LANGUAGE_CHANGE, language);
  })
  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ language, roomId }) => {
    socket.to(roomId).emit(ACTIONS.LANGUAGE_CHANGE, language);
  });

});
app.get("/", (req, res) => {
  res.send("Server is running");
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
