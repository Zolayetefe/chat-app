import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import LandingPage from './pages/LandingPage';
import AuthLayout from './components/AuthLayout';
import ChatLayout from "./components/chat/ChatLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChatPage from "./pages/chat/ChatPage"; // This will now contain the ConversationList
import ProtectedRoute from "./components/protectedRoute";

// *** New Pages/Components Required ***
import ChatWindow from "./components/chat/ChatWindow"; // For displaying a specific conversation
import WelcomeChatView from "./components/chat/WelcomeChatView"; // For the default chat view (optional, can be merged)
// import GroupsPage from "./pages/GroupsPage";
// import SettingsPage from "./pages/SettingsPage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Routes (Authentication) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 2. Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 3. Protected Application Routes (ChatLayout Shell) */}
      <Route element={<ProtectedRoute><ChatLayout /></ProtectedRoute>}>
        
        {/* Redirect root to /chat for authenticated users */}
        <Route index element={<Navigate to="/chat" replace />} />

        {/* CHAT ROUTES: Nested routes for the Conversation List and Chat Window */}
        <Route path="chat" element={<ChatPage />}>
          {/* Default view when no conversation is selected (e.g., Welcome message) */}
          <Route index element={<WelcomeChatView />} />
          
          {/* Dynamic route for a specific conversation */}
          <Route path=":conversationId" element={<ChatWindow />} />
        </Route>

        {/* GROUPS ROUTE */}
        {/* <Route path="groups" element={<GroupsPage />} /> */}

        {/* SETTINGS ROUTE */}
        {/* <Route path="settings" element={<SettingsPage />} /> */}

      </Route>
    </Routes>
  );
};

export default App;