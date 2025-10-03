const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // Join a conversation room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // ✅ Send message via WebSocket (replaces controller HTTP route)
    socket.on("send_message", async ({ sender, receiver, content }) => {
      try {
        if (!sender || !receiver || !content) {
          socket.emit("error_message", { error: "All fields are required" });
          return;
        }

        // 1. Find existing conversation or create new
        let conversation = await Conversation.findOne({
          participants: { $all: [sender, receiver] },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [sender, receiver],
            lastMessage: content,
          });
        } else {
          conversation.lastMessage = content;
          await conversation.save();
        }

        // 2. Save the message
        const message = await Message.create({
          conversationId: conversation._id,
          sender,
          receiver,
          content,
        });

        // 3. Emit message to room
        io.to(conversation._id.toString()).emit("receive_message", message);

        // Optionally: acknowledge sender
        socket.emit("message_sent", { conversation, message });
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error_message", { error: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("typing", data);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
};
