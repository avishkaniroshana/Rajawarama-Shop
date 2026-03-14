import React, { createContext, useContext, useState, useEffect } from "react";
import { clearAuth } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read from localStorage SYNCHRONOUSLY on first render
  const storedToken = localStorage.getItem("accessToken");
  const storedRole = localStorage.getItem("role");

  const initialLoggedIn = !!storedToken;
  const initialRole = storedRole ? storedRole.toUpperCase() : null;

  const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
  const [userRole, setUserRole] = useState(initialRole);

  const checkAuth = () => {
    const token = localStorage.getItem("accessToken");
    let role = localStorage.getItem("role");

    if (token && role) {
      role = role.toUpperCase();
      localStorage.setItem("role", role); // normalize once
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkAuth(); // Still run once on mount (in case storage changed externally)

    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = () => {
    checkAuth();
  };

  const logout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
