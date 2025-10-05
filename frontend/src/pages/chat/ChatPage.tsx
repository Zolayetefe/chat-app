import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConversationList from "./ConversationList";
import type { Conversation } from "../../types/chat";
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../../hooks/useSocket";
import { apiFetch } from "../../api/api";
function ChatPage() {
  const { user, isLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState(true);

  // Fetch conversations using apiFetch
  const fetchConversations = useCallback(async (userId: string) => {
    setIsConversationsLoading(true);
    try {
      const data = await apiFetch<Conversation[]>(`/conversations/${userId}`, { method: "GET" });
      // Safety check: ensure the data is an array
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        console.warn("API returned non-array data for conversations.");
        setConversations([]);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
      setConversations([]); // Ensure conversations state remains an array
    } finally {
      setIsConversationsLoading(false);
    }
  }, []);

  // Initialize socket using custom hook
  const socket = useSocket(user?.id, conversations, setConversations);

  useEffect(() => {
    console.log("user id", user?.id);
    if (user?.id) {
      fetchConversations(user.id);
    }
  }, [user?.id, fetchConversations]);

  if (isLoading || isConversationsLoading) {
    console.log("isLoading", isLoading);
    console.log("isConversationsLoading", isConversationsLoading);
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading... from chat page</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Unauthorized</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Conversation List Sidebar */}
      <div className="w-full md:w-80 border-r border-gray-200 flex-shrink-0 hidden md:block overflow-y-auto">
        <ConversationList
          conversations={conversations}
          currentUserId={user.id}
          socket={socket}
          setConversations={setConversations}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        <Outlet context={{ conversations, currentUser: user.username, currentUserId: user.id, socket }} />
      </div>
    </div>
  );
}

export default ChatPage;