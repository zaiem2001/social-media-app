const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const { protect } = require("../middlewares/AuthMIddleware");

//get a conversation
router.get(
  "/conversation/:id",
  protect,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id.toString();

    const convo = await Conversation.find({
      members: { $in: [id] },
    });

    if (!convo) {
      res.status(400);
      throw new Error("No conversations found.");
    } else {
      res.status(200).json(convo);
    }
  })
);

// new conversation
router.get(
  "/:id",
  protect,
  expressAsyncHandler(async (req, res) => {
    if (req.user._id.toString() === req.params.id.toString()) {
      throw new Error("Invalid request");
    }

    const alreadyExists = await Conversation.findOne({
      members: { $all: [req.user._id.toString(), req.params.id] },
      // members: [req.user._id.toString(), req.params.id],
    });

    if (alreadyExists) {
      res.status(200).json(alreadyExists);
    } else {
      const newConversation = new Conversation({
        members: [req.user._id.toString(), req.params.id],
      });

      const savedConv = await newConversation.save();
      res.status(200).json(savedConv);
    }
  })
);

module.exports = router;
