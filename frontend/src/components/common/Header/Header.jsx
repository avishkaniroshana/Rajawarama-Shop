import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import { useAuth } from "../../../context/AuthContext";
import profileIcon from "../../../assets/images/profile-icon.png";

const Header = () => {
  const navigate = useNavigate();
  const { loggedIn, logout } = useAuth();

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
        <div className="hidden md:flex items-center space-x-4">
          {!loggedIn ? (
            <>
              <Link
                to="/signin"
                className="border px-4 py-2 rounded-lg text-gray-700 hover:border-orange-600"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="border px-4 py-2 rounded-lg text-gray-700 hover:border-blue-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* displaying logged user's user name */}
              <span className="text-gray-700 font-medium">Welcome,</span>
              {/* Profile */}
              <Link to="/profile">
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border cursor-pointer hover:ring-2 hover:ring-blue-500"
                />
              </Link>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 hover:shadow-lg transition duration-200"
              >
                Logout
              </button>
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
