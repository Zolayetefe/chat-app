const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes =  require("./routes/conversationRoutes")
const userRoutes =  require("./routes/userRoutes")


// Import error handler


const app = express();

// ---- Middleware ----
app.use(helmet()); // Security headers
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
       "http://localhost:5000",
      "http://localhost:3001",
       "http://localhost:5173",
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
// ---- Routes ----
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/conversations",conversationRoutes);
app.use("/api/v1/users", userRoutes);

// ---- Health Check ----
app.get("/", (req, res) => {
  res.send("API is running...");
});



// ---- Error Handling ----
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

module.exports = app;
