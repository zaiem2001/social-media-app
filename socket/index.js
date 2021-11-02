const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// const io = require("socket.io")(PORT, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

app.use(cors());

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const deleteUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

app.get("/", (req, res) => {
  try {
    res.status(200).json({ msg: "server is running..." });
  } catch (error) {
    res.status(500).json(error);
  }
});

io.on("connection", (socket) => {
  console.log("user connected...");

  //take userid and sId from user and add to users array.

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message.

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    io.to(user?.socketId).emit("getMessage", { senderId, text });
  });

  // Notification event -

  socket.on("SendNotification", ({ senderId, senderName, receiverId }) => {
    const receiver = getUser(receiverId);

    io.to(receiver?.socketId).emit("getNotification", { senderId, senderName });
  });

  //when disconnect...
  socket.on("disconnect", () => {
    // console.log("user disconnected...");
    deleteUser(socket.id);

    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 8900;

server.listen(PORT, () => console.log("server is running on port " + PORT));
