const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/search", protect, searchUsers);

module.exports = router;
