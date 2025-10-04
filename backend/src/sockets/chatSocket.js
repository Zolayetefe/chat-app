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

  // ...
// ✅ Send message via WebSocket (replaces controller HTTP route)
socket.on("send_message", async ({ sender, receiver, content, roomId }) => { // <--- Added roomId
  try {
    if (!sender || !receiver || !content) {
      socket.emit("error_message", { error: "All fields are required" });
      return;
    }

    // 1. Find existing conversation or create new
    let conversation;

    if (roomId && !roomId.startsWith('temp-')) { // Use existing room if provided and not temporary
        conversation = await Conversation.findById(roomId);
    } 

    if (!conversation) {
      // If no room or failed lookup, find by participants or create new
      conversation = await Conversation.findOne({
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
    } else {
      conversation.lastMessage = content;
      await conversation.save();
    }
    
    // IMPORTANT: If this was a new conversation, the sender needs to join the new room now
    if (conversation._id.toString() !== roomId) {
        socket.join(conversation._id.toString());
        console.log(`User ${socket.id} joined newly created room ${conversation._id.toString()}`);
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

    // Optionally: acknowledge sender and send the created conversation object
    socket.emit("message_sent", { conversation, message });
  } catch (err) {
    console.error("Error sending message:", err);
    socket.emit("error_message", { error: "Failed to send message" });
  }
});

// Add a 'leave_room' handler for cleanup
socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
});
// ...
    // Typing indicator
    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("typing", data);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
};
