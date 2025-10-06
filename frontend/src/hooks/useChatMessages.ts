import { useState, useEffect, useCallback } from "react";
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
  const [isTyping, setIsTyping] = useState<{ userId: string; username: string } | null>(null);
  let typingTimeout: number | null = null;

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
        id: msg._id,
        conversationId: msg.conversationId,
        sender: msg.sender._id,
        receiver: msg.receiver._id,
        content: msg.content,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
        isMine: msg.sender._id === currentUserId,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        senderUsername: msg.sender.username,
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
      socket.emit("send_message", messageData);
      // Stop typing when sending a message
      socket.emit("typing", { roomId: activeConversation.id, userId: currentUserId, isTyping: false });
    },
    [activeConversation, currentUserId, socket]
  );

  // Handle typing events
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!activeConversation || activeConversation.id.startsWith("temp-")) return;
      socket.emit("typing", { roomId: activeConversation.id, userId: currentUserId, isTyping });
    },
    [activeConversation, currentUserId, socket]
  );

  // Socket listeners for messages and typing
  useEffect(() => {
    if (!activeConversation) return;

    // Join the room
    if (!activeConversation.id.startsWith("temp-")) {
      socket.emit("join_room", activeConversation.id);
    }

    // Handle incoming messages
    const handleReceiveMessage = (data: { message: any; conversation: any }) => {
      const { message } = data;
      if (message.conversationId === activeConversation.id) {
        const formattedMsg: Message = {
          id: message._id,
          conversationId: message.conversationId,
          sender: message.sender._id,
          receiver: message.receiver._id,
          content: message.content,
          isRead: message.isRead,
          // createdAt: message.createdAt,
          isMine: message.sender._id === currentUserId,
          createdAt: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          senderUsername: message.sender.username,
        };
        setMessages((prev) => [...prev, formattedMsg]);
      }
    };

    // Handle typing events
    const handleTypingEvent = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
      if (userId !== currentUserId && activeConversation?.otherUserId === userId) {
        if (isTyping) {
          setIsTyping({ userId, username: activeConversation.name });
          if (typingTimeout) clearTimeout(typingTimeout);
          typingTimeout = setTimeout(() => setIsTyping(null), 3000); // Clear after 3 seconds
        } else {
          setIsTyping(null);
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTypingEvent);

    // Cleanup
    return () => {
      if (!activeConversation.id.startsWith("temp-")) {
        socket.emit("leave_room", activeConversation.id);
      }
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTypingEvent);
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [activeConversation, currentUserId, socket]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, setMessages, isFetchingMessages, handleSendMessage, handleTyping, isTyping };
}