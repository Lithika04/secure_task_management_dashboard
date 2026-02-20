// 404 fallback page for any unknown URL.
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-8 text-center shadow-sm"
      >
        {/* 404 label */}
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
          404
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          The page you requested does not exist.
        </p>

        {/* Link back to login — helps user recover */}
        <Link
          to="/login"
          className="mt-5 inline-block rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          Go to Login
        </Link>
      </motion.section>
    </main>
  );
};

export default NotFound;
