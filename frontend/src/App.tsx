import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import Navbar from "./components/Layout/Navbar";

const AppLayout: React.FC = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
 // Hide Navbar on auth pages — Login and Register have their own
  // full-screen layouts and don't need the top navigation bar
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Conditionally render Navbar: hide on /login and /register */}
      {!isAuthRoute && <Navbar />}

      {/* AnimatePresence enables exit animations when routes change */}
      <AnimatePresence mode="wait">
        {/* key={location.pathname} tells AnimatePresence when the route changed  without key -> not detect the change*/}
        <Routes location={location} key={location.pathname}>

          {/* ROOT — redirect to dashboard if logged in, else to login */}
          <Route
            path="/"
            element={<Navigate to={token ? "/dashboard/tasks" : "/login"} replace />}
          />

          {/* PUBLIC ROUTES — no auth required */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES — ProtectedRoute checks for token */}
          {/* DashboardLayout is the parent — uses <Outlet /> for children */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* /dashboard -> redirect to /dashboard/tasks */}
            <Route index element={<Navigate to="/dashboard/tasks" replace />} />

            {/* /dashboard/tasks -> renders Dashboard (TaskList) in Outlet */}
            <Route path="tasks" element={<Dashboard />} />

            {/* /dashboard/profile -> renders Profile in Outlet */}
            <Route path="profile" element={<Profile />} />

            {/* Any other /dashboard/* URL → 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* GLOBAL FALLBACK — any completely unknown URL → 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

// App 
// Outermost component — wraps everything in BrowserRouter.
// BrowserRouter uses the HTML5 History API for clean URLs
// changes — enabling them now makes future upgrades easier.
const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;