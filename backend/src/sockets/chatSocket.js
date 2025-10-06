const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

module.exports = (io) => {
  const connectedUsers = new Map(); // Track user online status

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // Join user room and mark user as online
    socket.on("join_user_room", (userId) => {
      socket.join(userId);
      connectedUsers.set(userId, { socketId: socket.id, lastSeen: null });
      console.log(`User ${socket.id} joined user room ${userId}`);
      // Notify others in user rooms of online status
      io.to(userId).emit("user_status", { userId, isOnline: true });
    });

    // Join a conversation room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Send message via WebSocket
    socket.on("send_message", async ({ sender, receiver, content, roomId }) => {
      console.log("send message hit");
      try {
        if (!sender || !receiver || !content) {
          socket.emit("error_message", { error: "All fields are required" });
          return;
        }
        // 1. Find existing conversation or create new
        let conversation;

        if (roomId && !roomId.startsWith('temp-')) {
          conversation = await Conversation.findById(roomId);
        } 

        if (!conversation) {
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
        
        // Populate conversation participants
        conversation = await Conversation.findById(conversation._id).populate("participants", "username email");

        // Join new room if created
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

        // Populate message sender and receiver
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "username email")
          .populate("receiver", "username email");

        // 3. Emit message to room
        io.to(conversation._id.toString()).emit("receive_message", { message: populatedMessage, conversation });

        // If new conversation, also emit to receiver's user room
        if (!roomId || roomId.startsWith('temp-')) {
          io.to(receiver).emit("receive_message", { message: populatedMessage, conversation });
        }

        // Acknowledge sender
        socket.emit("message_sent", { conversation, message: populatedMessage });
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error_message", { error: "Failed to send message" });
      }
    });

    // Typing indicator
    socket.on("typing", ({ roomId, userId, isTyping }) => {
      socket.to(roomId).emit("typing", { userId, isTyping });
    });

    // Add a 'leave_room' handler for cleanup
    socket.on("leave_room", (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on("disconnect", async () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
      // Update last seen for disconnected user
      for (let [userId, info] of connectedUsers.entries()) {
        if (info.socketId === socket.id) {
          connectedUsers.set(userId, { socketId: null, lastSeen: new Date() });
          io.to(userId).emit("user_status", { userId, isOnline: false, lastSeen: new Date() });
          // Update user lastSeen in database (assuming User model exists)
          try {
            const User = require("../models/User");
            await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
          } catch (err) {
            console.error("Error updating lastSeen:", err);
          }
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};