const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getMe
} = require("../controllers/authController");
const { protect} = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);
router.get("/me",protect,getMe)

module.exports = router;
