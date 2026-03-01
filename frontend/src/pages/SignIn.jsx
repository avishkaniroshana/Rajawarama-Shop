import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthModalWrapper from "../components/auth/AuthModalWrapper.jsx";
import api from "../api/axios.js";
import { setAuth } from "../utils/auth.js";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toastError, toastSuccess } from "../utils/toast";

// Zod validation schema (consistent with SignUp)
const signInSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required!")
    .email("Invalid email address!"),
  password: z
    .string()
    .nonempty("Password is required!")
    .min(8, "Password must be at least 8 characters!"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const handleClose = () => {
    navigate("/");
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/api/auth/login", {
        email: data.email.trim(),
        password: data.password,
      });

      const accessToken = res.data.accessToken || res.data.token;
      const refreshToken = res.data.refreshToken;
      const role = res.data.role || "USER";
      const emailFromRes = res.data.email;
      const fullName = res.data.fullName;

      // Save auth data
      setAuth(accessToken, refreshToken, role, emailFromRes, fullName);

      // Update context
      login();
      toastSuccess("Login successful!");

      // Header to immediately re-check storage and update navbar
      window.dispatchEvent(new Event("auth-change"));

      // Safe delay for context propagation + redirect
      setTimeout(() => {
        const currentRole = localStorage.getItem("role");

        const redirectPath = currentRole === "ADMIN" ? "/admin/dashboard" : "/";
        navigate(redirectPath, { replace: true });
      }, 800);
    } catch (err) {
      const errorData = err.response?.data;

      if (typeof errorData === "string") {
        toastError(errorData);
      } else if (errorData?.message) {
        toastError(errorData.message);
      } else if (typeof errorData === "object") {
        toastError(Object.values(errorData)[0] || "Invalid email or password");
      } else {
        toastError("Login failed. Please try again.");
      }
    }
  };

  return (
    <AuthModalWrapper isOpen={true} onClose={handleClose}>
      <div className="drop-shadow-lg">
        <h2 className="text-3xl font-bold text-center text-rose-700">
          Welcome Back
        </h2>
        <p className="text-center text-black-500 mt-1 mb-6 text-sm">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800 placeholder-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 pr-10 text-rose-800 placeholder-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black-400 hover:text-black-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-base group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 hover:from-red-200 hover:via-red-300 hover:to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent leading-5 text-heading group-hover:text-heading">
              {isSubmitting ? "Signing In..." : "Sign In"}
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
