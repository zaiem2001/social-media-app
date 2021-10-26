const router = require("express").Router();

const PostController = require("../controllers/PostController");
const { protect, AdminMiddleware } = require("../middlewares/AuthMIddleware");

router.post("/", protect, PostController.createPost);
router.get("/", protect, PostController.getUserPosts);

router.get("/all", protect, AdminMiddleware, PostController.getAllPosts);

router.get("/timeline", protect, PostController.getFriendsPosts);

router.delete(
  "/:postId/comment/:commentId/delete",
  protect,
  PostController.deleteComment
);

router.get("/:id/comment", protect, PostController.getComments);
router.post("/:id/comment", protect, PostController.commentOnPost);

router.put("/:id/like", protect, PostController.likePost);

router.put("/:id", protect, PostController.updatePost);

router.delete("/:id", protect, PostController.deletePost);

module.exports = router;
