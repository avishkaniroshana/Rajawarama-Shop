import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { clearAuth } from "../utils/auth";
import { toastError, toastSuccess } from "../utils/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit2,
  Lock,
  Trash2,
  X,
  Loader2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const profileSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+94|0)\d{9}$/, "Invalid phone format"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Profile Form
  const {
    register: regProfile,
    handleSubmit: submitProfile,
    reset: resetProfile,
    formState: { errors: errProfile, isSubmitting: subProfile },
  } = useForm({ resolver: zodResolver(profileSchema) });

  // Password Form
  const {
    register: regPass,
    handleSubmit: submitPass,
    reset: resetPass,
    formState: { errors: errPass, isSubmitting: subPass },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile");
        setUser(res.data);
        resetProfile(res.data);
        setError(null);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile. Please try again or sign in.");
        toastError("Session may have expired. Please sign in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (data) => {
    try {
      await api.put("/api/profile", data);
      toastSuccess("Profile updated successfully");
      setProfileModal(false);
      setUser((prev) => ({ ...prev, ...data }));
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to update profile");
    }
  };

  // ── This is the exact password logic from your previous file ──
  const handleChangePassword = async (data) => {
    try {
      await api.put("/api/profile/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword, // ← sending confirmPassword like before
      });
      toastSuccess("Password changed successfully");
      resetPass();
      setPasswordModal(false);
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to change password!");
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      await api.delete("/api/profile");
      toastSuccess("Account deleted successfully");
      clearAuth();
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="rounded-3xl p-8 max-w-md text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-6">
        <div className="backdrop-blur-xl border border-gray-700/40 rounded-3xl p-8 max-w-md text-center shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4">No profile data</h2>
          <p className="text-gray-400 mb-6">
            Please sign in to view your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/signin")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-50 to-pink-200 py-8 px-4 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header - smaller */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-left tracking-tight">
            My Profile
          </h1>
          <p className="text-gray-500 mt-2 text-base text-left ">
            Manage your personal information and account security
          </p>
        </div>

        {/* Main Profile Card - compact */}
        <div className="bg-gray-900/70 backdrop-blur-xl border border-gray-700/40 rounded-3xl shadow-2xl overflow-hidden">
          {/* Cover / Avatar - reduced height */}
          <div className="h-40 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 relative">
            <div className="absolute -bottom-14 left-6 md:left-10">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-gradient-to-br from-neutral-900 to-gray-700 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Content - tighter */}
          <div className="pt-16 px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {user.fullName}
                </h2>
                <p className="text-gray-400 mt-1">{user.email}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setProfileModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
                <button
                  onClick={() => setPasswordModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  <Lock size={16} /> Change Password
                </button>
              </div>
            </div>

            {/* Info Grid - compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-indigo-950/60 rounded-xl">
                    <User className="text-indigo-400" size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Personal Details
                  </h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Full Name
                    </label>
                    <p className="font-medium text-white">{user.fullName}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Phone Number
                    </label>
                    <p className="font-medium text-white">
                      {user.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-purple-950/60 rounded-xl">
                    <Mail className="text-purple-400" size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Account Information
                  </h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Email Address
                    </label>
                    <p className="font-medium text-white break-all">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      Member Since
                    </label>
                    <p className="font-medium text-white">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-10 pt-6 border-t border-red-900/40">
              <h3 className="text-lg font-semibold text-red-400 mb-3">
                Delete Your Account
              </h3>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-800/70 text-white rounded-xl hover:bg-red-500/60 transition shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {profileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Edit2 size={20} className="text-indigo-400" /> Edit Profile
              </h2>
              <button
                onClick={() => setProfileModal(false)}
                className="p-2 rounded-full hover:bg-gray-800 transition"
              >
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <form
              onSubmit={submitProfile(handleUpdateProfile)}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm text-gray-800 mb-2">
                  Full Name
                </label>
                <input
                  {...regProfile("fullName")}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all text-sm"
                />
                {errProfile.fullName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errProfile.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-800 mb-2">
                  Phone Number
                </label>
                <input
                  {...regProfile("phone")}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all text-sm"
                />
                {errProfile.phone && (
                  <p className="text-red-400 text-xs mt-1">
                    {errProfile.phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800 mt-4">
                <button
                  type="button"
                  onClick={() => setProfileModal(false)}
                  className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={subProfile}
                  className={`px-6 py-2.5 rounded-xl font-medium text-white shadow-lg flex items-center gap-2 transition-all text-sm ${
                    subProfile
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700"
                  }`}
                >
                  {subProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <Lock size={20} className="text-gray-300" /> Change Password
              </h2>
              <button
                onClick={() => setPasswordModal(false)}
                className="p-2 rounded-full hover:bg-gray-800 transition"
              >
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <form
              onSubmit={submitPass(handleChangePassword)}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm text-gray-800 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  {...regPass("currentPassword")}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all text-sm"
                />
                {errPass.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errPass.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-800 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  {...regPass("newPassword")}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all text-sm"
                />
                {errPass.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errPass.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-800 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...regPass("confirmPassword")}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all text-sm"
                />
                {errPass.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errPass.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-600 mt-4">
                <button
                  type="button"
                  onClick={() => setPasswordModal(false)}
                  className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-800 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={subPass}
                  className={`px-6 py-2.5 rounded-xl font-medium text-white shadow-lg flex items-center gap-2 transition-all text-sm ${
                    subPass
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-800"
                  }`}
                >
                  {subPass ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 border border-red-900/60 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-red-950/50">
            <h2 className="text-2xl font-bold text-black-800 mb-6">
              Delete Account
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete your account?{" "}
              <span className="font-semibold text-red-600">
                This action cannot be undone.{" "}
              </span>{" "}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 font-medium transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(false);
                  confirmDeleteAccount();
                }}
                className="px-6 py-3 bg-red-700 hover:bg-red-800 rounded-xl text-white font-medium shadow-lg shadow-red-900/50 transition-all hover:shadow-red-700/60 text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import { clearAuth } from "../utils/auth";
// import { toastError, toastSuccess } from "../utils/toast";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// const profileSchema = z.object({
//   fullName: z
//     .string()
//     .trim()
//     .min(1, "Full name is required!")
//     .min(3, "Full name must be at least 3 characters!"),

//   phone: z
//     .string()
//     .trim()
//     .regex(/^(?:\+94|0)\d{9}$/, "Use +94XXXXXXXXX or 0XXXXXXXXX"),
// });

// const passwordSchema = z
//   .object({
//     currentPassword: z.string().min(1, "Current password is required!"),
//     newPassword: z.string().min(8, "Password must be at least 8 characters!"),
//     confirmPassword: z.string().min(1, "Confirm your password!"),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "Passwords do not match!",
//     path: ["confirmPassword"],
//   });

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   /* ===== PROFILE FORM ===== */
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(profileSchema),
//   });

//   /* ===== PASSWORD FORM ===== */
//   const {
//     register: passwordRegister,
//     handleSubmit: handlePasswordSubmit,
//     reset: resetPassword,
//     formState: { errors: passwordErrors },
//   } = useForm({
//     resolver: zodResolver(passwordSchema),
//   });

//   /* ===== FETCH PROFILE ===== */
//   const fetchProfile = async () => {
//     try {
//       const res = await api.get("/api/profile");
//       setUser(res.data);
//       reset(res.data);
//     } catch (err) {
//       toastError("Session expired. Please sign in again.");
//       clearAuth();
//       window.location.href = "/signin";
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   /* ===== UPDATE PROFILE ===== */
//   const onSubmitProfile = async (data) => {
//     try {
//       await api.put("/api/profile", data);
//       toastSuccess("Profile updated successfully");
//       setIsEditing(false);
//       fetchProfile();
//     } catch (err) {
//       toastError(err.response?.data?.message || "Failed to update profile");
//     }
//   };

//   /* ===== CHANGE PASSWORD ===== */
//   const onSubmitPassword = async (data) => {
//     try {
//       await api.put("/api/profile/password", {
//         currentPassword: data.currentPassword,
//         newPassword: data.newPassword,
//         confirmPassword: data.confirmPassword,
//       });
//       toastSuccess("Password updated successfully");
//       resetPassword();
//       setIsChangingPassword(false);
//     } catch (err) {
//       toastError(err.response?.data?.message || "Failed to change password!");
//     }
//   };

//   /* ===== DELETE ACCOUNT ===== */
//   const handleDeleteAccount = async () => {
//     try {
//       await api.delete("/api/profile");

//       toastSuccess("Account deleted successfully");

//       clearAuth();

//       setTimeout(() => {
//         window.location.href = "/signin";
//       }, 1200);
//     } catch (error) {
//       toastError(error.response?.data?.message || "Failed to delete account");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         Loading profile...
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-100 to-gray-400">
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         {/* HEADER */}
//         <div className="mb-10 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 p-8 text-white shadow-xl hover:shadow-2xl transition-shadow">
//           <h1 className="text-3xl font-semibold">My Account</h1>
//           <p className="text-indigo-100 mt-1">
//             Manage your profile & security settings
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* SIDEBAR */}
//           <aside className="space-y-6">
//             <div className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-2xl p-6 text-center text-white shadow-lg">
//               <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center mb-4 shadow-inner">
//                 <span className="text-3xl font-bold text-white">
//                   {user.fullName?.charAt(0)}
//                 </span>
//               </div>
//               <h2 className="font-bold text-2xl text-white">{user.fullName}</h2>
//               <p className="text-xm text-white">{user.email}</p>
//             </div>

//             <div className="backdrop-blur-xl bg-black/40 border border-white/40 rounded-2xl p-5 shadow-md">
//               <p className="text-xs font-semibold mb-3 tracking-widest">
//                 NAVIGATION
//               </p>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-black hover:text-white">
//                     Profile
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/orders"
//                     className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-black hover:text-white"
//                   >
//                     Orders
//                   </a>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => setIsChangingPassword(!isChangingPassword)}
//                     className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-black hover:text-white"
//                   >
//                     Change Password
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => setShowDeleteConfirm(true)}
//                     className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-red-700 hover:bg-red-600 hover:text-white"
//                   >
//                     Delete Account
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </aside>

//           {/* MAIN CONTENT */}
//           <section className="lg:col-span-3 space-y-8">
//             {/* PROFILE CARD */}
//             <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-8 shadow-md">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Profile Details
//                 </h3>
//                 {!isEditing && (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow"
//                   >
//                     Edit Profile
//                   </button>
//                 )}
//               </div>

//               <form
//                 onSubmit={handleSubmit(onSubmitProfile)}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-6"
//               >
//                 <div>
//                   <label className="text-sm text-gray-600">Full Name</label>
//                   <input
//                     {...register("fullName")}
//                     disabled={!isEditing}
//                     className="mt-1 w-full rounded-xl border px-4 py-2 bg-white/70 focus:ring-2 focus:ring-indigo-500"
//                   />
//                   {errors.fullName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.fullName.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600">Email</label>
//                   <input
//                     value={user.email}
//                     disabled
//                     className="mt-1 w-full rounded-xl border px-4 py-2 bg-gray-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600">Phone</label>
//                   <input
//                     {...register("phone")}
//                     disabled={!isEditing}
//                     className="mt-1 w-full rounded-xl border px-4 py-2 bg-white/70 focus:ring-2 focus:ring-indigo-500"
//                   />
//                   {errors.phone && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {errors.phone.message}
//                     </p>
//                   )}
//                 </div>

//                 {isEditing && (
//                   <div className="col-span-full flex gap-4">
//                     <button
//                       type="submit"
//                       className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow"
//                     >
//                       Save Changes
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         reset(user);
//                         setIsEditing(false);
//                       }}
//                       className="px-6 py-2 bg-gray-200 rounded-xl"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </form>
//             </div>

//             {/* PASSWORD */}
//             {isChangingPassword && (
//               <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-8 shadow-md">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                   Change Password
//                 </h3>

//                 <form
//                   onSubmit={handlePasswordSubmit(onSubmitPassword)}
//                   className="space-y-4 max-w-md"
//                 >
//                   <input
//                     type="password"
//                     placeholder="Current password"
//                     {...passwordRegister("currentPassword")}
//                     className="w-full rounded-xl border px-4 py-2"
//                   />
//                   {passwordErrors.currentPassword && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {passwordErrors.currentPassword.message}
//                     </p>
//                   )}

//                   <input
//                     type="password"
//                     placeholder="New password"
//                     {...passwordRegister("newPassword")}
//                     className="w-full rounded-xl border px-4 py-2"
//                   />
//                   {passwordErrors.newPassword && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {passwordErrors.newPassword.message}
//                     </p>
//                   )}

//                   <input
//                     type="password"
//                     placeholder="Confirm new password"
//                     {...passwordRegister("confirmPassword")}
//                     className="w-full rounded-xl border px-4 py-2"
//                   />
//                   {passwordErrors.confirmPassword && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {passwordErrors.confirmPassword.message}
//                     </p>
//                   )}

//                   <button className="w-full bg-indigo-600 text-white py-2 rounded-xl shadow">
//                     Update Password
//                   </button>
//                 </form>
//               </div>
//             )}
//           </section>

//           {showDeleteConfirm && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//               <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-fade-in">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   Delete Account
//                 </h3>

//                 <p className="text-gray-600 text-sm mb-6">
//                   Are you sure you want to delete your account?
//                   <span className="font-semibold text-red-600">
//                     {" "}
//                     This action cannot be undone.
//                   </span>
//                 </p>

//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={() => setShowDeleteConfirm(false)}
//                     className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     onClick={handleDeleteAccount}
//                     className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow"
//                   >
//                     Yes, Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
