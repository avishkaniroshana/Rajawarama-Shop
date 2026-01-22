import { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated, getUserFullName } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [user, setUser] = useState({ fullName: "" });

  useEffect(() => {
    if (isAuthenticated()) {
      setLoggedIn(true);
      setUser({ fullName: getUserFullName() });
    }
  }, []);

  const login = () => {
    setLoggedIn(true);
    setUser({ fullName: getUserFullName() });
  };

  const logout = () => {
    setLoggedIn(false);
    setUser({ fullName: "" });
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
