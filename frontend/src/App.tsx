import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";

const App: React.FC = () => {
  return (
      <Routes>
      <Route element={<Layout/>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
         <Route path="/" element={<LandingPage />} />
       <Route path="chat" element={<ChatPage/>}/>
      </Routes>
  );
};

export default App;
