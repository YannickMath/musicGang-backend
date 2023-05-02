const express = require("express");
const router = express.Router();
const Message = require("../models/messages");
const User = require("../models/users");
const Conversation = require("../models/conversations");
const { createConversationIfNotExists } = require("../modules/conversation");

router.get("/getMessage", async (req, res) => {
    const { userId } = req.body;
    try {
      const conversations = await Conversation.find({ participants: userId })
        .populate({ path: 'participants', select: 'uniqueId' })
        .populate({ path: 'messages', select: 'content sender receiver createdAt' })
        .exec();
      res.status(200).json(conversations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving conversations" });
    }
  });
  
router.post("/postMessage", async (req, res) => {
  const { content, sender, receiver } = req.body;

  try {
    // Find the sender and receiver in the database
    const senderUser = await User.findOne({ uniqueId: sender });
    const receiverUser = await User.findOne({ uniqueId: receiver });

    // If sender or receiver not found, return an error
    if (!senderUser || !receiverUser) {
      return res.status(400).json({ message: "Invalid sender or receiver" });
    }

    const newMessage = new Message({
      content,
      sender,
      receiver,
    });

    console.log("receiver", newMessage);
    const savedMessage = await newMessage.save();

    // Call the function to create conversation if it does not exist
    createConversationIfNotExists(newMessage);

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error posting message" });
  }
});

module.exports = router;
