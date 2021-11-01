const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const { protect } = require("../middlewares/AuthMIddleware");
const Message = require("../models/Message");

//new message
router.post(
  "/",
  protect,
  expressAsyncHandler(async (req, res) => {
    const { conversationId, sender, text } = req.body;

    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });

    const savedMsg = await newMessage.save();

    res.status(200).json(savedMsg);
  })
);

//get msgg

router.get(
  "/:id",
  protect,
  expressAsyncHandler(async (req, res) => {
    const msg = await Message.find({ conversationId: req.params.id });
    res.status(200).json(msg);
  })
);

router.delete(
  "/:id",
  protect,
  expressAsyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(400);
      throw new Error("No message found...");
    }

    if (message.sender === req.user._id.toString()) {
      const deletedMsg = await message.delete();
      res.status(200).json({ msg: "message deleted..." });
    } else {
      res.status(401);
      throw new Error("You can delete only your messages.");
    }
  })
);

module.exports = router;
