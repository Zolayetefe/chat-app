import { NavLink } from 'react-router-dom';
import { FiSearch, FiUsers } from 'react-icons/fi';
import type { Conversation } from '../../types/chat';

interface ConversationListProps {
  conversations: Conversation[];
}

function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Chats</h2>
        <button className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50">
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-1">
        {conversations.map((conv) => (
          <NavLink
            key={conv.id}
            to={`/chat/${conv.id}`}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition duration-150 ${
                isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`
            }
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm mr-3">
              {conv.type === 'group' ? <FiUsers /> : conv.name[0]}
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