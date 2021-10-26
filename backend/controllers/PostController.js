const expressAsyncHandler = require("express-async-handler");

const Post = require("../models/Post");
const User = require("../models/User");

const PostController = {
  //  POST /api/posts
  // Create a new Post

  createPost: expressAsyncHandler(async (req, res) => {
    const { image, desc } = req.body;

    if (!desc) {
      res.status(404);
      throw new Error("Please Enter a description.");
    }

    const post = new Post({
      user: req.user._id,
      username: req.user.username,
      image: image || "",
      desc,
      numComments: 0,
      profilePic: req.user.profilePicture || "/assets/person/noAvatar.png",
    });

    const savedPost = await post.save();

    res.status(201).json(savedPost);
  }),

  // PUT /api/posts/:id
  // update your post (logged in and only your post can be updated.)

  updatePost: expressAsyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("No Posts found.");
    }

    if (post.user.toString() === req.user._id.toString()) {
      post.image = req.body.image || post.image;
      post.desc = req.body.desc || post.desc;

      const updatedPost = await post.save();

      res.status(200).json({
        msg: "post updated successfully",
        ...updatedPost._doc,
      });
    } else {
      res.status(401);
      throw new Error("You can update only your post.");
    }
  }),

  // DELETE /api/posts/:id
  // delete your post (logged in and only your post can be deleted.)

  deletePost: expressAsyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("No Posts found.");
    }

    if (post.user.toString() === req.user._id.toString()) {
      const deletedPost = await post.delete();

      res.status(200).json({
        msg: "success",
        ...deletedPost._doc,
      });
    } else {
      res.status(401);
      throw new Error("You can delete only your post.");
    }
  }),

  // PUT /api/posts/:id/like
  // like and dislike a post.

  likePost: expressAsyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("No post found.");
    }

    if (post.likes.includes(req.user._id.toString())) {
      await post.updateOne({ $pull: { likes: req.user._id.toString() } });

      res.status(200).json({
        msg: "post disliked successfully.",
      });
    } else {
      await post.updateOne({ $push: { likes: req.user._id.toString() } });

      res.status(200).json({
        msg: "post liked successfully.",
      });
    }
  }),

  // GET /api/posts?id=id
  // get logged in user's posts

  getUserPosts: expressAsyncHandler(async (req, res) => {
    const userId = req.query.id || null;

    const posts = userId
      ? await Post.find({ user: userId })
      : await Post.find({ user: req.user._id });

    if (!posts) {
      res.status(404);
      throw new Error("You dont have any posts.");
    }

    res.status(200).json(posts);
  }),

  // GET /api/posts/all
  // get all posts only admins.

  getAllPosts: expressAsyncHandler(async (req, res) => {
    const posts = await Post.find({});

    if (!posts) {
      res.status(404);
      throw new Error("no posts.");
    }

    res.status(200).json(posts);
  }),

  // GET /api/posts/timeline
  // get friends posts

  getFriendsPosts: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    const friendsPosts = await Promise.all(
      user.followings.map((f) => {
        return Post.find({ user: f });
      })
    );

    // console.log(friendsPosts.flat());
    res.status(200).json(friendsPosts.flat());
  }),

  // POST /api/posts/:id/comment
  // comment on a post

  commentOnPost: expressAsyncHandler(async (req, res) => {
    const { comment } = req.body;

    // console.log(comment);

    if (!comment) {
      res.status(400);
      throw new Error("Enter a Comment.");
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("No post found");
    }

    const totalComments = post.comments?.filter(
      (comment) => comment.user.toString() === req.user._id.toString()
    );

    if (totalComments && totalComments.length > 2) {
      res.status(400);
      throw new Error("You cannot comment more than thrice.");
    }

    const userComment = {
      name: req.user.username,
      comment,
      user: req.user._id,
      profile: req.user.profilePicture || "/assets/person/noAvatar.png",
    };

    post.comments.push(userComment);

    post.numComments = post.comments?.length;

    await post.save();

    res.status(200).json({ msg: "Commented Successfully." });
  }),

  // GET /api/posts/:id/comment
  // get all comments of a post

  getComments: expressAsyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("No post found.");
    }

    const comments = post.comments;

    res.status(200).json(comments);
  }),

  // DELETE /api/posts/:postId/comment/:commendId/delete
  // delete your comment

  deleteComment: expressAsyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      res.status(404);
      throw new Error("No posts found.");
    }

    if (post.user.toString() === req.user._id.toString()) {
      post.comments = await post.comments.filter(
        (c) => c._id.toString() !== req.params.commentId.toString()
      );
      post.numComments = post.comments.length;

      await post.save();

      res.json({ msg: "Comment deleted successfully" });
    } else {
      const myComments = await post.comments.filter(
        (comment) => comment.user.toString() === req.user._id.toString()
      );

      if (!myComments) {
        res.status(400);
        throw new Error("You dont have any comments.");
      }

      const comment = await myComments.find(
        (c) => c._id.toString() === req.params.commentId.toString()
      );

      if (!comment) {
        res.status(400);
        throw new Error("you can delete only your comments.");
      }

      if (comment.user.toString() === req.user._id.toString()) {
        post.comments = await post.comments.filter(
          (c) => c._id.toString() !== comment._id.toString()
        );

        post.numComments = post.comments.length;

        await post.save();

        res.json({ msg: "Comment deleted successfully" });
      } else {
        res.status(401);
        throw new Error("You can only delete your comments.");
      }
    }
  }),
};

module.exports = PostController;
