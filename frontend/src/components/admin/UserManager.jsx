import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2, Plus, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Zod schema
const userSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^(?:\+94|0)\d{9}$/, "Use +94XXXXXXXXX or 0XXXXXXXXX"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Per-row ID visibility state
  const [visibleIds, setVisibleIds] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      const data = res.data || [];
      setUsers(data);
      applyFilters();
    } catch (err) {
      toastError("Failed to load users");
    }
  };

  const applyFilters = () => {
    let result = [...users];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(lower) ||
          u.email?.toLowerCase().includes(lower) ||
          u.phone?.toLowerCase().includes(lower),
      );
    }

    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter !== "ALL") {
      const isDeactivated = statusFilter === "DEACTIVATED";
      result = result.filter((u) => u.deleted === isDeactivated);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setValue("fullName", user.fullName || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("password", "");
      setValue("role", user.role || "CUSTOMER");
    } else {
      setEditingUser(null);
      reset();
    }
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingUser) {
        const updateData = { ...data };
        if (!updateData.password) delete updateData.password;
        await api.put(`/api/admin/users/${editingUser.userId}`, updateData);
        toastSuccess("User updated successfully");
      } else {
        await api.post("/api/admin/users", data);
        toastSuccess("User created successfully");
      }
      setModalOpen(false);
      await fetchUsers();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (userId) => {
    const result = await MySwal.fire({
      title: "Soft Delete?",
      text: "User will be deactivated (can be restored later).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Deactivate",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/users/soft/${userId}`);
        toastSuccess("User deactivated");
        await fetchUsers();
      } catch (err) {
        toastError("Soft delete failed");
      }
    }
  };

  const handleHardDelete = async (userId) => {
    const result = await MySwal.fire({
      title: "Permanent Delete?",
      text: "This cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Forever",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/users/hard/${userId}`);
        toastSuccess("User permanently deleted");
        await fetchUsers();
      } catch (err) {
        toastError("Hard delete failed");
      }
    }
  };

  const toggleIdVisibility = (id) => {
    setVisibleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Pagination slice
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPageUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            User Management
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Create, update, deactivate or permanently remove user accounts
          </p>
          <br />
          <button
            onClick={() => openModal()}
            className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-lg hover:bg-gray-900 hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
          >
            <Plus size={20} /> Add New User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Available Users List
        </h3>

        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search name, email, phone..."
            className="px-6 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none bg-white/80 shadow-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-6 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none bg-white/80 shadow-sm"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none bg-white/80 shadow-sm"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>

          <button
            onClick={() => setShowIdColumn(!showIdColumn)}
            className="flex items-center gap-2 px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl hover:bg-gray-50 transition shadow-sm"
          >
            {showIdColumn ? <EyeOff size={18} /> : <Eye size={18} />}
            {showIdColumn ? "Hide ID" : "Show ID"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                {showIdColumn && (
                  <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                )}
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Last Login
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentPageUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={showIdColumn ? 9 : 8}
                    className="px-8 py-16 text-center text-gray-600 text-lg font-medium"
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                currentPageUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-indigo-50/50 transition-colors duration-200"
                  >
                    {showIdColumn && (
                      <td className="px-8 py-6 text-gray-600 font-mono text-sm">
                        {!visibleIds[user.userId] ? (
                          <button
                            onClick={() => toggleIdVisibility(user.userId)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                          >
                            Show ID
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleIdVisibility(user.userId)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                            >
                              Hide ID
                            </button>
                            <div className="mt-2 break-all text-gray-500 text-xs">
                              {user.userId}
                            </div>
                          </>
                        )}
                      </td>
                    )}
                    <td className="px-8 py-6">{user.fullName}</td>
                    <td className="px-8 py-6">{user.email}</td>
                    <td className="px-8 py-6">{user.phone || "—"}</td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-600 text-sm">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-8 py-6 text-gray-600 text-sm">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-8 py-6">
                      {user.deleted ? (
                        <span className="text-red-600 font-medium">
                          Deactivated
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <button
                          onClick={() => openModal(user)}
                          className="p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition shadow-sm"
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        {!user.deleted && (
                          <button
                            onClick={() => handleSoftDelete(user.userId)}
                            className="p-3 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition shadow-sm"
                            title="Deactivate (Soft Delete)"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleHardDelete(user.userId)}
                          className="p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm"
                          title="Permanent Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Previous
          </button>

          <span className="text-lg font-medium text-gray-700">
            Page {currentPage} of{" "}
            {Math.ceil(filteredUsers.length / itemsPerPage)}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, Math.ceil(filteredUsers.length / itemsPerPage)),
              )
            }
            disabled={
              currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
            }
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {editingUser ? (
                  <>
                    <Edit2 size={24} className="text-indigo-600" /> Edit User
                  </>
                ) : (
                  <>
                    <Plus size={24} className="text-indigo-600" /> Add New User
                  </>
                )}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X size={24} className="text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-8 py-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="Enter user's name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="user@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="+94XXXXXXXXX or 0XXXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password{" "}
                    {editingUser ? "(leave blank to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                    placeholder="********"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("role")}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-5 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-10 py-3.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className={`px-12 py-3.5 rounded-xl font-semibold text-white shadow-xl flex items-center gap-3 transition-all ${
                    loading || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : editingUser
                        ? "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-600 hover:shadow-2xl"
                        : "bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 hover:shadow-2xl"
                  }`}
                >
                  {loading || isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : editingUser ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;


