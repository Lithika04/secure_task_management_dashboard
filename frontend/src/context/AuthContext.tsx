import React, { createContext, useEffect, useMemo, useState } from "react";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

const TOKEN_KEY = "token";

const parseTokenPayload = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as { exp?: number };
  } catch {
    return null;
  }
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = parseTokenPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 > Date.now();
};

const readStoredToken = (): string | null => {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored && isTokenValid(stored)) return stored;
  if (stored) localStorage.removeItem(TOKEN_KEY);
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => readStoredToken());

  const login = (newToken: string) => {
    if (!isTokenValid(newToken)) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      return;
    }
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  useEffect(() => {
    const stored = readStoredToken();
    if (stored !== token) setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      if (!isTokenValid(token)) logout();
    }, 60_000);
    return () => clearInterval(interval);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
