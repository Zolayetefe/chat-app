import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import AuthLayout from './components/AuthLayout';
import ChatLayout from "./components/ChatLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/protectedRoute";

const App: React.FC = () => {
  return (
      <Routes>
      <Route element={<AuthLayout/>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
         <Route path="/" element={<LandingPage />} />
      <Route element= {<ChatLayout/>}>
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      </Route>
      </Routes>
  );
};

export default App;
