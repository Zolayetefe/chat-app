import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConversationList from './ConversationList';
import type{ Conversation } from '../../types/chat';

function ChatPage() {
  const { user, isLoading } = useAuth();

  // Dummy conversation data
  const conversations: Conversation[] = [
    {
      id: '123',
      type: 'individual',
      name: 'Alice',
      lastMessage: 'See you tomorrow.',
      timestamp: '10:30 AM',
    },
    {
      id: '456',
      type: 'group',
      name: 'Dev Team',
      lastMessage: 'Did anyone test the new API?',
      timestamp: '9:00 AM',
    },
    {
      id: '789',
      type: 'individual',
      name: 'Bob',
      lastMessage: 'Lunch at 1?',
      timestamp: '8:45 AM',
    },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Unauthorized</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Conversation List Sidebar (Desktop visible) */}
      <div className="w-full md:w-80 border-r border-gray-200 flex-shrink-0 hidden md:block overflow-y-auto">
        <ConversationList conversations={conversations} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden">
        <Outlet context={{ conversations, currentUser: user.username }} />
      </div>

      {/* Mobile View: Handled by ChatWindow/WelcomeChatView */}
      <div className="md:hidden w-full h-full"></div>
    </div>
  );
}

export default ChatPage;