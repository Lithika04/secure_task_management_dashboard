// contains sidebar nav and renders
// child pages using react routers <outlet>
// /dashboard/tasks  -> DashboardLayout + <outlet /> = dashboard
// /dashboard.profile  -> DashboardLayout + <Outlet /> = Profile
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackdrop from "../components/UI/AnimatedBackdrop";
// Shared base classes for sidebar nav links
// Defined outside component — no re-creation on every render
const linkBase = "rounded-lg px-4 py-2.5 text-sm front-medium transition";

const DashboardLayout: React.FC = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 p-4 md:p-8">
      <AnimatedBackdrop variant="light" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[220px_1fr]"
      >
        {/* SIDEBAR — navigation panel */}

        <aside className="h-fit rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="mb-4px-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {/* NavLink adds active styles automatically when route matches */}
            <NavLink
              to="/dashboard/tasks"
              className={({ isActive }) =>
                `${linkBase} block w-full text-left ${
                  isActive
                    ? "bg-blue-700 text-white" // active: filled blue
                    : "text-slate-700 hover:bg-slate-100" // inactive: subtle hover
                }`
              }
            >
              Tasks
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `${linkBase} block w-full text-left ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              Profile
            </NavLink>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <section className="space-y-6">
          <header className="rounded-3xl border border-sky-100 bg-blue-700 px-6 py-6 text-white shadow-xl md:px-10">
            <p className="text-sm tracking-wider text-sky-100">
              SECURE WORKSPACE{" "}
            </p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              Mission Control Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-blue-50 md:text-base">
              Monitor progress, update priorities, and keep every task
              traceable.
            </p>
          </header>

          {/* OUTLET — child route renders here */}
          {/* /dashboard/tasks   → renders Dashboard (TaskList) */}
          {/* /dashboard/profile → renders Profile */}
          <Outlet />
        </section>
      </motion.div>
    </main>
  );
};

export default DashboardLayout;
