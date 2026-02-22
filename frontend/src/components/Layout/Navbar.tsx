//  Top navigation bar shown on all non-auth pages.
//          Changes its links based on login state (token).
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  // Read token and logout from global auth state
  const { token, logout } = useContext(AuthContext);

  // useNavigate lets us redirect programmatically after logout
  const navigate = useNavigate();

  // Logout Handler
  // 1. Calls logout() from AuthContext:
  //    - Clears token from React state → Navbar re-renders immediately
  //    - Removes token from localStorage → session gone on refresh
  // 2. Redirects to /login page
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }} // starts invisible and 12px above position
      animate={{ opacity: 1, y: 0 }} // slides down and fades in on mount
      className="sticky top-0 z-50 border-b border-sky-200 bg-blue-700 text-white shadow-sm"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/dashboard/tasks"
          className="text-xl font-bold tracking-wide text-white"
        >
          TaskVault
        </Link>
        <div className="flex gap-4 items-center text-sm sm:text-base">
          {token ? (
            // AUTHENTICATED USER links
            <>
              <Link
                to="/dashboard/tasks"
                className="rounded px-2 py-1 text-slate-100 transition hover:bg-blue-800"
              >
                Dashboard
              </Link>

              <Link
                to="/dashboard/profile"
                className="rounded px-2 py-1 text-slate-100 transition hover:bg-blue-800"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md bg-amber-400 px-3 py-1 font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Logout
              </button>
            </>
          ) : (
            // GUEST USER links
            <>
              <Link
                to="/login"
                className="rounded px-2 py-1 text-slate-100 transition hover:bg-blue-800"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded px-2 py-1 text-slate-100 transition hover:bg-blue-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
