// context needs because many components(navbar, login page) needs to know is user logged in?
// stores jwt teoken and exposes login/logout
//no need to pass token as a prop theough every component
import React, { createContext, useState, useEffect} from "react";

//interface : define exactly what authcontext provides to components
interface AuthContextType{
    token: string |null;         // JWT string or null if logged out
    login: (token: string) =>void; //call after login
    logout: () => void;            // call to end the session
}
// create context with default empty values -- a global storagr that any component open & read
export const AuthContext = createContext<AuthContextType>({
    token: null,
    login: () => {},
    logout: () =>{},
});
const TOKEN_KEY ="token" //const key for localstorage

// JWT decoder
// Payload is base64-encoded JSON with user data + expiry time
// We decode it to check if token is still valid
const parseTokenPayload = (
  token: string
): { exp?: number; email?: string } | null => {
  try {
    // Grab middle part of JWT (the payload)
    const payload = token.split(".")[1];
    if (!payload) return null;

    // JWT uses URL-safe base64 — replace chars before decoding
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as { exp?: number; email?: string };
  } catch {
    return null; // malformed token — treat as invalid
  }
};

//token validity check true -->token exist && not expired
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = parseTokenPayload(token);
  if (!payload?.exp) return true; // no expiry = treat as valid
  return payload.exp * 1000 > Date.now(); // compare with current time
};

//  AuthProvider Component  wraps entire app in main.tsx so usecontext(authcontext)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Check localStorage on first load , if user refresh page still stay logged in
  const storedToken = localStorage.getItem(TOKEN_KEY);
  // intial state check token valid --> load into state
  const [token, setToken] = useState<string | null>(
    isTokenValid(storedToken) ? storedToken : null
  );
  // Called by Login page after successful POST /auth/login
  // Saves JWT to React state (instant UI update) AND
  // localStorage (survives page refresh)
  const login = (newToken: string) => {
    if (!isTokenValid(newToken)) {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      return;
    }
    setToken(newToken);                    // update React state --> Navbar re-renders
    localStorage.setItem(TOKEN_KEY, newToken); // persist for page refresh
  };

  const logout = () => { //clear session completely
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  // Runs once when app loads
  // Removes stale keys from old versions and validates token
  useEffect(() => {
    localStorage.removeItem("mf_users");
    localStorage.removeItem("known_users");
    localStorage.removeItem("user");

    if (storedToken && !isTokenValid(storedToken)) {
    localStorage.removeItem(TOKEN_KEY);
    
  }, []); 

  // Checks every 60 seconds if token has expired
  // Handles case where user leaves browser open overnight
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (!isTokenValid(token)) {
        logout();
      }
    }, 60_000); // check every 60 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};