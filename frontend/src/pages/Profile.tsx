// show logged -in user name and email by fetching from protected GET/auth endpoint
//protected end points:
// 1. api.get('auth/me') fires
// 2. Axios interceptor adds Authorization: Bearer <token>
// 3. nackend reads token ->find user in DB -> returns data
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

//shape od res from GET /auth/me
type ProfileResponse = {
  user: {
    name: string;
    email: string;
  };
};
const Profile: React.FC = () => {
  const { token } = useContext(AuthContext);
  //fetch profile
  // useQuery caches result with key ["profile"]
  const { data, isLoading } = useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      // Axios interceptor adds Bearer token automatically
      const res = await api.get("/auth/me");
      return res.data as ProfileResponse;
    },
    enabled: Boolean(token), // Only run if user is actually logged in
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
      <p className="mt-1 text-sm text-slate-500">
        Account details from your secure session.
      </p>

      <div className="mt-5 space-y-3 text-sm">
        {/* Name field */}
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-slate-500">Name</p>
          <p className="font-medium text-slate-900">
            {/* Show loading placeholder while fetching */}
            {isLoading ? "Loading..." : data?.user.name || "User"}
          </p>
        </div>

        {/* Email field */}
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-slate-500">Email</p>
          <p className="font-medium text-slate-900">
            {isLoading ? "Loading..." : data?.user.email || "Unavailable"}
          </p>
        </div>

        {/* Session status — always Authenticated if this page loaded */}
        {/* ProtectedRoute blocks unauthenticated users from reaching here */}
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-slate-500">Session</p>
          <p className="font-medium text-emerald-700">Authenticated</p>
        </div>
      </div>
    </motion.section>
  );
};

export default Profile;
