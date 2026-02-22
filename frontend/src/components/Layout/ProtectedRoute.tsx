
//  A route guard that blocks unauthenticated users
//          from accessing protected pages (like the dashboard)
//   When React Router tries to render /dashboard:
//     1. ProtectedRoute reads token from AuthContext
//     2. If token is null → redirects to /login (user can't enter)
//     3. If token exists → renders the children (dashboard loads)

// src/components/Layout/ProtectedRoute.tsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;