const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

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
