require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const path = require("path");

const { notFound, errorHandler } = require("./middlewares/ErrorMiddleware");
const UserRoute = require("./routes/UserRoute");
const PostRoute = require("./routes/PostRoute");
const ConversationRoute = require("./routes/ConversationRoute");
const MessageRoute = require("./routes/MessageRoute");

const MONGO_URL = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully...");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
// app.use(cors);

app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);
app.use("/api/conversations", ConversationRoute);
app.use("/api/messages", MessageRoute);

// console.log(path.join(__dirname, "../client/build"));

if (process.env.environment === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
