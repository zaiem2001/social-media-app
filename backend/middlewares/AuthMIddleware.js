const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = expressAsyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  let token;

  if (header && header.startsWith("Bearer")) {
    try {
      token = header.split(" ")[1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid Token / Not Authorized.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Invalid Request / Not Authorized.");
  }
});

const AdminMiddleware = expressAsyncHandler((req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Invalid Request / Not Authorized as ADMIN.");
  }
});

module.exports = { protect, AdminMiddleware };
