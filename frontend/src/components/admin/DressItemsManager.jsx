import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Edit2, Trash2, Plus, Upload, X, Loader2 } from "lucide-react";

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

const Field = ({ label, required, children }) => (
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
  </div>
);

const DressItemsManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [visibleIds, setVisibleIds] = useState({});
  const [formData, setFormData] = useState({
    dressName: "",
    description: "",
    quantityAdult: "",
    quantityPageBoys: "",
    categoryId: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/admin/dress-items");
      setItems(res.data || []);
      setCurrentPage(1);
    } catch {
      toastError("Failed to load dress items");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data || []);
    } catch {
      toastError("Failed to load categories");
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        dressName: item.dressItemName || "",
        description: item.description || "",
        quantityAdult: item.quantityAdult || "",
        quantityPageBoys: item.quantityPageBoys || "",
        categoryId: item.categoryId || "",
      });
      setImagePreview(item.imagePath || null);
    } else {
      setEditingItem(null);
      setFormData({
        dressName: "",
        description: "",
        quantityAdult: "",
        quantityPageBoys: "",
        categoryId: "",
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dressName.trim() || !formData.categoryId) {
      toastError("Dress name and category are required");
      return;
    }
    try {
      setLoading(true);
      const payload = new FormData();
      const requestJson = {
        dressItemName: formData.dressName,
        description: formData.description || "",
        quantityAdult: formData.quantityAdult
          ? Number(formData.quantityAdult)
          : 0,
        quantityPageBoys: formData.quantityPageBoys
          ? Number(formData.quantityPageBoys)
          : 0,
        categoryId: formData.categoryId,
      };
      payload.append(
        "request",
        new Blob([JSON.stringify(requestJson)], { type: "application/json" }),
      );
      if (imageFile) payload.append("image", imageFile);

      if (editingItem) {
        await api.put(
          `/api/admin/dress-items/${editingItem.dressItemId}`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        toastSuccess("Dress item updated successfully");
      } else {
        await api.post("/api/admin/dress-items", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toastSuccess("Dress item created successfully");
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to save dress item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Delete Dress Item?",
      text: "This action cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: T.red,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/dress-items/${id}`);
        toastSuccess("Dress item deleted successfully");
        fetchItems();
      } catch {
        toastError("Delete failed");
      }
    }
  };

  const filteredItems = filterCategory
    ? items.filter((item) => item.categoryId === filterCategory)
    : items;
  const toggleIdVisibility = (id) =>
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPageItems = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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
          Dress Items <span style={{ color: T.red }}>Management</span>
        </h1>
        <p
          style={{
            color: T.muted,
            fontSize: "0.82rem",
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          Add, update, delete and organize your traditional Dress-Items
          collection
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
          { label: "Total Items", value: items.length, color: T.tx },
          { label: "Categories", value: categories.length, color: "#3730A3" },
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
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ ...inputStyle, width: "auto", minWidth: 180 }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>
        <div style={{ flex: 1 }} />
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
          <Plus size={15} /> Add New Dress Item
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
        <div style={{ overflowX: "auto", width: "100%" }}>
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
                <Th>Image</Th>
                <Th>Dress Name</Th>
                <Th>Description</Th>
                <Th>Adults</Th>
                <Th>Page Boys</Th>
                <Th>Category</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "40px 16px",
                      textAlign: "center",
                      color: T.muted,
                      fontSize: "0.85rem",
                    }}
                  >
                    {filteredItems.length === 0
                      ? "No dress items found. Add your first item above."
                      : "No items on this page."}
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item, idx) => (
                  <tr
                    key={item.dressItemId}
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
                    <Td>
                      {!visibleIds[item.dressItemId] ? (
                        <button
                          onClick={() => toggleIdVisibility(item.dressItemId)}
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
                            onClick={() => toggleIdVisibility(item.dressItemId)}
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
                            {item.dressItemId}
                          </div>
                        </>
                      )}
                    </Td>
                    <td
                      style={{ padding: "9px 12px", verticalAlign: "middle" }}
                    >
                      {item.imagePath ? (
                        <img
                          src={
                            item.imagePath.startsWith("http")
                              ? item.imagePath
                              : `${api.defaults.baseURL ?? ""}${item.imagePath}`
                          }
                          alt={item.dressItemName}
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: `1px solid ${T.bdr}`,
                          }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23F2EDE6'/%3E%3Ctext x='24' y='27' text-anchor='middle' font-size='8' font-family='Arial' fill='%23C4B5A8'%3ENo Img%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            background: T.goldBg,
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.6rem",
                            color: T.sub,
                            border: `1px solid ${T.bdr}`,
                          }}
                        >
                          No Img
                        </div>
                      )}
                    </td>
                    <Td>
                      <span style={{ fontWeight: 500, color: T.tx }}>
                        {item.dressItemName}
                      </span>
                    </Td>
                    <Td>
                      <span
                        style={{
                          color: T.muted,
                          maxWidth: 160,
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.description || "—"}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ color: T.tx }}>
                        {item.quantityAdult || 0}
                      </span>
                    </Td>
                    <Td>
                      <span style={{ color: T.tx }}>
                        {item.quantityPageBoys || 0}
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
                          background: "rgba(55,48,163,0.10)",
                          color: "#3730A3",
                          border: "1px solid rgba(55,48,163,0.22)",
                        }}
                      >
                        {item.categoryName || "Uncategorized"}
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
                          onClick={() => openModal(item)}
                        >
                          <Edit2 size={13} />
                        </ActionBtn>
                        <ActionBtn
                          title="Delete"
                          bg={T.redBg}
                          color={T.red}
                          hoverBg="rgba(139,26,26,0.15)"
                          onClick={() => handleDelete(item.dressItemId)}
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

        {filteredItems.length > 0 && (
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
                {indexOfFirst + 1}–{Math.min(indexOfLast, filteredItems.length)}
              </strong>{" "}
              of <strong style={{ color: T.tx }}>{filteredItems.length}</strong>{" "}
              items
            </span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <PagBtn
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                ‹ Prev
              </PagBtn>
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
                        key={`g-${n}`}
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
              maxWidth: 680,
              maxHeight: "95vh",
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
                {editingItem ? (
                  <>
                    <Edit2 size={18} color={T.gold} /> Edit Dress Item
                  </>
                ) : (
                  <>
                    <Plus size={18} color={T.gold} /> Add New Dress Item
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
              onSubmit={handleSubmit}
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Row 1: Name + Category */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Dress Name" required>
                  <input
                    type="text"
                    value={formData.dressName}
                    onChange={(e) =>
                      setFormData({ ...formData, dressName: e.target.value })
                    }
                    placeholder="e.g. Kandyan Royal Bridal Saree"
                    style={inputStyle}
                    required
                  />
                </Field>
                <Field label="Category" required>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    style={inputStyle}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Row 2: Description */}
              <Field label="Description">
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Detailed description of the dress..."
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
                />
              </Field>

              {/* Row 3: Quantities */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <Field label="Quantity (Adults)">
                  <input
                    type="number"
                    min="0"
                    value={formData.quantityAdult}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantityAdult: e.target.value,
                      })
                    }
                    placeholder="0"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Quantity (Page Boys)">
                  <input
                    type="number"
                    min="0"
                    value={formData.quantityPageBoys}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantityPageBoys: e.target.value,
                      })
                    }
                    placeholder="0"
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Row 4: Image + Buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  alignItems: "start",
                }}
              >
                {/* Image Upload */}
                <Field label="Dress Image" required>
                  <div style={{ position: "relative" }}>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: 180,
                        border: `2px dashed ${T.bdr}`,
                        borderRadius: 10,
                        cursor: "pointer",
                        background: T.goldBg,
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                      }}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: "center", padding: 16 }}>
                          <Upload
                            size={24}
                            style={{ color: T.sub, margin: "0 auto 8px" }}
                          />
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.78rem",
                              color: T.muted,
                              fontWeight: 500,
                            }}
                          >
                            Click or drag image
                          </p>
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "0.68rem",
                              color: T.sub,
                            }}
                          >
                            PNG, JPG, WEBP (max 10MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: T.red,
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: 26,
                          height: 26,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </Field>

                {/* Buttons (right side) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    gap: 10,
                    height: "100%",
                    paddingTop: 20,
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      background: loading
                        ? "#aaa"
                        : editingItem
                          ? "linear-gradient(135deg,#C9A84C,#E2C56A)"
                          : T.red,
                      boxShadow: loading
                        ? "none"
                        : "0 2px 10px rgba(139,26,26,0.22)",
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Saving…
                      </>
                    ) : editingItem ? (
                      "Update Dress Item"
                    ) : (
                      "Create Dress Item"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: "10px 20px",
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
                </div>
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

export default DressItemsManager;
