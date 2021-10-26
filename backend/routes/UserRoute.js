const router = require("express").Router();

const UserController = require("../controllers/UserController");
const { protect, AdminMiddleware } = require("../middlewares/AuthMIddleware");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/", protect, AdminMiddleware, UserController.getAllUsers);

router.get("/sidebar", protect, UserController.getAllUsersProfilePic);

router.get("/profile", protect, UserController.profile);
router.put("/profile", protect, UserController.updateUserProfile);
router.delete("/profile", protect, UserController.deleteUser);
router.get("/:id/profile", protect, UserController.anyUserProfile);

router.get("/:id/followers", protect, UserController.getFollowers);

router.get("/friends", protect, UserController.getUserFriends);

router.get("/follow/:id", protect, UserController.follow);
router.get("/unfollow/:id", protect, UserController.unfollow);

router.get("/:id", protect, UserController.getSingleUser);

module.exports = router;
