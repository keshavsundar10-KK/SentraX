import { useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./authContextInstance";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function initAuth() {
      try {
        const currentUser = await api.getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      active = false;
    };
  }, []);

  async function login(credentials) {
    setError(null);
    const loggedUser = await api.login(credentials);
    setUser(loggedUser);
    return loggedUser;
  }

  async function register(payload) {
    setError(null);
    const registeredUser = await api.register(payload);
    setUser(registeredUser);
    return registeredUser;
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }

  async function updateProfile(profileData) {
    const updated = await api.updateProfile(profileData);
    setUser(updated);
    return updated;
  }

  async function changePassword(passwordData) {
    return await api.changePassword(passwordData);
  }

  async function refreshUser() {
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
