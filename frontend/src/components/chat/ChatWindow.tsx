import { useParams, useOutletContext } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import WelcomeChatView from './WelcomeChatView';
import type{ Conversation, Message } from '../../types/chat';
import { useAuth } from '../../context/AuthContext';

interface ChatWindowContext {
  conversations: Conversation[];
  currentUser: string;
}

function ChatWindow() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { conversations, currentUser } = useOutletContext<ChatWindowContext>();
  const { isLoading } = useAuth();
  const activeConversation = conversations.find((c) => c.id === conversationId);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Alice',
      content: 'Hey, how are you?',
      isMine: false,
      timestamp: '10:00 AM',
    },
    {
      id: '2',
      sender: currentUser || 'You',
      content: 'Great, thanks! Just finishing up the project.',
      isMine: true,
      timestamp: '10:01 AM',
    },
    {
      id: '3',
      sender: 'Alice',
      content: 'Awesome, let’s catch up later!',
      isMine: false,
      timestamp: '10:02 AM',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentUser) return;

    const newMessage: Message = {
      id: `${Date.now()}`,
      sender: currentUser,
      content: messageText.trim(),
      isMine: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (!activeConversation) {
    return <WelcomeChatView />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">{activeConversation.name}</h3>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-md ${
                msg.isMine
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}
            >
              {!msg.isMine && <p className="text-xs font-semibold mb-1">{msg.sender}</p>}
              <p className="text-sm">{msg.content}</p>
              <span
                className={`text-xs block mt-1 ${msg.isMine ? 'text-blue-200' : 'text-gray-400'} text-right`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 transition"
            autoFocus
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:bg-blue-300"
            disabled={!messageText.trim()}
          >
            <FiSend className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;