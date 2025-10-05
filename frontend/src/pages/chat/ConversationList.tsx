import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiUsers, FiMessageSquare } from "react-icons/fi";
import type { Conversation, SearchUser } from "../../types/chat";
import { useUserSearch } from "../../hooks/useUserSearch";
import { type Socket } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  socket: Socket;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

function ConversationList({ conversations, currentUserId, socket, setConversations }: ConversationListProps) {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, searchResults, handleInputChange } = useUserSearch(currentUserId);
  const { user } = useAuth();

  // Check if a conversation already exists with the found user
  const existingConv = (otherUserId: string) =>
    conversations.find((conv) => conv.otherUserId === otherUserId);

  const handleStartChat = (user: SearchUser) => {
    const existing = existingConv(user._id);

    if (existing) {
      // If conversation exists, navigate to it
      setSearchTerm("");
      navigate(`/chat/${existing.id}`);
      return;
    }

    // New conversation: Temporarily navigate and rely on the first message
    // to create the conversation on the backend.
    const tempConv: Conversation = {
      id: `temp-${Date.now()}`, // Unique temporary ID
      type: "individual",
      name: user.username,
      lastMessage: "Say hello!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      otherUserId: user._id,
      participants: [currentUserId, user._id], // Include both users
    };

    // Add temporary conversation to the list and navigate
    setConversations((prev) => [tempConv, ...prev]);
    setSearchTerm("");
    navigate(`/chat/${tempConv.id}`);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Chats</h2>
        <button className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50">
          <FiMessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search users or chats..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && searchTerm.trim() !== "" && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <h4 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Users</h4>
            {searchResults.map((user) => (
              <button
                key={user._id}
                onClick={() => handleStartChat(user)}
                className="flex items-center w-full text-left p-3 hover:bg-gray-100 transition duration-150"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-sm mr-3 text-white font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1 flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <NavLink
            key={conv.id}
            to={`/chat/${conv.id}`}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-150 ${
                isActive ? "bg-blue-50" : "hover:bg-gray-50"
              }`
            }
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm mr-3">
              {conv.type === "group" ? <FiUsers /> : conv.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-800 truncate">{conv.name}</p>
                <span className="text-xs text-gray-400">{conv.timestamp}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default ConversationList;