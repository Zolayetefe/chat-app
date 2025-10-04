require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const chatSocket = require("./sockets/chatSocket");


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

// Pass `io` to sockets + controllers
chatSocket(io);


// ---- Start server ----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
