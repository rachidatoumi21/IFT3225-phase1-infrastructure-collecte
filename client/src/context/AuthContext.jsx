import { createContext, useContext, useMemo, useState } from "react";
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  loginUser,
  registerUser,
  saveAuthSession
} from "../api/authApi";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  const isAuthenticated = Boolean(token && user);

  async function register(payload) {
    const response = await registerUser(payload);
    const session = response.data;

    saveAuthSession(session);
    setToken(session.token);
    setUser(session.user);

    return session;
  }

  async function login(payload) {
    const response = await loginUser(payload);
    const session = response.data;

    saveAuthSession(session);
    setToken(session.token);
    setUser(session.user);

    return session;
  }

  function logout() {
    clearAuthSession();
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      register,
      login,
      logout
    }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }

  return context;
}

export { AuthProvider, useAuth };