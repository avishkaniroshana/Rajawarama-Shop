import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { clearAuth } from "../../../utils/auth";
import profileIcon from "../../../assets/images/profile-icon.png";
import { ChevronDown, User } from "lucide-react";

const Header = () => {
  const { isLoggedIn: contextLoggedIn, userRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(contextLoggedIn); // Local state for immediate sync

  // Sync local state with context + listen for storage changes
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    checkLogin(); // Initial check

    // Listen for storage changes (triggered by login/logout)
    window.addEventListener("storage", checkLogin);
    // Also listen for custom event from login
    window.addEventListener("auth-change", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("auth-change", checkLogin);
    };
  }, []);

  // Sync with context changes
  useEffect(() => {
    setIsLoggedIn(contextLoggedIn);
  }, [contextLoggedIn]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/api/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Logout API failed:", err);
    }

    clearAuth();
    setDropdownOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-700">
          Rajawarama
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link className="text-gray-700 hover:text-red-700" to="/">
            Home
          </Link>
          <Link className="text-gray-700 hover:text-red-700" to="/services">
            Services
          </Link>
          <Link className="text-gray-700 hover:text-red-700" to="/packages">
            Packages
          </Link>
          <Link className="text-gray-700 hover:text-red-700" to="/booking">
            Booking
          </Link>
          <Link className="text-gray-700 hover:text-red-700" to="/contact">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4 relative">
          {!isLoggedIn ? (
            <>
              <Link
                to="/signin"
                className="border px-4 py-2 rounded-lg text-gray-700 hover:border-orange-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="border px-4 py-2 rounded-lg text-gray-700 hover:border-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:ring-2 hover:ring-blue-500 transition"
              >
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border"
                />
                <span className="hidden md:inline text-gray-700 font-medium">
                  {localStorage.getItem("fullName") || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>

              {dropdownOpen && (
                <div
                  className={`
      absolute right-0 mt-3 w-64 
      bg-white 
      border border-gray-200 
      rounded-2xl 
      shadow-xl shadow-gray-200/40 
      overflow-hidden
      z-50
      ring-1 ring-gray-100
      animate-in fade-in zoom-in-95 duration-150
    `}
                >
                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className={`
        group flex items-center gap-3 px-5 py-3.5
        text-gray-800
        hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-indigo-50/70
        transition-all duration-200
        border-b border-gray-100
      `}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-medium shadow-md">
                      {localStorage.getItem("fullName")?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium group-hover:text-blue-700 transition-colors">
                        Profile
                      </div>
                      <div className="text-xs text-gray-500">
                        Manage your account
                      </div>
                    </div>
                  </Link>

                  {/* Admin Dashboard – only for admin */}
                  {userRole === "ADMIN" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className={`
          group flex items-center gap-3 px-5 py-3.5
          text-indigo-600 font-medium
          hover:bg-indigo-50/80
          transition-all duration-200
          border-b border-gray-100
        `}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                        />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}

                  {/* Subtle light divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className={`
        group flex items-center gap-3 w-full px-5 py-3.5
        text-red-600 font-medium
        hover:bg-red-50/80
        transition-all duration-200
      `}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="md:hidden text-gray-700 text-2xl">☰</button>
      </div>
    </header>
  );
};

export default Header;
