import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2, Plus, X, Loader2, Minus } from "lucide-react";
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
  green: "#15803D",
  greenBg: "rgba(21,128,61,0.09)",
};

const dancingPackageSchema = z.object({
  name: z.string().min(1, "Package name is required!"),
  details: z.string().optional(),
});

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

const Th = ({ children }) => (
  <th
    style={{
      padding: "12px 14px",
      textAlign: "left",
      fontSize: "0.70rem",
      fontWeight: 700,
      color: "#7A6555",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </th>
);

const ActionBtn = ({ children, title, bg, color, hoverBg, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30,
        height: 30,
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: hovered ? hoverBg : bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
};

const DancingPackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [performerTypes, setPerformerTypes] = useState([]);
  const [selectedPerformers, setSelectedPerformers] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dancingPackageSchema),
    defaultValues: { name: "", details: "" },
  });

  useEffect(() => {
    fetchPackages();
    fetchPerformerTypes();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/api/admin/dancing-package");
      setPackages(res.data || []);
    } catch {
      toastError("Failed to load dancing packages");
    }
  };

  const fetchPerformerTypes = async () => {
    try {
      const res = await api.get("/api/admin/dancing-performer-types");
      setPerformerTypes(res.data || []);
    } catch {
      toastError("Failed to load performer types");
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setValue("name", pkg.name || "");
      setValue("details", pkg.details || "");
      const initial = {};
      pkg.includedPerformers?.forEach((p) => {
        initial[p.performerTypeId || p.id] = p.quantity || 1;
      });
      setSelectedPerformers(initial);
    } else {
      setEditingPackage(null);
      reset();
      setSelectedPerformers({});
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPackage(null);
    reset();
    setSelectedPerformers({});
  };

  // FIX: togglePerformer uses type="button" so it won't submit the form
  const togglePerformer = (id) => {
    setSelectedPerformers((prev) => {
      if (prev[id]) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: 1 };
    });
  };

  const changeQuantity = (id, delta) => {
    setSelectedPerformers((prev) => {
      const current = prev[id] || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const performers = Object.entries(selectedPerformers)
        .filter(([_, qty]) => qty > 0)
        .map(([id, quantity]) => ({ performerTypeId: id, quantity }));

      if (performers.length === 0) {
        toastError("Please select at least one performer");
        setLoading(false);
        return;
      }

      const payload = { name: data.name, performers };

      if (editingPackage) {
        await api.put(`/api/admin/dancing-package/${editingPackage.id}`, payload);
        toastSuccess("Package updated successfully");
      } else {
        await api.post("/api/admin/dancing-package", payload);
        toastSuccess("Package created successfully");
      }

      closeModal();
      fetchPackages();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Permanent Delete?",
      text: "This will permanently delete the package!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: T.red,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Forever",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/dancing-package/${id}`);
        toastSuccess("Package deleted");
        fetchPackages();
      } catch {
        toastError("Failed to delete package");
      }
    }
  };

  const toggleIdVisibility = (id) =>
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const calculatePreviewTotal = () =>
    Object.entries(selectedPerformers).reduce((sum, [id, qty]) => {
      const type = performerTypes.find((t) => t.id === id);
      return sum + (type ? qty * (type.pricePerUnit || 0) : 0);
    }, 0);

  // Full details display for table
  const formatPackageDetails = (pkg) => {
    if (!pkg.includedPerformers || pkg.includedPerformers.length === 0) {
      return <span style={{ color: T.muted }}>—</span>;
    }
    return (
      <div style={{ fontSize: "0.78rem", lineHeight: "1.6" }}>
        <strong style={{ color: T.tx, display: "block", marginBottom: 4 }}>
          Package includes:
        </strong>
        {pkg.includedPerformers.map((p, index) => {
          const type =
            performerTypes.find((t) => t.id === (p.performerTypeId || p.id)) ||
            p;
          return (
            <div
              key={index}
              style={{
                margin: "3px 0",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: T.goldBg,
                  color: T.gold,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {p.quantity}
              </span>
              <span style={{ color: T.tx, fontWeight: 500 }}>
                {type.name || "Unknown"}
              </span>
              <span style={{ color: T.muted, fontSize: "0.72rem" }}>
                @ Rs.{" "}
                {type.pricePerUnit?.toLocaleString("en-LK") || "0"} each
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  color: T.tx,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                Rs.{" "}
                {((p.quantity || 0) * (type.pricePerUnit || 0)).toLocaleString(
                  "en-LK"
                )}
              </span>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 10,
            paddingTop: 8,
            borderTop: `1px solid ${T.bdr}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong style={{ color: T.muted, fontSize: "0.73rem" }}>
            TOTAL ESTIMATED VALUE
          </strong>
          <span
            style={{ color: T.red, fontWeight: 700, fontSize: "0.95rem" }}
          >
            Rs. {pkg.totalPrice?.toLocaleString("en-LK") || "0"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        padding: "28px 28px 60px",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* Header */}
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
          Dancing Group <span style={{ color: T.red }}>Packages</span>
        </h1>
        <p style={{ color: T.muted, fontSize: "0.82rem", marginTop: 4 }}>
          Manage Traditional Dance Group Packages for Events
        </p>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1 }} />
        <button
          type="button"
          onClick={() =>
            (window.location.href = "/admin/dancing-performer-types")
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 16px",
            background: T.surf,
            color: T.muted,
            border: `1px solid ${T.bdr}`,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 500,
          }}
        >
          <Edit2 size={14} /> Manage Performer Unit Prices
        </button>
        <button
          type="button"
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
            boxShadow: `0 2px 8px rgba(139,26,26,0.18)`,
          }}
        >
          <Plus size={15} /> Add New Package
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: T.surf,
          border: `1px solid ${T.bdr}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: `0 2px 0 rgba(201,168,76,0.08),0 6px 20px rgba(28,16,8,0.04)`,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.78rem",
              minWidth: 800,
            }}
          >
            <thead>
              <tr
                style={{
                  background: `linear-gradient(90deg,${T.goldBg},rgba(201,168,76,0.05))`,
                  borderBottom: `1px solid ${T.bdr}`,
                }}
              >
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Total Price (LKR)</Th>
                <Th>Details</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "50px 20px",
                      textAlign: "center",
                      color: T.muted,
                    }}
                  >
                    No dancing packages found. Add your first package above.
                  </td>
                </tr>
              ) : (
                packages.map((pkg, idx) => (
                  <tr
                    key={pkg.id}
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
                    {/* Show/Hide ID Column */}
                    <td
                      style={{ padding: "12px 14px", verticalAlign: "middle" }}
                    >
                      {!visibleIds[pkg.id] ? (
                        <button
                          type="button"
                          onClick={() => toggleIdVisibility(pkg.id)}
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
                            type="button"
                            onClick={() => toggleIdVisibility(pkg.id)}
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
                              marginTop: 4,
                              wordBreak: "break-all",
                              color: T.muted,
                              fontSize: "0.68rem",
                              fontFamily: "monospace",
                            }}
                          >
                            {pkg.id}
                          </div>
                        </>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <strong style={{ color: T.tx }}>{pkg.name}</strong>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontWeight: 700, color: T.red }}>
                        Rs. {pkg.totalPrice?.toLocaleString("en-LK") || "0"}
                      </span>
                    </td>
                    {/* Full Details Column */}
                    <td style={{ padding: "12px 14px", maxWidth: "420px" }}>
                      {formatPackageDetails(pkg)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <ActionBtn
                          title="Edit"
                          bg="rgba(201,168,76,0.12)"
                          color={T.gold}
                          hoverBg="rgba(201,168,76,0.24)"
                          onClick={() => openModal(pkg)}
                        >
                          <Edit2 size={13} />
                        </ActionBtn>
                        <ActionBtn
                          title="Delete"
                          bg={T.redBg}
                          color={T.red}
                          hoverBg="rgba(139,26,26,0.15)"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <Trash2 size={13} />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== MODAL ===================== */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(28,16,8,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              background: T.surf,
              borderRadius: 14,
              width: "100%",
              maxWidth: 580,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: `0 8px 40px rgba(28,16,8,0.18)`,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 22px 14px",
                borderBottom: `1px solid ${T.bdr}`,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: T.tx,
                  margin: 0,
                }}
              >
                {editingPackage ? "Edit Package" : "Add New Package"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                  borderRadius: 6,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body — form wraps only the name field & submit */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}
              >
                {/* Package Name */}
                <Field label="Package Name" required error={errors.name?.message}>
                  <input
                    {...register("name")}
                    placeholder="e.g. Premium Dance Show"
                    style={inputStyle}
                  />
                </Field>

                {/* Performer Types Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: T.muted,
                      marginBottom: 10,
                      letterSpacing: "0.03em",
                    }}
                  >
                    Select Performers <span style={{ color: T.red }}>*</span>
                  </label>

                  {performerTypes.length === 0 ? (
                    <p style={{ color: T.muted, fontSize: "0.82rem" }}>
                      No performer types found. Please add performer types first.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        border: `1px solid ${T.bdr}`,
                        borderRadius: 8,
                        padding: 12,
                        background: T.bg,
                      }}
                    >
                      {performerTypes.map((type) => {
                        const isSelected = !!selectedPerformers[type.id];
                        const qty = selectedPerformers[type.id] || 0;
                        return (
                          <div
                            key={type.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 12px",
                              borderRadius: 8,
                              border: `1px solid ${isSelected ? T.gold : T.bdr}`,
                              background: isSelected ? T.goldBg : T.surf,
                              transition: "all 0.15s",
                              gap: 10,
                            }}
                          >
                            {/* Left: checkbox + name + price */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                flex: 1,
                                minWidth: 0,
                              }}
                            >
                              {/* FIX: type="button" prevents form submit */}
                              <button
                                type="button"
                                onClick={() => togglePerformer(type.id)}
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: 4,
                                  border: `2px solid ${isSelected ? T.gold : T.sub}`,
                                  background: isSelected ? T.gold : "transparent",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                  transition: "all 0.15s",
                                }}
                              >
                                {isSelected && (
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                  >
                                    <path
                                      d="M2 5l2.5 2.5L8 3"
                                      stroke="#fff"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </button>
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    color: T.tx,
                                    fontSize: "0.82rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {type.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.72rem",
                                    color: T.muted,
                                  }}
                                >
                                  Rs.{" "}
                                  {type.pricePerUnit?.toLocaleString("en-LK") ||
                                    "0"}{" "}
                                  / unit
                                </div>
                              </div>
                            </div>

                            {/* Right: quantity controls (only if selected) */}
                            {isSelected && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  flexShrink: 0,
                                }}
                              >
                                {/* FIX: type="button" prevents form submit */}
                                <button
                                  type="button"
                                  onClick={() => changeQuantity(type.id, -1)}
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 6,
                                    border: `1px solid ${T.bdr}`,
                                    background: T.surf,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: T.muted,
                                  }}
                                >
                                  <Minus size={12} />
                                </button>
                                <span
                                  style={{
                                    minWidth: 28,
                                    textAlign: "center",
                                    fontWeight: 700,
                                    color: T.tx,
                                    fontSize: "0.88rem",
                                  }}
                                >
                                  {qty}
                                </span>
                                {/* FIX: type="button" prevents form submit */}
                                <button
                                  type="button"
                                  onClick={() => changeQuantity(type.id, 1)}
                                  style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: 6,
                                    border: `1px solid ${T.bdr}`,
                                    background: T.surf,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: T.gold,
                                  }}
                                >
                                  <Plus size={12} />
                                </button>
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    color: T.red,
                                    fontWeight: 600,
                                    minWidth: 80,
                                    textAlign: "right",
                                  }}
                                >
                                  Rs.{" "}
                                  {(
                                    qty * (type.pricePerUnit || 0)
                                  ).toLocaleString("en-LK")}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Preview Total */}
                {Object.keys(selectedPerformers).length > 0 && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: T.redBg,
                      borderRadius: 8,
                      border: `1px solid rgba(139,26,26,0.15)`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: T.muted,
                      }}
                    >
                      Estimated Package Total
                    </span>
                    <span
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: T.red,
                      }}
                    >
                      Rs. {calculatePreviewTotal().toLocaleString("en-LK")}
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "14px 22px 18px",
                  borderTop: `1px solid ${T.bdr}`,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 8,
                    border: `1px solid ${T.bdr}`,
                    background: T.surf,
                    color: T.muted,
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                {/* This is the ONLY submit button */}
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  style={{
                    padding: "9px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: loading || isSubmitting ? T.sub : T.red,
                    color: "#fff",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: loading || isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    boxShadow: `0 2px 8px rgba(139,26,26,0.18)`,
                    transition: "background 0.15s",
                  }}
                >
                  {(loading || isSubmitting) && <Loader2 size={14} className="animate-spin" />}
                  {editingPackage ? "Update Package" : "Save Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DancingPackageManager;

