const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ username, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set refresh token in httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
   user:{
    name:user.name,
    username:user.username
   },
   accessToken
  });
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;
console.log("from login controller")
  const user = await User.findOne({ username });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
   user:{
    id:user._id,
    name:user.name,
    username:user.username
   },
   accessToken
  });
};

// Logout User
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

// Refresh Access Token
const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    res.json({ accessToken });
  } catch (error) {
    res.status(403);
    throw new Error("Invalid or expired refresh token");
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error(error.message)
  }
};

module.exports = { registerUser, loginUser, logoutUser, refreshToken, getMe};
