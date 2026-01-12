import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthModalWrapper from "../components/auth/AuthModalWrapper";
import api from "../api/axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../utils/toast.js";


const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .regex(/^(?:\+94|0)\d{9}$/, "Use +94XXXXXXXXX or 0XXXXXXXXX"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    navigate("/"); 
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/signup", data);
      toastSuccess("Registration successful! Please sign in.");
      setTimeout(() => {
        navigate("/signin");
      }, 1200);
    } catch (err) {
      toastError(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <AuthModalWrapper isOpen={true} onClose={handleClose}>
      <div className=" drop-shadow-lg ">
        {/* Close Button */}

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-rose-700">
          Create Account
        </h2>
        <p className="text-center text-black-500 mt-1 mb-6 text-sm">
          Join with Us
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">
              Full Name
            </label>
            <input
              {...register("fullName")}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2
                       text-rose-800 placeholder-rose-400
                       focus:bg-white focus:outline-none focus:ring-2
                       focus:ring-rose-300 focus:border-rose-400
                       transition"
            />
            {errors.fullName && (
              <p className="w-full text-left text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">
              Phone Number
            </label>
            <input
              {...register("phone")}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2
                       text-rose-800
                       focus:bg-white focus:outline-none focus:ring-2
                       focus:ring-rose-300 focus:border-rose-400
                       transition"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-rose-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2
                       text-rose-800
                       focus:bg-white focus:outline-none focus:ring-2
                       focus:ring-rose-300 focus:border-rose-400
                       transition"
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
                className="w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 pr-10
                         text-rose-800
                         focus:bg-white focus:outline-none focus:ring-2
                         focus:ring-rose-300 focus:border-rose-400
                         transition"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-base group
             bg-gradient-to-br from-red-200 via-red-300 to-yellow-200
             hover:from-red-200 hover:via-red-300 hover:to-yellow-200
             focus:ring-4 focus:outline-none focus:ring-red-100
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className="relative px-4 py-2.5 transition-all ease-in duration-75
               bg-neutral-primary-soft rounded-base
               group-hover:bg-transparent leading-5
               text-heading group-hover:text-heading"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </span>
          </button>

          {/* Footer of the Sign Up form */}
          <p className="text-center text-sm text-black-500">
            Already have an account?{" "}
            <a href="/signin">
              <span className="text-blue-700 font-medium cursor-pointer hover:underline">
                Sign In
              </span>
            </a>
          </p>
        </form>
      </div>
    </AuthModalWrapper>
  );
};

export default SignUp;

