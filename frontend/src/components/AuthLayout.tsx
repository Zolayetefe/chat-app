import { Outlet, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function AuthLayout() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toaster for notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4caf50',
            },
          },
          error: {
            style: {
              background: '#f44336',
            },
          },
        }}
      />

      {/* Navigation Bar */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ChatApp</h1>
          <div className="space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-600 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`
              }
            >
              Home
            </NavLink>
            {!user && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
            {user && (
              <>
                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `text-gray-600 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold' : ''}`
                  }
                >
                  Chat
                </NavLink>
                <button
                  onClick={async () => {
                    await logoutUser(); // logoutUser toasts "Logged out 👋"
                    window.location.href = '/login'; // Force redirect
                  }}
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">&copy; 2025 ChatApp. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#about" className="hover:text-blue-400 transition">
              About
            </a>
            <a href="#contact" className="hover:text-blue-400 transition">
              Contact
            </a>
            <a href="#privacy" className="hover:text-blue-400 transition">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;