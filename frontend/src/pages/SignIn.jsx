import React, { useState } from "react";
import AuthModalWrapper from "../components/auth/AuthModalWrapper.jsx";
import api from "../api/axios.js";
import { setAuth } from "../utils/auth.js";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/"); 
  }
  const handleLogin = async (e) => {
    e.preventDefault();
  

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await api.post("/auth/login", data);
      setAuth(res.data.token, res.data.role, res.data.email);
      login();
      navigate("/");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <AuthModalWrapper isOpen={true} onClose={handleClose}>
      <div className="drop-shadow-lg">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-rose-700">
          Welcome Back
        </h2>
        <p className="text-center text-black-500 mt-1 mb-6 text-sm">
          Sign in to continue
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2
                         text-rose-800 placeholder-rose-400
                         focus:bg-white focus:outline-none focus:ring-2
                         focus:ring-rose-300 focus:border-rose-400
                         transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 pr-10
                           text-rose-800
                           focus:bg-white focus:outline-none focus:ring-2
                           focus:ring-rose-300 focus:border-rose-400
                           transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-black-400 hover:text-black-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="relative w-full inline-flex items-center justify-center p-0.5
                       overflow-hidden text-sm font-medium rounded-base group
                       bg-gradient-to-br from-red-200 via-red-300 to-yellow-200
                       hover:from-red-200 hover:via-red-300 hover:to-yellow-200
                       focus:ring-4 focus:outline-none focus:ring-red-100"
          >
            <span
              className="relative px-4 py-2.5 transition-all ease-in duration-75
                         bg-neutral-primary-soft rounded-base
                         group-hover:bg-transparent leading-5
                         text-heading group-hover:text-heading"
            >
              Sign In
            </span>
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-black-500">
            Don’t have an account?{" "}
            <a href="/signup">
              <span className="text-blue-700 font-medium cursor-pointer hover:underline">
                Sign Up
              </span>
            </a>
          </p>

          <p className="text-center text-xs text-gray-400 hover:underline cursor-pointer">
            Forgot password?
          </p>
        </form>
      </div>
    </AuthModalWrapper>
  );
};

export default SignIn;

