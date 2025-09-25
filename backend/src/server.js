require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

// ---- Connect to MongoDB ----
connectDB();

// ---- Create HTTP server ----
const server = http.createServer(app);

// ---- Initialize Socket.IO ----
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Join a conversation room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    // data: { sender, receiver, content, roomId }
    io.to(data.roomId).emit("receive_message", data);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("typing", data);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// ---- Start server ----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
