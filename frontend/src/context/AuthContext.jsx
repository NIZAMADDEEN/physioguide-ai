import { createContext, useState, useEffect, useMemo } from "react";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  setToken,
  removeToken,
} from "../utils/helpers";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { user: newUser, token } = await authService.login(email, password);
    setToken(token);
    setStoredUser(newUser);
    setUser(newUser);
    return newUser;
  };

  const register = async (data) => {
    const { user: newUser, token } = await authService.register(data);
    setToken(token);
    setStoredUser(newUser);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    removeToken();
    removeStoredUser();
    setUser(null);
    authService.logout?.(); // optional backend logout
  };

  const updateProfile = async (data) => {
    const updatedUser = await authService.updateProfile(data);
    setStoredUser(updatedUser);
    setUser(updatedUser);
    return updatedUser;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading],
  );

  if (loading) {
    return null; // Or a global loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
