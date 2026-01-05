import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Rajawarama</h3>
          <p className="text-gray-400">
            Preserving Sri Lankan traditional wedding and cultural heritage
            through authentic services and performances.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link className="hover:text-white" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/packages">
                Packages
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/booking">
                Booking
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>

          <p className="text-gray-400 mb-2">
            Email:{" "}
            <span className="hover:text-white transition">
              isurudasanayaka98@gmail.com
            </span>
          </p>

          <p className="text-gray-400 mb-4">
            Phone:{" "}
            <span className="hover:text-white transition">+94 77 358 3546</span>
          </p>

          <div>
            <p className="text-gray-300 font-medium mb-2">Location</p>
            <div className="border-l-2 border-gray-700 pl-4 text-gray-400 space-y-1">
              <p>Badulla Road,</p>
              <p>Bindunuwewa,</p>
              <p>Bandarawela,</p>
              <p>Sri Lanka.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Rajawarama Shop. All rights reserved.
      </div>
    </footer>
    
  );
};

export default Footer;
