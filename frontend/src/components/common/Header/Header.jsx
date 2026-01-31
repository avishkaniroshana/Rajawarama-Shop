import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUserRole } from "../../../utils/auth";
import { useAuth } from "../../../context/AuthContext";
import profileIcon from "../../../assets/images/profile-icon.png";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { loggedIn, logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-700">
          Rajawarama
        </Link>

        {/* Navigation Links */}
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

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {!loggedIn ? (
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
            <>
              {/* Profile & Dropdown */}
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
                    {user?.fullName || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                    {/* Admin Dashbords for only Admin */}
                    {getUserRole() === "ADMIN" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-blue-700 font-medium hover:bg-blue-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Divider */}
                    <div className="border-t" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 shadow-sm transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 text-2xl">☰</button>
      </div>
    </header>
  );
};

export default Header;
