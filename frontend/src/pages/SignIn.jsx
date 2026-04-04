import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthModalWrapper from "../components/auth/AuthModalWrapper";
import api from "../api/axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toastSuccess, toastError } from "../utils/toast.js";
import { useAuth } from "../context/AuthContext";
import { setAuth } from "../utils/auth";

const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address!")
    .nonempty("Email is required!"),
  password: z
    .string()
    .nonempty("Password is required!")
    .min(8, "Password must be at least 8 characters!"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

      setAuth(accessToken, refreshToken, role, emailFromRes, fullName);
      login();
      toastSuccess("Login Successful");
      window.dispatchEvent(new Event("auth-change"));

      setTimeout(() => {
        const currentRole = localStorage.getItem("role");
        if (currentRole === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
          return;
        }
        const from = location.state?.from;
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
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

  /*  shared input style  */
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    borderRadius: 9,
    border: "1px solid rgba(139,26,26,0.20)",
    background: "rgba(139,26,26,0.03)",
    color: "#1C1008",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.88rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const onFocusInput = (e) => {
    e.target.style.borderColor = "rgba(139,26,26,0.45)";
    e.target.style.boxShadow = "0 0 0 3px rgba(139,26,26,0.07)";
    e.target.style.background = "#fff";
  };
  const onBlurInput = (e) => {
    e.target.style.borderColor = "rgba(139,26,26,0.20)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(139,26,26,0.03)";
  };

  return (
    <AuthModalWrapper isOpen={true} onClose={handleClose}>
      <div
        className="drop-shadow-lg"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/*   Decorative top rule  */}
        <div
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #C9A84C, #E2C56A, #C9A84C, transparent)",
            borderRadius: 2,
            marginBottom: 28,
            opacity: 0.65,
          }}
        />

        {/*  Header  */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#8B1A1A",
              margin: "0 0 6px",
              letterSpacing: "0.01em",
            }}
          >
            Welcome Back
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#7A6555",
              margin: 0,
              fontWeight: 300,
            }}
          >
            Sign in to continue
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(201,168,76,0.55))",
              }}
            />
            <div
              style={{
                width: 5,
                height: 5,
                background: "#C9A84C",
                transform: "rotate(45deg)",
                opacity: 0.6,
              }}
            />
            <div
              style={{
                width: 32,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(201,168,76,0.55), transparent)",
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/*  Email  */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8B1A1A",
                marginBottom: 7,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="your@email.com"
              style={inputStyle}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                ⚠ {errors.email.message}
              </p>
            )}
          </div>

          {/*  Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8B1A1A",
                marginBottom: 7,
              }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9B6B6B",
                  lineHeight: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8B1A1A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9B6B6B")}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                ⚠ {errors.password.message}
              </p>
            )}
          </div>


          {/*  Submit  */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg, #8B1A1A, #9B2335)",
              border: "none",
              borderRadius: 9,
              color: "#FDF8F0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
              transition: "box-shadow 0.25s, transform 0.18s",
              boxShadow: "0 4px 18px rgba(139,26,26,0.28)",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.boxShadow =
                  "0 6px 24px rgba(139,26,26,0.42)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 18px rgba(139,26,26,0.28)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          {/*  Footer  */}
          <p
            className="text-center text-sm"
            style={{ color: "#7A6555", margin: 10 }}
          >
            Don't have an account?{" "}
            <a
              href="/signup"
              style={{
                color: "#8B1A1A",
                fontWeight: 500,
                textDecoration: "none",
                borderBottom: "1px solid rgba(139,26,26,0.28)",
                paddingBottom: 1,
              }}
            >
              Sign Up
            </a>
          </p>

          
        </form>

        {/*  Bottom gold rule  */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)",
            marginTop: 28,
          }}
        />
      </div>
    </AuthModalWrapper>
  );
};

export default SignIn;
