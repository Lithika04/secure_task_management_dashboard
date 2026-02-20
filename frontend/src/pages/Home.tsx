// Landing page for the root URL "/".
//          Shows different buttons based on login state.
import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import AnimatedBackdrop from "../components/UI/AnimatedBackdrop";

export default function Home() {
  // Check login state to show different buttons
  const { token } = useContext(AuthContext);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-50 p-6">
      <AnimatedBackdrop variant="light" />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto mt-20 w-full max-w-2xl rounded-xl border border-sky-100 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">
          TaskVault Secure Platform
        </h1>
        <p className="mt-3 text-gray-600">
          Manage tasks securely with authentication and a protected dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={token ? "/dashboard" : "/login"}
            className="rounded-md bg-sky-600 px-5 py-2.5 text-white hover:bg-sky-700">
            {token ? "Go to Dashboard" : "Login"}
          </Link>

          {/* Register only shown to guests */}
          {!token && (
            <Link
              to="/register"
              className="rounded-md border border-slate-300 px-5 py-2.5 text-slate-700 hover:bg-amber-50">
              Register
            </Link>
          )}
        </div>
      </motion.section>
    </main>
  );
}
