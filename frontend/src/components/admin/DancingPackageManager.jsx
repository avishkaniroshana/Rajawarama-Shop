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

const DancingPackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [performerTypes, setPerformerTypes] = useState([]);
  const [selectedPerformers, setSelectedPerformers] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({}); // ← Added for Show/Hide ID

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
        initial[p.id] = p.quantity || 1;
      });
      setSelectedPerformers(initial);
    } else {
      setEditingPackage(null);
      reset();
      setSelectedPerformers({});
    }
    setModalOpen(true);
  };

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
        return;
      }

      const payload = { name: data.name, performers };

      if (editingPackage) {
        await api.put(
          `/api/admin/dancing-package/${editingPackage.id}`,
          payload,
        );
        toastSuccess("Package updated successfully");
      } else {
        await api.post("/api/admin/dancing-package", payload);
        toastSuccess("Package created successfully");
      }

      setModalOpen(false);
      setSelectedPerformers({});
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

  // Show/Hide ID Function
  const toggleIdVisibility = (id) =>
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedCount = Object.keys(selectedPerformers).length;

  const calculatePreviewTotal = () =>
    Object.entries(selectedPerformers).reduce((sum, [id, qty]) => {
      const type = performerTypes.find((t) => t.id === id);
      return sum + (type ? qty * (type.pricePerUnit || 0) : 0);
    }, 0);

  // Format Details for Table (Full nice display)
  const formatPackageDetails = (pkg) => {
    if (!pkg.includedPerformers || pkg.includedPerformers.length === 0) {
      return <span style={{ color: T.muted }}>—</span>;
    }

    return (
      <div style={{ fontSize: "0.78rem", lineHeight: "1.6" }}>
        <strong style={{ color: T.tx }}>Package includes:</strong>
        <br />
        {pkg.includedPerformers.map((p, index) => {
          const type =
            performerTypes.find((t) => t.id === p.performerTypeId) || p;
          return (
            <div key={index} style={{ margin: "4px 0" }}>
              • {p.quantity} × {type.name}
              <span style={{ color: T.muted }}>
                {" "}
                (Rs. {type.pricePerUnit?.toLocaleString("en-LK") || "0"} each)
              </span>
            </div>
          );
        })}
        <div
          style={{
            marginTop: "12px",
            paddingTop: "8px",
            borderTop: `1px solid ${T.bdr}`,
          }}
        >
          <strong style={{ color: T.tx }}>Total estimated value: </strong>
          <span style={{ color: T.red, fontWeight: 700, fontSize: "1rem" }}>
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

      {/* Modal - Keep your existing modal or improve it later */}
      {/* ... Your modal code remains the same ... */}
    </div>
  );
};

// Helper to format full details
const formatPackageDetails = (pkg) => {
  if (!pkg.includedPerformers || pkg.includedPerformers.length === 0) {
    return <span style={{ color: T.muted }}>—</span>;
  }

  return (
    <div style={{ fontSize: "0.78rem", lineHeight: "1.6" }}>
      <strong style={{ color: T.tx }}>Package includes:</strong>
      <br />
      {pkg.includedPerformers.map((p, index) => {
        const type =
          performerTypes.find((t) => t.id === p.performerTypeId) || p;
        return (
          <div key={index} style={{ margin: "4px 0" }}>
            • {p.quantity} × {type.name}
            <span style={{ color: T.muted }}>
              {" "}
              (Rs. {type.pricePerUnit?.toLocaleString("en-LK") || "0"} each)
            </span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: "12px",
          paddingTop: "8px",
          borderTop: `1px solid ${T.bdr}`,
        }}
      >
        <strong style={{ color: T.tx }}>Total estimated value: </strong>
        <span style={{ color: T.red, fontWeight: 700, fontSize: "1rem" }}>
          Rs. {pkg.totalPrice?.toLocaleString("en-LK") || "0"}
        </span>
      </div>
    </div>
  );
};

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

const Td = ({ children }) => (
  <td style={{ padding: "12px 14px", verticalAlign: "top" }}>{children}</td>
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

export default DancingPackageManager;
