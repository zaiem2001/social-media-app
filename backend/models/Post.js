const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    profile: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      default: "",
    },
    profilePic: {
      type: String,
      required: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      max: 200,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [commentsSchema],
    numComments: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
