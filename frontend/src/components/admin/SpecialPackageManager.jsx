import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

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

const specialPackageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  discountPercent: z
    .number({ invalid_type_error: "Discount is required" })
    .min(0)
    .max(100)
    .optional()
    .default(0),
  weddingCoordinationIncluded: z.boolean().optional().default(false),
  weddingPackagingIncluded: z.boolean().optional().default(false),
  linkedDancingPackageId: z.string().uuid().nullable().optional(),
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

const SpecialPackageManager = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [specialItemTypes, setSpecialItemTypes] = useState([]);
  const [dancingPackages, setDancingPackages] = useState([]);
  const [dancingPerformerTypes, setDancingPerformerTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  const [selectedItems, setSelectedItems] = useState([]);
  const [freeCustomItems, setFreeCustomItems] = useState([]);
  const [freeDancingPerformerIds, setFreeDancingPerformerIds] = useState([]);
  const [previewTotal, setPreviewTotal] = useState(0);
  const [previewDiscounted, setPreviewDiscounted] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(specialPackageSchema),
    defaultValues: {
      name: "",
      discountPercent: 0,
      weddingCoordinationIncluded: false,
      weddingPackagingIncluded: false,
      linkedDancingPackageId: null,
    },
  });

  const discountPercent = watch("discountPercent") || 0;
  const weddingCoordinationIncluded = watch("weddingCoordinationIncluded");
  const weddingPackagingIncluded = watch("weddingPackagingIncluded");
  const linkedDancingPackageId = watch("linkedDancingPackageId");

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const coordinationType = specialItemTypes.find((t) =>
      t.name.toLowerCase().includes("wedding coordination"),
    );
    const packagingType = specialItemTypes.find((t) =>
      t.name.toLowerCase().includes("wedding packaging"),
    );
    let newSelectedItems = [...selectedItems];
    if (weddingCoordinationIncluded && coordinationType) {
      if (
        !newSelectedItems.some(
          (i) => i.specialItemTypeId === coordinationType.id,
        )
      )
        newSelectedItems.push({
          specialItemTypeId: coordinationType.id,
          quantity: 1,
        });
    } else if (!weddingCoordinationIncluded && coordinationType) {
      newSelectedItems = newSelectedItems.filter(
        (i) => i.specialItemTypeId !== coordinationType.id,
      );
    }
    if (weddingPackagingIncluded && packagingType) {
      if (
        !newSelectedItems.some((i) => i.specialItemTypeId === packagingType.id)
      )
        newSelectedItems.push({
          specialItemTypeId: packagingType.id,
          quantity: 1,
        });
    } else if (!weddingPackagingIncluded && packagingType) {
      newSelectedItems = newSelectedItems.filter(
        (i) => i.specialItemTypeId !== packagingType.id,
      );
    }
    setSelectedItems(newSelectedItems);
  }, [weddingCoordinationIncluded, weddingPackagingIncluded, specialItemTypes]);

  useEffect(() => {
    let total = 0;
    selectedItems.forEach((item) => {
      const type = specialItemTypes.find(
        (t) => t.id === item.specialItemTypeId,
      );
      if (type) total += item.quantity * type.pricePerUnit;
    });
    const selectedDancePkg = dancingPackages.find(
      (dp) => dp.id === linkedDancingPackageId,
    );
    if (selectedDancePkg?.totalPrice) total += selectedDancePkg.totalPrice;
    setPreviewTotal(total);
    setPreviewDiscounted(total * (1 - discountPercent / 100));
  }, [
    selectedItems,
    discountPercent,
    linkedDancingPackageId,
    specialItemTypes,
    dancingPackages,
  ]);

  const fetchAllData = async () => {
    try {
      const [pkgRes, itemRes, dancePkgRes, perfRes] = await Promise.all([
        api.get("/api/admin/special-packages"),
        api.get("/api/admin/special-item-types"),
        api.get("/api/admin/dancing-package"),
        api.get("/api/admin/dancing-performer-types"),
      ]);
      setPackages(pkgRes.data || []);
      setSpecialItemTypes(itemRes.data || []);
      setDancingPackages(dancePkgRes.data || []);
      setDancingPerformerTypes(perfRes.data || []);
    } catch {
      toastError("Failed to load required data");
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setValue("name", pkg.name);
      setValue("discountPercent", pkg.discountPercent || 0);
      setValue(
        "weddingCoordinationIncluded",
        pkg.weddingCoordinationIncluded || false,
      );
      setValue(
        "weddingPackagingIncluded",
        pkg.weddingPackagingIncluded || false,
      );
      setValue("linkedDancingPackageId", pkg.linkedDancingPackageId || null);
      setSelectedItems(
        pkg.items
          ?.filter((i) => {
            const type = specialItemTypes.find(
              (t) => t.id === i.specialItemTypeId,
            );
            return (
              type &&
              !type.name.toLowerCase().includes("wedding coordination") &&
              !type.name.toLowerCase().includes("wedding packaging")
            );
          })
          ?.map((i) => ({
            specialItemTypeId: i.specialItemTypeId,
            quantity: i.quantity,
          })) || [],
      );
      setFreeCustomItems(
        pkg.freeItems?.filter(
          (name) => !dancingPerformerTypes.some((p) => p.name === name),
        ) || [],
      );
      const freePerfIds = [];
      pkg.freeItems?.forEach((freeName) => {
        const match = dancingPerformerTypes.find((p) => p.name === freeName);
        if (match) freePerfIds.push(match.id);
      });
      setFreeDancingPerformerIds(freePerfIds);
    } else {
      setEditingPackage(null);
      reset();
      setSelectedItems([]);
      setFreeCustomItems([]);
      setFreeDancingPerformerIds([]);
    }
    setModalOpen(true);
  };

  const addPricedItem = () =>
    setSelectedItems([
      ...selectedItems,
      { specialItemTypeId: "", quantity: 1 },
    ]);
  const updatePricedItem = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = field === "quantity" ? Number(value) : value;
    setSelectedItems(newItems);
  };
  const removePricedItem = (index) =>
    setSelectedItems(selectedItems.filter((_, i) => i !== index));

  const addFreeCustom = () => setFreeCustomItems([...freeCustomItems, ""]);
  const updateFreeCustom = (index, value) => {
    const n = [...freeCustomItems];
    n[index] = value;
    setFreeCustomItems(n);
  };
  const removeFreeCustom = (index) =>
    setFreeCustomItems(freeCustomItems.filter((_, i) => i !== index));
  const toggleFreePerformer = (id) =>
    setFreeDancingPerformerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  const onSubmit = async (data) => {
    setLoading(true);
    if (selectedItems.length === 0) {
      toastError("At least one priced item is required");
      setLoading(false);
      return;
    }
    if (selectedItems.some((i) => !i.specialItemTypeId)) {
      toastError("All priced items must have a type selected");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        name: data.name.trim(),
        discountPercent: Number(data.discountPercent) || 0,
        weddingCoordinationIncluded: data.weddingCoordinationIncluded,
        weddingPackagingIncluded: data.weddingPackagingIncluded,
        linkedDancingPackageId: data.linkedDancingPackageId || null,
        items: selectedItems.map((i) => ({
          specialItemTypeId: i.specialItemTypeId,
          quantity: i.quantity,
        })),
        freeItems: freeCustomItems.filter((s) => s.trim() !== ""),
        freeDancingPerformerTypeIds: freeDancingPerformerIds,
      };
      if (editingPackage) {
        await api.put(
          `/api/admin/special-packages/${editingPackage.id}`,
          payload,
        );
        toastSuccess("Special package updated");
      } else {
        await api.post("/api/admin/special-packages", payload);
        toastSuccess("Special package created");
      }
      setModalOpen(false);
      fetchAllData();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Delete Package?",
      text: "This action cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: T.red,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/special-packages/${id}`);
        toastSuccess("Package deleted");
        fetchAllData();
      } catch {
        toastError("Delete failed");
      }
    }
  };

  const toggleIdVisibility = (id) =>
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));

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
          Special <span style={{ color: T.red }}>Packages</span>
        </h1>
        <p
          style={{
            color: T.muted,
            fontSize: "0.82rem",
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          Create premium bundles with discounts, free items & coordination
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
          gap: 12,
          marginBottom: 22,
        }}
      >
        {[
          { label: "Total Packages", value: packages.length, color: T.tx },
          {
            label: "With Discount",
            value: packages.filter((p) => p.discountPercent > 0).length,
            color: T.gold,
          },
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
        <div style={{ flex: 1 }} />
        <button
          onClick={() => navigate("/admin/special-item-types")}
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
          <Edit2 size={14} /> Manage Special Item Types
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
            letterSpacing: "0.04em",
            boxShadow: `0 2px 8px rgba(139,26,26,0.18)`,
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={15} /> Add New Special Package
        </button>
      </div>

      {/* ------------ TABLE  */}
      <div
        style={{
          background: T.surf,
          border: `1px solid ${T.bdr}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: `0 2px 0 rgba(201,168,76,0.08),0 6px 20px rgba(28,16,8,0.04)`,
        }}
      >
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.78rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: `linear-gradient(90deg,${T.goldBg},rgba(201,168,76,0.05))`,
                  borderBottom: `1px solid ${T.bdr}`,
                }}
              >
                <Th style={{ width: 130 }}>Package ID</Th>
                <Th style={{ width: 200 }}>Name</Th>
                <Th>Description</Th>
                <Th style={{ width: 140 }}>Price (LKR)</Th>
                <Th style={{ width: 100 }}>Discount %</Th>
                <Th style={{ width: 160 }}>Discounted Price</Th>
                <Th style={{ width: 110 }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px 16px",
                      textAlign: "center",
                      color: T.muted,
                      fontSize: "0.85rem",
                    }}
                  >
                    No special packages found. Add your first package above.
                  </td>
                </tr>
              ) : (
                packages.map((pkg, idx) => {
                  const priceWithoutDiscount =
                    pkg.finalPrice && pkg.discountPercent
                      ? pkg.finalPrice / (1 - pkg.discountPercent / 100)
                      : pkg.finalPrice || 0;
                  return (
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
                      <td
                        style={{
                          padding: "9px 12px",
                          verticalAlign: "middle",
                          fontSize: "0.78rem",
                        }}
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
                                marginTop: 3,
                                wordBreak: "break-all",
                                color: T.muted,
                                fontSize: "0.68rem",
                                fontFamily: "monospace",
                                maxWidth: 120,
                              }}
                            >
                              {pkg.id}
                            </div>
                          </>
                        )}
                      </td>
                      <Td>
                        <span style={{ fontWeight: 500, color: T.tx }}>
                          {pkg.name}
                        </span>
                      </Td>
                      <td
                        style={{
                          padding: "9px 12px",
                          verticalAlign: "middle",
                          fontSize: "0.75rem",
                          color: T.muted,
                          maxWidth: 300,
                          lineHeight: 1.5,
                        }}
                      >
                        {pkg.description
                          ? pkg.description.split("\n").map((line, i) => {
                              const trimmed = line.trim();
                              const isBold =
                                trimmed === "Includes:" ||
                                trimmed === "Free items:" ||
                                trimmed.startsWith("Total estimated value:");
                              return (
                                <div
                                  key={i}
                                  style={{
                                    fontWeight: isBold ? 600 : 400,
                                    color: isBold ? T.tx : T.muted,
                                  }}
                                >
                                  {trimmed.startsWith("•") ? (
                                    <span style={{ paddingLeft: 8 }}>
                                      {line}
                                    </span>
                                  ) : (
                                    trimmed
                                  )}
                                </div>
                              );
                            })
                          : "—"}
                      </td>
                      <Td>
                        <span style={{ fontWeight: 600, color: T.tx }}>
                          Rs. {priceWithoutDiscount.toLocaleString("en-LK")}
                        </span>
                      </Td>
                      <Td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 9px",
                            borderRadius: 40,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            background: T.goldBg,
                            color: T.gold,
                            border: `1px solid rgba(201,168,76,0.35)`,
                          }}
                        >
                          {pkg.discountPercent}%
                        </span>
                      </Td>
                      <Td>
                        <span style={{ fontWeight: 700, color: T.red }}>
                          Rs. {pkg.finalPrice?.toLocaleString("en-LK") || "—"}
                        </span>
                      </Td>
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
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
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------- MODAL  */}
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
              maxWidth: 780,
              maxHeight: "92vh",
              overflowY: "auto",
            }}
          >
            {/* Header */}
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
                {editingPackage ? (
                  <>
                    <Edit2 size={18} color={T.gold} /> Edit Special Package
                  </>
                ) : (
                  <>
                    <Plus size={18} color={T.gold} /> Create Special Package
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {/* Basic Info */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Field
                  label="Package Name"
                  required
                  error={errors.name?.message}
                >
                  <input
                    {...register("name")}
                    placeholder="Enter special package name"
                    style={inputStyle}
                  />
                </Field>
                <Field
                  label="Discount (%)"
                  error={errors.discountPercent?.message}
                >
                  <input
                    type="number"
                    step="0.5"
                    {...register("discountPercent", { valueAsNumber: true })}
                    placeholder="0 – 100"
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Checkboxes */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                {[
                  {
                    field: "weddingCoordinationIncluded",
                    label: "Wedding Coordination Included",
                  },
                  {
                    field: "weddingPackagingIncluded",
                    label: "Wedding Packaging Included",
                  },
                ].map(({ field, label }) => (
                  <label
                    key={field}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      border: `1px solid ${T.bdr}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      background: T.goldBg,
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: T.tx,
                    }}
                  >
                    <input
                      type="checkbox"
                      {...register(field)}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: T.red,
                        cursor: "pointer",
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* Linked Dancing Package */}
              <Field label="Link to Dancing Package (optional)">
                <select
                  {...register("linkedDancingPackageId")}
                  style={inputStyle}
                >
                  <option value="">— None —</option>
                  {dancingPackages.map((dp) => (
                    <option key={dp.id} value={dp.id}>
                      {dp.name} (Rs.{" "}
                      {dp.totalPrice?.toLocaleString("en-LK") || "—"})
                    </option>
                  ))}
                </select>
              </Field>

              {/* Priced Items */}
              <div style={{ borderTop: `1px solid ${T.bdr}`, paddingTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: T.muted,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Priced Items *
                  </span>
                  <button
                    type="button"
                    onClick={addPricedItem}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      background: T.goldBg,
                      color: T.gold,
                      border: `1px solid rgba(201,168,76,0.35)`,
                      borderRadius: 7,
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    <Plus size={13} /> Add Item
                  </button>
                </div>
                {selectedItems.length === 0 ? (
                  <p
                    style={{
                      color: T.sub,
                      fontStyle: "italic",
                      fontSize: "0.82rem",
                      textAlign: "center",
                      padding: "16px 0",
                    }}
                  >
                    Add at least one priced item — press "Add Item" above
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {selectedItems.map((item, index) => {
                      const type = specialItemTypes.find(
                        (t) => t.id === item.specialItemTypeId,
                      );
                      if (
                        type?.name
                          .toLowerCase()
                          .includes("wedding coordination") ||
                        type?.name.toLowerCase().includes("wedding packaging")
                      )
                        return null;
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-end",
                            background: T.goldBg,
                            padding: "12px 14px",
                            borderRadius: 10,
                            border: `1px solid ${T.bdr}`,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <label
                              style={{
                                display: "block",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                color: T.muted,
                                marginBottom: 4,
                              }}
                            >
                              Item Type
                            </label>
                            <select
                              value={item.specialItemTypeId}
                              onChange={(e) =>
                                updatePricedItem(
                                  index,
                                  "specialItemTypeId",
                                  e.target.value,
                                )
                              }
                              style={inputStyle}
                            >
                              <option value="">Select item type…</option>
                              {specialItemTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name} – Rs.{" "}
                                  {t.pricePerUnit?.toLocaleString("en-LK")}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div style={{ width: 100 }}>
                            <label
                              style={{
                                display: "block",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                color: T.muted,
                                marginBottom: 4,
                              }}
                            >
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updatePricedItem(
                                  index,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                              style={{ ...inputStyle, textAlign: "center" }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePricedItem(index)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              border: "none",
                              background: T.redBg,
                              color: T.red,
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Live Preview */}
              <div
                style={{
                  background: T.goldBg,
                  border: `1px solid ${T.bdr}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: T.muted,
                    margin: "0 0 10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Live Preview (before save)
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      background: T.surf,
                      borderRadius: 8,
                      padding: "12px 14px",
                      border: `1px solid ${T.bdr}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: T.muted,
                        margin: "0 0 4px",
                      }}
                    >
                      Price (Without Discount)
                    </p>
                    <p
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: T.tx,
                        margin: 0,
                        fontFamily: "'Cormorant Garamond',serif",
                      }}
                    >
                      Rs. {previewTotal.toLocaleString("en-LK")}
                    </p>
                  </div>
                  <div
                    style={{
                      background: T.surf,
                      borderRadius: 8,
                      padding: "12px 14px",
                      border: `1px solid ${T.bdr}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: T.muted,
                        margin: "0 0 4px",
                      }}
                    >
                      Total Price (With {discountPercent}% Discount)
                    </p>
                    <p
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: T.red,
                        margin: 0,
                        fontFamily: "'Cormorant Garamond',serif",
                      }}
                    >
                      Rs. {previewDiscounted.toLocaleString("en-LK")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Free Items */}
              <div
                style={{
                  borderTop: `1px solid ${T.bdr}`,
                  paddingTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: T.muted,
                    margin: 0,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Free Items (Optional)
                </p>

                {/* Custom Free Items */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: "0.78rem", color: T.muted }}>
                      Custom Free Items
                    </span>
                    <button
                      type="button"
                      onClick={addFreeCustom}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        background: T.greenBg,
                        color: T.green,
                        border: `1px solid rgba(21,128,61,0.25)`,
                        borderRadius: 7,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      <Plus size={13} /> Add Custom
                    </button>
                  </div>
                  {freeCustomItems.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {freeCustomItems.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateFreeCustom(idx, e.target.value)
                            }
                            placeholder="e.g. Traditional oil lamp"
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <button
                            type="button"
                            onClick={() => removeFreeCustom(idx)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              border: "none",
                              background: T.redBg,
                              color: T.red,
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Free Dancing Performers */}
                <div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: T.muted,
                      margin: "0 0 10px",
                    }}
                  >
                    Free Dancing Performer Types
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(260px,1fr))",
                      gap: 8,
                      maxHeight: 200,
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {dancingPerformerTypes.map((perf) => (
                      <label
                        key={perf.id}
                        onClick={() => toggleFreePerformer(perf.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: `1px solid ${freeDancingPerformerIds.includes(perf.id) ? T.gold : T.bdr}`,
                          background: freeDancingPerformerIds.includes(perf.id)
                            ? T.goldBg
                            : T.surf,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={freeDancingPerformerIds.includes(perf.id)}
                          onChange={() => {}}
                          style={{
                            width: 15,
                            height: 15,
                            accentColor: T.red,
                            cursor: "pointer",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontWeight: 500,
                              fontSize: "0.78rem",
                              color: T.tx,
                            }}
                          >
                            {perf.name}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: T.muted }}>
                            Rs. {perf.pricePerUnit?.toLocaleString("en-LK")} ·
                            Max: {perf.maxAvailable}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
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
                  type="button"
                  onClick={() => {
                    reset();
                    setSelectedItems([]);
                    setFreeCustomItems([]);
                    setFreeDancingPerformerIds([]);
                    setValue("name", "");
                    setValue("discountPercent", 0);
                    setValue("weddingCoordinationIncluded", false);
                    setValue("weddingPackagingIncluded", false);
                    setValue("linkedDancingPackageId", null);
                  }}
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
                  Clear
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
                        : editingPackage
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
                  ) : editingPackage ? (
                    "Update Package"
                  ) : (
                    "Create Package"
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

const Th = ({ children, style }) => (
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
      ...style,
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

export default SpecialPackageManager;


