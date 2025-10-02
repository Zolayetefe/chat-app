import { FiMessageCircle } from 'react-icons/fi';

function WelcomeChatView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
      <FiMessageCircle className="w-16 h-16 mb-4 text-gray-300" />
      <h3 className="text-xl font-semibold mb-2">Welcome to ChatPro</h3>
      <p className="text-center">Select a conversation from the sidebar or start a new chat to begin messaging.</p>
    </div>
  );
}

export default WelcomeChatView;