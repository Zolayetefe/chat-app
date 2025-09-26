// src/controllers/messageController.js
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

let ioInstance; // will hold Socket.IO instance

exports.initMessageController = (io) => {
  ioInstance = io;
};

// POST /messages → send message
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, sender, receiver, content } = req.body;

    if (!conversationId || !sender || !receiver || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save message
    const message = await Message.create({
      conversationId,
      sender,
      receiver,
      content,
    });

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
    });

    // Emit to room (conversationId)
    if (ioInstance) {
      ioInstance.to(conversationId).emit("receive_message", message);
    }

    res.status(201).json(message);
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
