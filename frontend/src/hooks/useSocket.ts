import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { io, type Socket } from "socket.io-client";
import type { Conversation } from "../types/chat";

// Initialize socket outside component to avoid multiple connections
const socket: Socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

export function useSocket(
  userId: string | undefined,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
) {
  const navigate = useNavigate();

  const handleReceiveMessage = useCallback(
    (data: { message: any; conversation: any }) => {
      const { message, conversation } = data;
      setConversations((prev) => {
        let updatedConv = [...prev];
        const convIndex = updatedConv.findIndex((conv) => conv.id === message.conversationId);

        if (convIndex === -1) {
          // Add new conversation if not found
          const otherParticipant = conversation.participants.find((p: any) => p._id !== userId);
          const newConv: Conversation = {
            id: conversation._id,
            type: conversation.participants.length > 2 ? "group" : "individual",
            name: otherParticipant ? otherParticipant.username : "Group Chat",
            lastMessage: message.content,
            timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            otherUserId: otherParticipant ? otherParticipant._id : undefined,
            participants: conversation.participants.map((p: any) => p._id),
          };
          updatedConv = [newConv, ...updatedConv];
          // Join the new room
          socket.emit("join_room", conversation._id);
        } else {
          // Update existing conversation
          updatedConv[convIndex] = {
            ...updatedConv[convIndex],
            lastMessage: message.content,
            timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }

        return updatedConv.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    },
    [setConversations, userId]
  );

  const handleMessageSent = useCallback(
    ({ conversation, message }: { conversation: any; message: any }) => {
      setConversations((prev) => {
        const tempConvIndex = prev.findIndex((conv) => conv.id.startsWith("temp-"));
        if (tempConvIndex !== -1) {
          const otherParticipant = conversation.participants.find((p: any) => p._id !== userId);
          const newConv: Conversation = {
            id: conversation._id,
            type: conversation.participants.length > 2 ? "group" : "individual",
            name: otherParticipant ? otherParticipant.username : "Group Chat",
            lastMessage: message.content,
            timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            otherUserId: otherParticipant ? otherParticipant._id : undefined,
            participants: conversation.participants.map((p: any) => p._id),
          };
          const updatedConversations = [...prev];
          updatedConversations[tempConvIndex] = newConv;
          // Navigate to the new conversation ID
          navigate(`/chat/${conversation._id}`);
          return updatedConversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        return prev;
      });
    },
    [userId, setConversations, navigate]
  );

  useEffect(() => {
    if (!userId) return;

    // Connect socket and set up events
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
      // Join user room
      socket.emit("join_user_room", userId);
      // Join rooms for existing conversations
      conversations.forEach((conv) => {
        if (!conv.id.startsWith("temp-")) {
          socket.emit("join_room", conv.id);
        }
      });
    });

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);

    // Cleanup on unmount or user change
    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("message_sent");
      socket.disconnect();
    };
  }, [userId, conversations, handleReceiveMessage, handleMessageSent, navigate]);

  return socket;
}