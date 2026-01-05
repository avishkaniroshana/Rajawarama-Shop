import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-red-700">Rajawarama</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link className="text-gray-700 hover:text-red-700 transition" to="/">
            Home
          </Link>
          <Link
            className="text-gray-700 hover:text-red-700 transition"
            to="/services"
          >
            Services
          </Link>
          <Link
            className="text-gray-700 hover:text-red-700 transition"
            to="/packages"
          >
            Packages
          </Link>
          <Link
            className="text-gray-700 hover:text-red-700 transition"
            to="/booking"
          >
            Booking
          </Link>
          <Link
            className="text-gray-700 hover:text-red-700 transition"
            to="/contact"
          >
            Contact
          </Link>
        </nav>

        {/*Actions*/}
        <div className="hidden md:flex items-center space-x-4 gap-2">
          <Link
            to="/signin"
            className="border border-black-400 text-gray-700 px-4 py-2 rounded-lg hover:border-orange-600 transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="border border-black-400 text-gray-700 px-4 py-2 rounded-lg hover:border-blue-600 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700">☰</button>
      </div>
    </header>
  );
};

export default Header;
