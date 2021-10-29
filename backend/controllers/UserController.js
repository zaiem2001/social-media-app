const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/User");
const Post = require("../models/Post");
const generateToken = require("../utils/generateToken");

const verifyEmail = (email) => {
  const re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,5}$/g;

  return re.test(email);
};

const UserController = {
  //  POST api/users/register
  //  register a user

  register: expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username.trim() || !email.trim() || !password.trim()) {
      res.status(400);
      throw new Error("Please Fill The Required Fields.");
    }

    const verifyUserEmail = verifyEmail(email);

    if (password.length < 8) {
      res.status(400);
      throw new Error("Password must be 8 characters long.");
    }

    if (!verifyUserEmail) {
      res.status(400);
      throw new Error("Invalid Email.");
    }

    const userExists = await User.findOne({ username });
    const emailExists = await User.findOne({ email });

    if (userExists || emailExists) {
      res.status(400);
      throw new Error("User Already Exists Try Again.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const { password: userPassword, ...rest } = savedUser._doc;

    res.status(200).json({
      msg: "user registered successfully",
      ...rest,
      token: generateToken(user._id),
    });
  }),

  //  POST api/users/login
  //  login a user

  login: expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username.trim() || !password.trim()) {
      res.status(400);
      throw new Error("Please Fill The Required Fields.");
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(400);
      throw new Error("Invalid Username or Password.");
    }

    const verifyUser = await bcrypt.compare(password, user.password);

    if (!verifyUser) {
      res.status(401);
      throw new Error("Invalid Username or Password.");
    }

    const { password: pwd, ...rest } = user._doc;

    res.status(200).json({
      msg: "Login success",
      token: generateToken(user._id),
      ...rest,
    });
  }),

  // GET /api/users/profile
  // get user profile (logged in)

  profile: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("No User Found.");
    }

    res.status(200).json(user);
  }),

  // GET /api/users/user
  // get any user profile (logged in)

  anyUserProfile: expressAsyncHandler(async (req, res) => {
    const userId = req.query.userId || "";
    const username = req.query.username || "";

    const user = userId
      ? await User.findById(userId).select("-password")
      : await User.findOne({ username }).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("Invalid Request.");
    }

    res.status(200).json(user._id);
  }),

  // GET /api/users/:id
  // get user by id (logged in)

  getSingleUser: expressAsyncHandler(async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);

    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("Invalid Request.");
    }

    res.status(200).json(user);
  }),

  // --> GET /api/users/
  // --> Get all Users only Admins.

  getAllUsers: expressAsyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");

    if (!users) {
      res.status(400);
      throw new Error("No users found in the database.");
    }

    res.status(200).json(users);
  }),

  // --> GET /api/users/sidebar
  // --> Get all User's profile pic and username.

  getAllUsersProfilePic: expressAsyncHandler(async (req, res) => {
    const users = await User.find({}).select("profilePicture username");

    if (!users) {
      res.status(400);
      throw new Error("No users found in the database.");
    }

    res.status(200).json(users);
  }),

  // --> GET /api/users/friends?userId=""
  // --> Get user friends

  getUserFriends: expressAsyncHandler(async (req, res) => {
    const userId = req.query.userId || null;

    const user = userId
      ? await User.findById(userId)
      : await User.findById(req.user._id);

    const followings = await Promise.all(
      user.followings.map((f) => {
        return User.findById(f).select("-password");
      })
    );

    if (!followings || followings?.length === 0) {
      res.status(400);
      throw new Error("You dont follow anyone.");
    }

    res.status(200).json(followings);
  }),

  // --> PUT /api/users/profile
  // --> update a user profile logged in and admin

  updateUserProfile: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const oldPassword = user.password;

    if (user) {
      const lastUserUpdated = new Date(user.updatedAt).getUTCDate();
      const currentDate = new Date().getUTCDate();

      const accUpdated = new Date(user.updatedAt).toString();
      const accCreated = new Date(user.createdAt).toString();

      // console.log(lastUserUpdated + " " + currentDate);
      // console.log(lastUserUpdated === currentDate);

      // console.log({ boo: accUpdated === accCreated, accCreated, accUpdated });

      if (lastUserUpdated === currentDate && !(accUpdated === accCreated)) {
        res.status(404);
        throw new Error("You can update your profile Tomorrow");
      } else {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        user.coverPicture = req.body.coverPicture || user.coverPicture;
        user.desc = req.body.desc || user.desc;
        user.state = req.body.state || user.state;
        user.city = req.body.city || user.city;
        user.relationship = Number(req.body.relationship) || user.relationship;

        const userOldPassword = req.body.oldPassword;
        const userNewPassword = req.body.newPassword;

        if (userNewPassword && !userOldPassword) {
          res.status(404);
          throw new Error("Enter your Old Password");
        }

        if (userOldPassword) {
          if (!userNewPassword) {
            res.status(404);
            throw new Error("Enter new Password.");
          }

          const verifyPassword = await bcrypt.compare(
            userOldPassword,
            oldPassword
          );

          if (!verifyPassword) {
            res.status(404);
            throw new Error("Old password is Wrong...");
          }

          if (userOldPassword === userNewPassword) {
            res.status(404);
            throw new Error("New password cannot be same as old password.");
          }

          const hashedPassword = await bcrypt.hash(userNewPassword, 10);

          user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        const { password: uPwd, ...other } = updatedUser._doc;

        res.status(200).json({
          msg: "user updated successfully",
          token: generateToken(user._id),
          ...other,
        });
      }
    } else {
      res.status(400);
      throw new Error("Something Went Wrong, Try Again.");
    }
  }),

  //  DELETE /api/users/profile
  // User can delete his account.

  deleteUser: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      const friends = await Promise.all(
        user.followers.map((f) => {
          return User.findById(f).select("-password");
        })
      );

      // console.log(friends);

      await Promise.all(
        friends.map((f) => {
          f.followings = f.followings.filter(
            (f) => f.toString() !== user._id.toString()
          );

          f.save();
        })
      );

      await Promise.all(
        friends.map((f) => {
          f.followers = f.followers.filter(
            (f) => f.toString() !== user._id.toString()
          );

          f.save();
        })
      );

      // console.log(res);

      await Post.deleteMany({ user: user._id });

      const deletedUser = await User.findByIdAndDelete(user._id);

      res.status(200).json({
        msg: "user deleted successfully",
        username: deletedUser.username,
        email: deletedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("Something Went Wrong.");
    }
  }),

  // GET /api/users/follow/:id
  // User can follow others (logged in user)

  follow: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const followRequestUser = await User.findById(req.params.id);

    if (user._id.toString() === followRequestUser._id.toString()) {
      res.status(404);
      throw new Error("You cannot follow yourself.");
    }

    const userFollowings = user.followings.includes(
      followRequestUser._id.toString()
    );
    const opponentFollowers = followRequestUser.followers.includes(
      user._id.toString()
    );

    if (userFollowings || opponentFollowers) {
      res.status(404);
      throw new Error("You Are Already Following The User.");
    }

    user.followings.push(followRequestUser._id.toString());
    followRequestUser.followers.push(user._id.toString());

    const savedUser = await user.save();
    const opponentSave = await followRequestUser.save();

    res.status(200).json({
      msg: `You Followed ${followRequestUser.username}`,
      userFollowings: user.followings,
      opponentFollowers: followRequestUser.followers,
    });
  }),

  // GET /api/users/:id/followers
  // get user followers(logged in user)

  getFollowers: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User does not exists.");
    }

    const followers = await Promise.all(
      user.followers.map((f) => {
        return User.findById(f).select("username profilePicture");
      })
    );

    res.status(200).json(followers);
  }),

  // GET /api/users/unfollow/:id
  // User can unfollow others whom they are already following (logged in user.)

  unfollow: expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const requestUnfollowUser = await User.findById(req.params.id);

    if (user._id.toString() === requestUnfollowUser._id.toString()) {
      res.status(404);
      throw new Error("You cannot un-follow yourself.");
    }

    const alreadyFollowing = user.followings.includes(
      requestUnfollowUser._id.toString()
    );

    const opponentFollowers = requestUnfollowUser.followers.includes(
      user._id.toString()
    );

    if (!alreadyFollowing || !opponentFollowers) {
      res.status(404);
      throw new Error("You need to follow the user.");
    }

    const filteredUser = user.followings.filter(
      (f) => f !== requestUnfollowUser._id.toString()
    );

    const opponentFilter = requestUnfollowUser.followers.filter(
      (f) => f !== user._id.toString()
    );

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { followings: filteredUser },
      { new: true }
    );

    const updatedOpponent = await User.findByIdAndUpdate(
      requestUnfollowUser._id,
      { followers: opponentFilter },
      { new: true }
    );

    res.status(200).json({
      msg: `You unfollowed ${requestUnfollowUser.username}`,
      followings: updatedUser.followings,
      opponentFollowers: updatedOpponent.followers,
    });
  }),
};

module.exports = UserController;
