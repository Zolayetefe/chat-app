const express = require("express");
const router = express.Router();
const { getUserConversations } = require("../controllers/conversationController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/:userId", protect, getUserConversations);

module.exports = router