import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { clearAuth } from "../utils/auth";
import { toastError, toastSuccess } from "../utils/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required!")
    .min(3, "Full name must be at least 3 characters!"),

  phone: z
    .string()
    .trim()
    .regex(/^(?:\+94|0)\d{9}$/, "Use +94XXXXXXXXX or 0XXXXXXXXX"),
});


const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required!"),
    newPassword: z.string().min(8, "Password must be at least 8 characters!"),
    confirmPassword: z.string().min(1, "Confirm your password!"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ===== PROFILE FORM ===== */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  /* ===== PASSWORD FORM ===== */
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  /* ===== FETCH PROFILE ===== */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUser(res.data);
      reset(res.data);
    } catch {
      toastError("Session expired. Please sign in again.");
      clearAuth();
      window.location.href = "/signin";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ===== UPDATE PROFILE ===== */
  const onSubmitProfile = async (data) => {
    try {
      await api.put("/profile", data);
      toastSuccess("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to update profile");
    }
  };

  /* ===== CHANGE PASSWORD ===== */
  const onSubmitPassword = async (data) => {
    try {
      await api.put("/profile/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toastSuccess("Password updated successfully");
      resetPassword();
      setIsChangingPassword(false);
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to change password!");
    }
  };

  /* ===== DELETE ACCOUNT ===== */
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/profile");

      toastSuccess("Account deleted successfully");

      clearAuth();

      setTimeout(() => {
        window.location.href = "/signin";
      }, 1200);
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to delete account");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-100 to-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-8 text-white shadow-xl hover:shadow-2xl transition-shadow">
          <h1 className="text-3xl font-semibold">My Account</h1>
          <p className="text-indigo-100 mt-1">
            Manage your profile & security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-2xl p-6 text-center text-white shadow-lg">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center mb-4 shadow-inner">
                <span className="text-3xl font-bold text-white">
                  {user.fullName?.charAt(0)}
                </span>
              </div>
              <h2 className="font-bold text-2xl text-white">{user.fullName}</h2>
              <p className="text-xm text-white">{user.email}</p>
            </div>

            <div className="backdrop-blur-xl bg-black/40 border border-white/40 rounded-2xl p-5 shadow-md">
              <p className="text-xs font-semibold mb-3 tracking-widest">
                NAVIGATION
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-black hover:text-white">
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/orders"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-black hover:text-white"
                  >
                    Orders
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-black hover:text-white"
                  >
                    Change Password
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-red-700 hover:bg-red-600 hover:text-white"
                  >
                    Delete Account
                  </button>
                </li>
              </ul>
            </div>
          </aside>
          

          {/* MAIN CONTENT */}
          <section className="lg:col-span-3 space-y-8">
            {/* PROFILE CARD */}
            <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-8 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Profile Details
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSubmit(onSubmitProfile)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input
                    {...register("fullName")}
                    disabled={!isEditing}
                    className="mt-1 w-full rounded-xl border px-4 py-2 bg-white/70 focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    value={user.email}
                    disabled
                    className="mt-1 w-full rounded-xl border px-4 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <input
                    {...register("phone")}
                    disabled={!isEditing}
                    className="mt-1 w-full rounded-xl border px-4 py-2 bg-white/70 focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="col-span-full flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reset(user);
                        setIsEditing(false);
                      }}
                      className="px-6 py-2 bg-gray-200 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* PASSWORD */}
            {isChangingPassword && (
              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-8 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Change Password
                </h3>

                <form
                  onSubmit={handlePasswordSubmit(onSubmitPassword)}
                  className="space-y-4 max-w-md"
                >
                  <input
                    type="password"
                    placeholder="Current password"
                    {...passwordRegister("currentPassword")}
                    className="w-full rounded-xl border px-4 py-2"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}

                  <input
                    type="password"
                    placeholder="New password"
                    {...passwordRegister("newPassword")}
                    className="w-full rounded-xl border px-4 py-2"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}

                  <input
                    type="password"
                    placeholder="Confirm new password"
                    {...passwordRegister("confirmPassword")}
                    className="w-full rounded-xl border px-4 py-2"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}

                  <button className="w-full bg-indigo-600 text-white py-2 rounded-xl shadow">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </section>

          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Delete Account
                </h3>

                <p className="text-gray-600 text-sm mb-6">
                  Are you sure you want to delete your account?
                  <span className="font-semibold text-red-600">
                    {" "}
                    This action cannot be undone.
                  </span>
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

