const express = require("express");
const router = express.Router();
const { searchUsers,getUserStatus } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/search", protect, searchUsers);
router.get("/:userId/status", protect, getUserStatus);

module.exports = router;
