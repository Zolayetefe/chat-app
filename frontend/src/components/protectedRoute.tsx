import { useAuth } from '../context/AuthContext';
import { Navigate } from "react-router-dom";
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth(); 
 
  // This prevents the redirect from firing prematurely.
  if (isLoading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        Authenticating session...
      </div>
    );
  }


  // If user is null (authentication failed/not logged in), redirect to login.
  if (!user) {
    // You can use the 'replace' prop to prevent the login page from being
    // added to the browser history stack.
    return <Navigate to="/login" replace />;
  }

  // 4. If loading is false AND user is not null, render the children (the protected page).
  return <>{children}</>;
};

export default ProtectedRoute;