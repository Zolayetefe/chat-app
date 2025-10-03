// src/controllers/messageController.js
const Message = require("../models/Message");

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
