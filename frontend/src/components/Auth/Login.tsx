//login page  --> collect email + password sends to
//                  backend,recieves JWT , saves it, redirects to dashboard
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";
import { motion } from "framer-motion";
import AnimatedBackdrop from "../UI/AnimatedBackdrop";
import { toast } from "react-toastify";

//shape the backend response for POST/auth/login
type LoginResponse ={
    message: string;
    token: string;
    user: {
        name: string;
        email:string;
    };
};
const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // login() saves token globally

    //ccontrolled input states
    const[email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  //inline error message
    
    //Form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //stop browser page reload
        setError("");     //clear previous errors

        try{
        //POST credentials to backend --> api.ts interceptor adds header
        const res = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const token = res.data.token;
      //Save the JWT via AuthContext .->sets react state , saves to localstorage
      login(token);
      navigate("/dashboard/tasks"); 
    }
    catch (err: unknown) {
      // axios.isAxiosError narrows type so we can read backend message
      if (axios.isAxiosError<{ message?: string }>(err)) {
        const msg = err.response?.data?.message || "Login failed";
        setError(msg);      // show inline below form
        toast.error(msg);   // show pop-up notification
        return;
      }
      toast.error("Login failed");
      setError("Login failed");
    }  
};

  return (
    // Full screen dark background
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      <AnimatedBackdrop variant="dark" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid w-full gap-6 lg:grid-cols-2">
          {/* LEFT PANEL — branding, hidden on mobile */}
          <motion.article
            initial={{ opacity: 0, x: -25 }} // starts left and invisible
            animate={{ opacity: 1, x: 0 }}   // slides in from left
            className="hidden rounded-3xl border border-sky-200/25 bg-slate-900/35 p-10 text-white backdrop-blur lg:block">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">
              CipherDesk
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Welcome Back
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
              TaskVault is a secure task platform built for focused teams who
              need protected workflows, clean tracking, and role-aware progress
              visibility.
            </p>
            <p className="mt-8 text-sm text-slate-300">
              Simple, secure, and focused task tracking for everyday teams.
            </p>
          </motion.article>

          {/* RIGHT PANEL — login form */}
          <motion.section
            initial={{ opacity: 0, x: 25 }} // starts right and invisible
            animate={{ opacity: 1, x: 0 }}  // slides in from right
            className="rounded-3xl border border-sky-300/45 bg-slate-900/70 p-7 text-white shadow-2xl backdrop-blur md:p-10"
          >
            {/* App name on mobile only — left panel is hidden */}
            <p className="mb-1 text-sm uppercase tracking-[0.18em] text-sky-300 lg:hidden">
              TaskVault
            </p>
            <h2 className="mb-6 text-center text-4xl font-bold">Login</h2>

            {/* Inline error — only shows when error state has value */}
            {error && (
              <p className="mb-4 rounded-md border border-red-400/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email — controlled input, updates state on every keystroke */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-slate-200/60 bg-transparent px-5 py-3 text-lg text-white outline-none placeholder:text-slate-300 focus:border-sky-300"
                required
              />

              {/* Password — controlled input */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-full border border-slate-200/60 bg-transparent px-5 py-3 text-lg text-white outline-none placeholder:text-slate-300 focus:border-sky-300"
                required
              />
              {/* Submit button */}
              <button
                type="submit"
                className="w-full rounded-full bg-blue-600 py-3 text-xl font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </button>
            </form>

            {/* Link to Register for new users */}
            <p className="mt-4 text-center text-sm text-slate-300">
              New to CipherDesk?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-semibold text-sky-300 hover:text-sky-200"
              >
                Create account
              </button>
            </p>
          </motion.section>
        </section>
      </div>
    </main>
  );
}
export default Login;