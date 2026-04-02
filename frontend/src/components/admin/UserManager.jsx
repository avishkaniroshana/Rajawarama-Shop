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

const T = {
  bg: "#FAF7F4",
  surf: "#FFFFFF",
  bdr: "rgba(201,168,76,0.22)",
  gold: "#C9A84C",
  goldBg: "rgba(201,168,76,0.10)",
  red: "#8B1A1A",
  redBg: "rgba(139,26,26,0.07)",
  tx: "#1C1008",
  muted: "#7A6555",
  sub: "#C4B5A8",
};

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

const Field = ({ label, required, error, children }) => (
  <div>
    <label
      style={{
        display: "block",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: T.muted,
        marginBottom: 5,
        letterSpacing: "0.03em",
      }}
    >
      {label}
      {required && <span style={{ color: T.red }}> *</span>}
    </label>
    {children}
    {error && (
      <p style={{ color: T.red, fontSize: "0.72rem", marginTop: 3 }}>{error}</p>
    )}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 7,
  border: `1px solid ${T.bdr}`,
  outline: "none",
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.82rem",
  color: T.tx,
  background: T.surf,
  boxSizing: "border-box",
};

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
  const [visibleIds, setVisibleIds] = useState({});
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
      setUsers(res.data || []);
    } catch {
      toastError("Failed to load users");
    }
  };

  const applyFilters = () => {
    let r = [...users];
    if (search.trim()) {
      const l = search.toLowerCase();
      r = r.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(l) ||
          u.email?.toLowerCase().includes(l) ||
          u.phone?.toLowerCase().includes(l),
      );
    }
    if (roleFilter !== "ALL") r = r.filter((u) => u.role === roleFilter);
    if (statusFilter !== "ALL")
      r = r.filter((u) => u.deleted === (statusFilter === "DEACTIVATED"));
    setFilteredUsers(r);
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
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await api.put(`/api/admin/users/${editingUser.userId}`, payload);
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
      text: "User will be deactivated.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C9A84C",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Deactivate",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/users/soft/${userId}`);
        toastSuccess("User deactivated");
        await fetchUsers();
      } catch {
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
      confirmButtonColor: "#8B1A1A",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Forever",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/users/hard/${userId}`);
        toastSuccess("User permanently deleted");
        await fetchUsers();
      } catch {
        toastError("Delete failed");
      }
    }
  };

  const toggleIdVisibility = (id) =>
    setVisibleIds((p) => ({ ...p, [id]: !p[id] }));

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPageUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  /* stats */
  const total = users.length;
  const active = users.filter((u) => !u.deleted).length;
  const deactivated = users.filter((u) => u.deleted).length;
  const admins = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        padding: "28px 28px 60px",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div style={{ marginBottom: 22 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: T.tx,
            margin: 0,
          }}
        >
          User <span style={{ color: T.red }}>Management</span>
        </h1>
        <p
          style={{
            color: T.muted,
            fontSize: "0.82rem",
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          Create, update, deactivate or permanently remove user accounts
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))",
          gap: 12,
          marginBottom: 22,
        }}
      >
        {[
          { label: "Total Users", value: total, color: T.tx },
          { label: "Active", value: active, color: "#15803D" },
          { label: "Deactivated", value: deactivated, color: T.red },
          { label: "Admins", value: admins, color: "#3730A3" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: T.surf,
              border: `1px solid ${T.bdr}`,
              borderRadius: 10,
              padding: "14px 16px",
              boxShadow: `0 2px 0 rgba(201,168,76,0.08),0 4px 12px rgba(28,16,8,0.04)`,
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "1.9rem",
                fontWeight: 700,
                color,
                lineHeight: 1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: "0.63rem",
                color: T.muted,
                marginTop: 3,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {/* Search */}
        <div
          style={{
            position: "relative",
            flex: "1",
            minWidth: 180,
            maxWidth: 280,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: T.sub,
              fontSize: "0.82rem",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 30 }}
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto", minWidth: 120 }}
        >
          <option value="ALL">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto", minWidth: 130 }}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DEACTIVATED">Deactivated</option>
        </select>

        {/* Toggle ID column */}
        <button
          onClick={() => setShowIdColumn((c) => !c)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            border: `1px solid ${T.bdr}`,
            borderRadius: 7,
            background: T.surf,
            cursor: "pointer",
            fontSize: "0.78rem",
            color: T.muted,
            whiteSpace: "nowrap",
          }}
        >
          {showIdColumn ? <EyeOff size={14} /> : <Eye size={14} />}
          {showIdColumn ? "Hide ID" : "Show ID"}
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Add User button */}
        <button
          onClick={() => openModal()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            background: T.red,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            boxShadow: `0 2px 8px rgba(139,26,26,0.18)`,
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={15} /> Add New User
        </button>
      </div>

      <div
        style={{
          background: T.surf,
          border: `1px solid ${T.bdr}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: `0 2px 0 rgba(201,168,76,0.08),0 6px 20px rgba(28,16,8,0.04)`,
        }}
      >
        {/* scroll wrapper — ONLY horizontal scroll, no vertical clipping */}
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.78rem",
              minWidth: 720,
            }}
          >
            {/* HEAD */}
            <thead>
              <tr
                style={{
                  background: `linear-gradient(90deg,${T.goldBg},rgba(201,168,76,0.05))`,
                  borderBottom: `1px solid ${T.bdr}`,
                }}
              >
                {showIdColumn && <Th>ID</Th>}
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Role</Th>
                <Th>Created At</Th>
                <Th>Last Login</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {currentPageUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={showIdColumn ? 9 : 8}
                    style={{
                      padding: "40px 16px",
                      textAlign: "center",
                      color: T.muted,
                      fontSize: "0.85rem",
                    }}
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                currentPageUsers.map((user, idx) => (
                  <tr
                    key={user.userId}
                    style={{
                      borderBottom: `1px solid rgba(201,168,76,0.10)`,
                      background: idx % 2 === 0 ? T.surf : "#FDFBF8",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = T.goldBg)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        idx % 2 === 0 ? T.surf : "#FDFBF8")
                    }
                  >
                    {/* ID column (optional) */}
                    {showIdColumn && (
                      <Td>
                        {!visibleIds[user.userId] ? (
                          <button
                            onClick={() => toggleIdVisibility(user.userId)}
                            style={{
                              color: T.gold,
                              fontSize: "0.72rem",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Show
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleIdVisibility(user.userId)}
                              style={{
                                color: T.gold,
                                fontSize: "0.72rem",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Hide
                            </button>
                            <div
                              style={{
                                marginTop: 3,
                                wordBreak: "break-all",
                                color: T.muted,
                                fontSize: "0.68rem",
                                fontFamily: "monospace",
                                maxWidth: 140,
                              }}
                            >
                              {user.userId}
                            </div>
                          </>
                        )}
                      </Td>
                    )}

                    {/* Name */}
                    <Td>
                      <span style={{ fontWeight: 500, color: T.tx }}>
                        {user.fullName}
                      </span>
                    </Td>

                    {/* Email */}
                    <Td>
                      <span style={{ color: T.muted }}>{user.email}</span>
                    </Td>

                    {/* Phone */}
                    <Td>
                      <span style={{ color: T.muted }}>
                        {user.phone || "—"}
                      </span>
                    </Td>

                    {/* Role badge */}
                    <Td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 9px",
                          borderRadius: 40,
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          letterSpacing: "0.07em",
                          ...(user.role === "ADMIN"
                            ? {
                                background: "rgba(55,48,163,0.10)",
                                color: "#3730A3",
                                border: "1px solid rgba(55,48,163,0.22)",
                              }
                            : {
                                background: "rgba(21,128,61,0.09)",
                                color: "#15803D",
                                border: "1px solid rgba(21,128,61,0.22)",
                              }),
                        }}
                      >
                        {user.role}
                      </span>
                    </Td>

                    {/* Created At */}
                    <Td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </Td>

                    {/* Last Login */}
                    <Td>
                      {user.lastLogin ? (
                        new Date(user.lastLogin).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      ) : (
                        <span style={{ color: T.sub }}>Never</span>
                      )}
                    </Td>

                    {/* Status badge */}
                    <Td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 9px",
                          borderRadius: 40,
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          ...(user.deleted
                            ? {
                                background: T.redBg,
                                color: T.red,
                                border: `1px solid rgba(139,26,26,0.22)`,
                              }
                            : {
                                background: "rgba(21,128,61,0.09)",
                                color: "#15803D",
                                border: "1px solid rgba(21,128,61,0.22)",
                              }),
                        }}
                      >
                        {user.deleted ? "Deactivated" : "Active"}
                      </span>
                    </Td>

                    {/* Actions */}
                    <Td>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        {/* Edit */}
                        <ActionBtn
                          title="Edit"
                          bg="rgba(201,168,76,0.12)"
                          color={T.gold}
                          hoverBg="rgba(201,168,76,0.24)"
                          onClick={() => openModal(user)}
                        >
                          <Edit2 size={13} />
                        </ActionBtn>

                        {/* Soft delete */}
                        {!user.deleted && (
                          <ActionBtn
                            title="Deactivate"
                            bg="rgba(217,119,6,0.10)"
                            color="#B45309"
                            hoverBg="rgba(217,119,6,0.20)"
                            onClick={() => handleSoftDelete(user.userId)}
                          >
                            <EyeOff size={13} />
                          </ActionBtn>
                        )}

                        {/* Hard delete */}
                        <ActionBtn
                          title="Delete Forever"
                          bg={T.redBg}
                          color={T.red}
                          hoverBg="rgba(139,26,26,0.15)"
                          onClick={() => handleHardDelete(user.userId)}
                        >
                          <Trash2 size={13} />
                        </ActionBtn>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderTop: `1px solid ${T.bdr}`,
              background: "rgba(250,247,244,0.70)",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span style={{ fontSize: "0.75rem", color: T.muted }}>
              Showing{" "}
              <strong style={{ color: T.tx }}>
                {indexOfFirst + 1}–{Math.min(indexOfLast, filteredUsers.length)}
              </strong>{" "}
              of <strong style={{ color: T.tx }}>{filteredUsers.length}</strong>{" "}
              users
            </span>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <PagBtn
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                ‹ Prev
              </PagBtn>

              {/* page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - currentPage) <= 1,
                )
                .reduce((acc, n, i, arr) => {
                  if (i > 0 && n - arr[i - 1] > 1)
                    acc.push(
                      <span
                        key={`gap-${n}`}
                        style={{ color: T.sub, fontSize: "0.78rem" }}
                      >
                        …
                      </span>,
                    );
                  acc.push(
                    <PagBtn
                      key={n}
                      active={n === currentPage}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </PagBtn>,
                  );
                  return acc;
                }, [])}

              <PagBtn
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next ›
              </PagBtn>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,10,0,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 16,
          }}
        >
          <div
            style={{
              background: T.surf,
              borderRadius: 16,
              border: `1px solid ${T.bdr}`,
              boxShadow: "0 24px 64px rgba(28,10,0,0.22)",
              width: "100%",
              maxWidth: 600,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 22px",
                borderBottom: `1px solid ${T.bdr}`,
                position: "sticky",
                top: 0,
                background: T.surf,
                zIndex: 10,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: T.tx,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {editingUser ? (
                  <>
                    <Edit2 size={18} color={T.gold} /> Edit User
                  </>
                ) : (
                  <>
                    <Plus size={18} color={T.gold} /> Add New User
                  </>
                )}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.muted,
                  padding: 4,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Field
                  label="Full Name"
                  required
                  error={errors.fullName?.message}
                >
                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder="Enter full name"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Email" required error={errors.email?.message}>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="user@gmail.com"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Phone" required error={errors.phone?.message}>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="+94XXXXXXXXX or 0XXXXXXXXX"
                    style={inputStyle}
                  />
                </Field>

                <Field
                  label={`Password${editingUser ? " (blank = keep current)" : ""}`}
                  required={!editingUser}
                  error={errors.password?.message}
                >
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="Role" required error={errors.role?.message}>
                <select
                  {...register("role")}
                  style={{ ...inputStyle, width: "auto" }}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </Field>

              {/* Modal footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  paddingTop: 14,
                  borderTop: `1px solid ${T.bdr}`,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 8,
                    border: `1px solid ${T.bdr}`,
                    background: T.surf,
                    color: T.muted,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  style={{
                    padding: "9px 24px",
                    borderRadius: 8,
                    border: "none",
                    cursor: loading || isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background:
                      loading || isSubmitting
                        ? "#aaa"
                        : editingUser
                          ? "linear-gradient(135deg,#C9A84C,#E2C56A)"
                          : T.red,
                    boxShadow:
                      loading || isSubmitting
                        ? "none"
                        : "0 2px 10px rgba(139,26,26,0.22)",
                  }}
                >
                  {loading || isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving…
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

const Th = ({ children }) => (
  <th
    style={{
      padding: "10px 12px",
      textAlign: "left",
      fontSize: "0.70rem",
      fontWeight: 700,
      color: "#7A6555",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </th>
);

const Td = ({ children }) => (
  <td
    style={{
      padding: "9px 12px",
      verticalAlign: "middle",
      fontSize: "0.78rem",
      color: "#1C1008",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </td>
);

const ActionBtn = ({ children, title, bg, color, hoverBg, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        transition: "background 0.15s",
        background: hovered ? hoverBg : bg,
        color,
      }}
    >
      {children}
    </button>
  );
};

const PagBtn = ({ children, onClick, disabled, active }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "5px 10px",
        borderRadius: 6,
        fontSize: "0.75rem",
        fontWeight: active ? 700 : 400,
        border: "1px solid",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        borderColor: active ? "#8B1A1A" : "rgba(201,168,76,0.25)",
        background: active
          ? "#8B1A1A"
          : hovered && !disabled
            ? "rgba(201,168,76,0.12)"
            : "#fff",
        color: active ? "#fff" : disabled ? "#C4B5A8" : "#1C1008",
      }}
    >
      {children}
    </button>
  );
};

export default UserManager;
