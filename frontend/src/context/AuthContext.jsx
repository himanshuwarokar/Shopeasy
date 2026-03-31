import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("shopeasy_user")) || null;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const persistUser = (user) => {
    setUserInfo(user);
    localStorage.setItem("shopeasy_user", JSON.stringify(user));
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      persistUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      persistUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("shopeasy_user");
  };

  const value = useMemo(
    () => ({ userInfo, loading, register, login, logout }),
    [userInfo, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
