const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
// const messageRoutes = require("./routes/messageRoutes");

// Import error handler


const app = express();

// ---- Middleware ----
app.use(helmet()); // Security headers
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001"
    ].filter(Boolean); // Remove undefined values
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ---- Routes ----
app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// ---- Health Check ----
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ---- Error Handling ----
app.use(errorHandler);

module.exports = app;
