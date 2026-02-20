
//  A route guard that blocks unauthenticated users
//          from accessing protected pages (like the dashboard)
//   When React Router tries to render /dashboard:
//     1. ProtectedRoute reads token from AuthContext
//     2. If token is null → redirects to /login (user can't enter)
//     3. If token exists → renders the children (dashboard loads)

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

//Props Interface 
// children: the page component to render if authenticated
// React.ReactElement is stricter than React.ReactNode —
// it ensures children is a single React element (like <DashboardLayout />)
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Read the current JWT token from global auth context
  const { token } = useContext(AuthContext);

  // Auth Check
  // If no token: user is not logged in → send to login page.
  // replace={true} replaces the history entry so the user
  // can't press the back button to get back to the blocked route.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  //  Authenticated: Render Page 
  // Token exists → user is logged in → show the actual page
  return children;
};

export default ProtectedRoute;