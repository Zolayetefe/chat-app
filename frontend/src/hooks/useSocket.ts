import { useEffect, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import type { Conversation } from "../types/chat";

// Initialize socket outside component to avoid multiple connections
const socket: Socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5173");

export function useSocket(
  userId: string | undefined,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
) {
  const handleReceiveMessage = useCallback(
    (message: { conversationId: string; content: string }) => {
      setConversations((prev) => {
        const updatedConv = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            return {
              ...conv,
              lastMessage: message.content,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
          }
          return conv;
        });
        return updatedConv.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    },
    [setConversations]
  );

  useEffect(() => {
    if (!userId) return;

    // Connect socket and set up events
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
      // Join rooms for existing conversations
      conversations.forEach((conv) => {
        socket.emit("join_room", conv.id);
      });
    });

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup on unmount or user change
    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [userId, conversations, handleReceiveMessage]);

  return socket;
}