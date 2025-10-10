import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toaster for notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#4caf50",
            },
          },
          error: {
            style: {
              background: "#f44336",
            },
          },
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;