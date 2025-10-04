const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/:conversationId", protect, getMessages);

module.exports = router;
