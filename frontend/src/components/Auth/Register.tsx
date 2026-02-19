//  Register page — collects name, email, password,
//          sends to backend, redirects to login on success.


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";
import { motion } from "framer-motion";
import AnimatedBackdrop from "../UI/AnimatedBackdrop";
import { toast } from "react-toastify";

// Shape of backend response for POST /auth/register
type RegisterResponse = {
  message: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Controlled input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // ── Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation — check passwords match BEFORE
    // sending to server. Instant feedback without network call.
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      // POST new user data to backend
      // Backend: checks email not taken → hashes password → saves user
      await api.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password,
        // confirmPassword NOT sent — backend doesn't need it
        // we validated it here on the client
      });

      // Registration success → go to login
      // User must now log in to get their JWT
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err)) {
        const msg = err.response?.data?.message || "Registration failed";
        setError(msg);
        toast.error(msg);
        return;
      }
      toast.error("Registration failed");
      setError("Registration failed");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <AnimatedBackdrop variant="dark" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid w-full gap-6 lg:grid-cols-2">

          {/* LEFT PANEL — branding, desktop only */}
          <motion.article
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden rounded-3xl border border-sky-200/25 bg-slate-900/35 p-10 text-white backdrop-blur lg:block"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
              TaskVault
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Build Your Secure Workspace
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
              Create your account to access encrypted task timelines, priority
              tracking, and protected collaboration workflows.
            </p>
          </motion.article>

          {/* RIGHT PANEL — register form */}
          <motion.section
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-sky-300/45 bg-slate-900/70 p-7 text-white shadow-2xl backdrop-blur md:p-10"
          >
            <p className="mb-1 text-sm uppercase tracking-[0.18em] text-sky-300 lg:hidden">
              CipherDesk
            </p>
            <h2 className="mb-6 text-center text-4xl font-bold">Register</h2>

            {/* Inline error */}
            {error && (
              <p className="mb-4 rounded-md border border-red-400/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-slate-200/60 bg-transparent px-5 py-3 text-lg text-white outline-none placeholder:text-slate-300 focus:border-sky-300"
                required
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-slate-200/60 bg-transparent px-5 py-3 text-lg text-white outline-none placeholder:text-slate-300 focus:border-sky-300"
                required
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-slate-200/60 bg-transparent px-5 py-3 text-lg text-white outline-none placeholder:text-slate-300 focus:border-sky-300"
                required
              />

              {/* Confirm password — compared with password in handleSubmit */}
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-full border border-slate-200/60 bg-transparent px-5 py-3 text-lg text-white outline-none placeholder:text-slate-300 focus:border-sky-300"
                required
              />

              <button
                type="submit"
                className="w-full rounded-full bg-blue-600 py-3 text-xl font-semibold text-white transition hover:bg-blue-700"
              >
                Create Account
              </button>
            </form>

            {/* Link back to login for existing users */}
            <p className="mt-4 text-center text-sm text-slate-300">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-sky-300 hover:text-sky-200"
              >
                Login
              </button>
            </p>
          </motion.section>
        </section>
      </div>
    </main>
  );
};

export default Register;