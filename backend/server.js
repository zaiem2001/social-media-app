require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");

const { notFound, errorHandler } = require("./middlewares/ErrorMiddleware");
const UserRoute = require("./routes/UserRoute");
const PostRoute = require("./routes/PostRoute");

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

app.get("/", (req, res) => {
  res.send("hello world...");
});

app.use("/api/users", UserRoute);
app.use("/api/posts", PostRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
