import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import type { Message, Conversation } from "../types/chat";
import type { Socket } from "socket.io-client";

export function useChatMessages(
  activeConversation: Conversation | undefined,
  currentUserId: string,
  socket: Socket
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const navigate = useNavigate();

  // Fetch message history
  const fetchMessages = useCallback(async () => {
    if (!activeConversation || activeConversation.id.startsWith("temp-")) {
      setMessages([]);
      return;
    }

    setIsFetchingMessages(true);
    try {
      const response = await apiFetch<Message[]>(`/messages/${activeConversation.id}`, { method: "GET" });
      const formattedMessages: Message[] = response.map((msg: any) => ({
        ...msg,
        id: msg._id,
        isMine: msg.sender === currentUserId,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
      setMessages([]);
    } finally {
      setIsFetchingMessages(false);
    }
  }, [activeConversation, currentUserId]);

  // Handle sending messages
  const handleSendMessage = useCallback(
    (messageText: string) => {
      if (!messageText.trim() || !currentUserId || !activeConversation || !activeConversation.otherUserId) return;

      const messageData = {
        sender: currentUserId,
        receiver: activeConversation.otherUserId,
        content: messageText.trim(),
        roomId: activeConversation.id.startsWith("temp-") ? null : activeConversation.id,
      };
     console.log("mwssage data",messageData)
      socket.emit("send_message", messageData);
    },
    [activeConversation, currentUserId, socket]
  );

  // Socket listeners for messages and conversation updates
  useEffect(() => {
    if (!activeConversation) return;

    // Join the room
    if (!activeConversation.id.startsWith("temp-")) {
      socket.emit("join_room", activeConversation.id);
    }

    // Handle incoming messages
    const handleReceiveMessage = (message: any) => {
      if (message.conversationId === activeConversation.id) {
        const formattedMsg: Message = {
          ...message,
          id: message._id,
          isMine: message.sender === currentUserId,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, formattedMsg]);
      }
    };

    // Handle temporary conversation ID replacement
    const handleMessageSent = ({ conversation, message }: { conversation: any; message: any }) => {
      if (activeConversation.id.startsWith("temp-")) {
        navigate(`/chat/${conversation._id}`, { replace: true });
        const formattedMsg: Message = {
          ...message,
          id: message._id,
          isMine: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([formattedMsg]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);

    // Cleanup
    return () => {
      if (!activeConversation.id.startsWith("temp-")) {
        socket.emit("leave_room", activeConversation.id);
      }
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
    };
  }, [activeConversation, currentUserId, socket, navigate]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, setMessages, isFetchingMessages, handleSendMessage };
}