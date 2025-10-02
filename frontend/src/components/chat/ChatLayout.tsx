import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Toaster } from 'react-hot-toast';

// New imports for icons (assuming you have react-icons installed)
import { FiMessageSquare, FiLogOut, FiMenu, FiUsers, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

function ChatLayout() {
  const { user, isLoading, logoutUser } = useAuth();
  const navigate = useNavigate();
  // State to handle mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch {
      // Error toast handled by authService
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-500 mb-6">You need to log in to view this page.</p>
        <button
          onClick={() => navigate('/login')}
          className="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // --- Professional Layout with Added Nav Items ---

  return (
    <div className="flex min-h-screen bg-gray-100 antialiased">
      {/* Toaster for notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { 
            background: '#333', 
            color: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
          },
          success: { style: { background: '#10b981' } }, // Emerald 500
          error: { style: { background: '#ef4444' } },   // Red 500
        }}
      />

      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-xl hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-600">Chat</span>Pro
          </h1>
        </div>

        {/* User Profile Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-medium shadow-md">
              {user.username[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800 truncate">
                {user.name || user.username}
              </h2>
              <p className="text-xs text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 tracking-wider">
            Main
          </h3>
          {/* Chat Room (Primary) */}
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 transition duration-150 ease-in-out ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <FiMessageSquare className="w-5 h-5" />
            Chat Room
          </NavLink>

          {/* Groups (New Nav Item) */}
          <NavLink
            to="/groups"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 transition duration-150 ease-in-out ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <FiUsers className="w-5 h-5" />
            Groups
          </NavLink>
          
          {/* Settings (New Nav Item) */}
          <h3 className="text-xs uppercase text-gray-500 font-semibold mt-6 mb-3 tracking-wider">
            Account
          </h3>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 transition duration-150 ease-in-out ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <FiSettings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-150 ease-in-out"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-30 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 shadow-2xl z-40 transform transition-transform duration-300 md:hidden flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile Header/User Info */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">Chat</span>Pro
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-lg font-medium shadow-md">
              {user.username[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800 truncate">
                {user.name || user.username}
              </h2>
              <p className="text-xs text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
                Active
              </p>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 tracking-wider">
            Main
          </h3>
          <NavLink
            to="/chat"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 transition duration-150 ease-in-out ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <FiMessageSquare className="w-5 h-5" />
            Chat Room
          </NavLink>
          <NavLink
            to="/groups"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 transition duration-150 ease-in-out ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <FiUsers className="w-5 h-5" />
            Groups
          </NavLink>

          <h3 className="text-xs uppercase text-gray-500 font-semibold mt-6 mb-3 tracking-wider">
            Account
          </h3>
          <NavLink
            to="/settings"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 transition duration-150 ease-in-out ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <FiSettings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>
        
        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-150 ease-in-out"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Top Bar/Header - Mobile & Desktop */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-md z-10 md:ml-64">
        <div className="flex items-center justify-between h-full px-4">
          <div className="md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">
             {/* Dynamic Header could go here based on current route */}
             Chat Application
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center text-sm text-red-600 hover:text-red-700 transition p-2"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.name || user.username}</span>
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user.username[0]?.toUpperCase() || 'U'}
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ChatLayout;