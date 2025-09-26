// src/controllers/messageController.js
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

let ioInstance; // will hold Socket.IO instance

exports.initMessageController = (io) => {
  ioInstance = io;
};

// POST /messages → send message
// src/controllers/messageController.js
exports.sendMessage = async (req, res, next) => {
  try {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 🔹 1. Check if conversation exists between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    // 🔹 2. If no conversation, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        lastMessage: content,
      });
    } else {
      // Update last message if exists
      conversation.lastMessage = content;
      await conversation.save();
    }

    // 🔹 3. Save the message
    const message = await Message.create({
      conversationId: conversation._id,
      sender,
      receiver,
      content,
    });

    // 🔹 4. Emit real-time message to room
    if (ioInstance) {
      ioInstance.to(conversation._id.toString()).emit("receive_message", message);
    }

    res.status(201).json({ conversation, message });
  } catch (err) {
    next(err);
  }
};

// GET /messages/:conversationId → fetch all messages
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};
