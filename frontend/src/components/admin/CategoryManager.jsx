import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import { Edit2, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const T = {
  bg:      "#FAF7F4",
  surf:    "#FFFFFF",
  bdr:     "rgba(201,168,76,0.22)",
  gold:    "#C9A84C",
  goldBg:  "rgba(201,168,76,0.10)",
  red:     "#8B1A1A",
  redBg:   "rgba(139,26,26,0.07)",
  tx:      "#1C1008",
  muted:   "#7A6555",
  sub:     "#C4B5A8",
};

const categorySchema = z.object({
  name:               z.string().min(1, "Category name is required"),
  description:        z.string().optional(),
  groomDressPrice:    z.coerce.number().min(0, "Must be ≥ 0").nullable().optional(),
  bestmanDressPrice:  z.coerce.number().min(0, "Must be ≥ 0").nullable().optional(),
  pageBoyDressPrice:  z.coerce.number().min(0, "Must be ≥ 0").nullable().optional(),
});

const Field = ({ label, required, error, hint, children }) => (
  <div>
    <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600,
      color: T.muted, marginBottom:4, letterSpacing:"0.03em" }}>
      {label}{required && <span style={{ color: T.red }}> *</span>}
    </label>
    {children}
    {hint  && <p style={{ color: T.sub,  fontSize:"0.70rem", marginTop:3 }}>{hint}</p>}
    {error && <p style={{ color: T.red,  fontSize:"0.72rem", marginTop:3 }}>{error}</p>}
  </div>
);

const inputStyle = {
  width:"100%", padding:"8px 12px", borderRadius:7,
  border:`1px solid ${T.bdr}`, outline:"none",
  fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem",
  color: T.tx, background: T.surf, boxSizing:"border-box",
};

const PriceBadge = ({ value, label }) => {
  if (value == null) return <span style={{ color: T.sub }}>—</span>;
  return (
    <span style={{ display:"inline-flex", flexDirection:"column", alignItems:"flex-end" }}>
      <span style={{ fontSize:"0.78rem", fontWeight:600, color: T.tx }}>
        Rs.{Number(value).toLocaleString()}
      </span>
      <span style={{ fontSize:"0.62rem", color: T.sub, letterSpacing:"0.06em" }}>{label}</span>
    </span>
  );
};

/* ----------------------------------
   MAIN COMPONENT
----------------------------------------- */
const CategoryManager = () => {
  const [categories,     setCategories]     = useState([]);
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingCategory,setEditingCategory] = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [visibleIds,     setVisibleIds]     = useState({});
  const [searchCategory, setSearchCategory] = useState("");
  const [currentPage,    setCurrentPage]    = useState(1);
  const itemsPerPage = 5;

  const { register, handleSubmit, reset, setValue,
    formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "", description: "",
      groomDressPrice: "", bestmanDressPrice: "", pageBoyDressPrice: "",
    },
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data || []);
      setCurrentPage(1);
      setSearchCategory("");
    } catch { toastError("Failed to load categories"); }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setValue("name",              category.name        || "");
      setValue("description",       category.description || "");
      setValue("groomDressPrice",   category.groomDressPrice   ?? "");
      setValue("bestmanDressPrice", category.bestmanDressPrice ?? "");
      setValue("pageBoyDressPrice", category.pageBoyDressPrice ?? "");
    } else {
      setEditingCategory(null);
      reset();
    }
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    // Convert empty strings → null so backend receives proper nulls
    const payload = {
      name:              data.name,
      description:       data.description || null,
      groomDressPrice:   data.groomDressPrice   !== "" ? Number(data.groomDressPrice)   : null,
      bestmanDressPrice: data.bestmanDressPrice  !== "" ? Number(data.bestmanDressPrice)  : null,
      pageBoyDressPrice: data.pageBoyDressPrice  !== "" ? Number(data.pageBoyDressPrice)  : null,
    };

    try {
      if (editingCategory) {
        await api.put(`/api/admin/categories/${editingCategory.categoryId}`, payload);
        toastSuccess("Category updated successfully");
      } else {
        await api.post("/api/admin/categories", payload);
        toastSuccess("Category created successfully");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
    } finally { setLoading(false); }
  };

  const handleDelete = async (categoryId) => {
    const result = await MySwal.fire({
      title: "Delete Category?",
      text: "This will permanently delete this category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: T.red,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/api/admin/categories/${categoryId}`);
        toastSuccess("Category deleted successfully");
        fetchCategories();
      } catch { toastError("Delete failed"); }
    }
  };

  const toggleIdVisibility = (id) =>
    setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const indexOfLast             = currentPage * itemsPerPage;
  const indexOfFirst            = indexOfLast - itemsPerPage;
  const currentPageCategories   = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages              = Math.ceil(filteredCategories.length / itemsPerPage);
  const total                   = categories.length;

  /* ---------------------------------------- RENDER ---------------------------------------- */
  return (
    <div style={{ minHeight:"100vh", background: T.bg,
      padding:"28px 28px 60px", fontFamily:"'DM Sans',sans-serif" }}>

      {/* ------ PAGE HEADER  */}
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem",
          fontWeight:700, color: T.tx, margin:0 }}>
          Category <span style={{ color: T.red }}>Management</span>
        </h1>
        <p style={{ color: T.muted, fontSize:"0.82rem", marginTop:4, marginBottom:0 }}>
          Create, update and set category-based dress pricing for each role
        </p>
      </div>

      {/* ------ STAT CARD  */}
      <div style={{ display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",
        gap:12, marginBottom:22 }}>
        <div style={{ background: T.surf, border:`1px solid ${T.bdr}`,
          borderRadius:10, padding:"14px 16px",
          boxShadow:`0 2px 0 rgba(201,168,76,0.08),0 4px 12px rgba(28,16,8,0.04)` }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem",
            fontWeight:700, color: T.tx, lineHeight:1 }}>{total}</div>
          <div style={{ fontSize:"0.63rem", color: T.muted, marginTop:3,
            letterSpacing:"0.12em", textTransform:"uppercase" }}>Total Categories</div>
        </div>
      </div>

      {/* ------ TOOLBAR ------ */}
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center",
        gap:10, marginBottom:16 }}>
        <div style={{ position:"relative", flex:"1", minWidth:180, maxWidth:280 }}>
          <span style={{ position:"absolute", left:10, top:"50%",
            transform:"translateY(-50%)", color: T.sub, fontSize:"0.82rem" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by category name…"
            value={searchCategory}
            onChange={(e) => { setSearchCategory(e.target.value); setCurrentPage(1); }}
            style={{ ...inputStyle, paddingLeft:30 }}
          />
        </div>
        <div style={{ flex:1 }} />
        <button onClick={() => openModal()}
          style={{ display:"flex", alignItems:"center", gap:7,
            padding:"9px 18px", background: T.red, color:"#fff",
            border:"none", borderRadius:8, cursor:"pointer",
            fontSize:"0.82rem", fontWeight:600, letterSpacing:"0.04em",
            boxShadow:`0 2px 8px rgba(139,26,26,0.18)`, whiteSpace:"nowrap" }}>
          <Plus size={15} /> Add New Category
        </button>
      </div>

      {/* ------ TABLE ------ */}
      <div style={{ background: T.surf, border:`1px solid ${T.bdr}`,
        borderRadius:12, overflow:"hidden",
        boxShadow:`0 2px 0 rgba(201,168,76,0.08),0 6px 20px rgba(28,16,8,0.04)` }}>
        <div style={{ overflowX:"auto", width:"100%" }}>
          <table style={{ width:"100%", borderCollapse:"collapse",
            fontSize:"0.78rem", minWidth:700 }}>
            <thead>
              <tr style={{ background:`linear-gradient(90deg,${T.goldBg},rgba(201,168,76,0.05))`,
                borderBottom:`1px solid ${T.bdr}` }}>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Description</Th>
                {/* ------ Dress price columns ------ */}
                <Th>Groom Price</Th>
                <Th>Bestman Price</Th>
                <Th>Pageboy Price</Th>
                <Th>Created At</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {currentPageCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding:"40px 16px", textAlign:"center",
                    color: T.muted, fontSize:"0.85rem" }}>
                    {filteredCategories.length === 0
                      ? "No categories found matching your search."
                      : "No categories on this page."}
                  </td>
                </tr>
              ) : (
                currentPageCategories.map((cat, idx) => (
                  <tr
                    key={cat.categoryId}
                    style={{ borderBottom:`1px solid rgba(201,168,76,0.10)`,
                      background: idx%2===0 ? T.surf : "#FDFBF8",
                      transition:"background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.goldBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = idx%2===0 ? T.surf : "#FDFBF8")}
                  >
                    {/* ID */}
                    <Td>
                      {!visibleIds[cat.categoryId] ? (
                        <button onClick={() => toggleIdVisibility(cat.categoryId)}
                          style={{ color: T.gold, fontSize:"0.72rem",
                            background:"none", border:"none", cursor:"pointer",
                            textDecoration:"underline" }}>Show</button>
                      ) : (
                        <>
                          <button onClick={() => toggleIdVisibility(cat.categoryId)}
                            style={{ color: T.gold, fontSize:"0.72rem",
                              background:"none", border:"none", cursor:"pointer",
                              textDecoration:"underline" }}>Hide</button>
                          <div style={{ marginTop:3, wordBreak:"break-all",
                            color: T.muted, fontSize:"0.68rem",
                            fontFamily:"monospace", maxWidth:140 }}>
                            {cat.categoryId}
                          </div>
                        </>
                      )}
                    </Td>

                    {/* Name */}
                    <Td>
                      <span style={{ fontWeight:600, color: T.tx }}>{cat.name}</span>
                    </Td>

                    {/* Description */}
                    <Td>
                      <span style={{ color: T.muted, maxWidth:180,
                        overflow:"hidden", textOverflow:"ellipsis",
                        display:"block", whiteSpace:"nowrap" }}>
                        {cat.description || "—"}
                      </span>
                    </Td>

                    {/* ── Dress prices ── */}
                    <Td><PriceBadge value={cat.groomDressPrice}   label="Groom"   /></Td>
                    <Td><PriceBadge value={cat.bestmanDressPrice} label="Bestman" /></Td>
                    <Td><PriceBadge value={cat.pageBoyDressPrice} label="Pageboy" /></Td>

                    {/* Created At */}
                    <Td>
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString("en-GB",
                            { day:"2-digit", month:"short", year:"numeric" })
                        : "—"}
                    </Td>

                    {/* Actions */}
                    <Td>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <ActionBtn title="Edit" bg="rgba(201,168,76,0.12)"
                          color={T.gold} hoverBg="rgba(201,168,76,0.24)"
                          onClick={() => openModal(cat)}>
                          <Edit2 size={13} />
                        </ActionBtn>
                        <ActionBtn title="Delete" bg={T.redBg}
                          color={T.red} hoverBg="rgba(139,26,26,0.15)"
                          onClick={() => handleDelete(cat.categoryId)}>
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

        {/* Pagination footer */}
        {filteredCategories.length > 0 && (
          <div style={{ display:"flex", alignItems:"center",
            justifyContent:"space-between", padding:"12px 18px",
            borderTop:`1px solid ${T.bdr}`,
            background:"rgba(250,247,244,0.70)",
            flexWrap:"wrap", gap:8 }}>
            <span style={{ fontSize:"0.75rem", color: T.muted }}>
              Showing{" "}
              <strong style={{ color: T.tx }}>
                {indexOfFirst+1}–{Math.min(indexOfLast, filteredCategories.length)}
              </strong>
              {" "}of{" "}
              <strong style={{ color: T.tx }}>{filteredCategories.length}</strong> categories
            </span>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <PagBtn disabled={currentPage===1}
                onClick={() => setCurrentPage((p) => Math.max(p-1,1))}>
                ‹ Prev
              </PagBtn>
              {Array.from({ length: totalPages }, (_,i) => i+1)
                .filter((n) => n===1 || n===totalPages || Math.abs(n-currentPage)<=1)
                .reduce((acc,n,i,arr) => {
                  if (i>0 && n-arr[i-1]>1)
                    acc.push(<span key={`g-${n}`}
                      style={{ color: T.sub, fontSize:"0.78rem" }}>…</span>);
                  acc.push(
                    <PagBtn key={n} active={n===currentPage}
                      onClick={() => setCurrentPage(n)}>{n}</PagBtn>
                  );
                  return acc;
                }, [])}
              <PagBtn disabled={currentPage===totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p+1,totalPages))}>
                Next ›
              </PagBtn>
            </div>
          </div>
        )}
      </div>

      {/* ------ MODAL ------ */}
      {modalOpen && (
        <div style={{ position:"fixed", inset:0,
          background:"rgba(28,10,0,0.65)", backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:200, padding:16 }}>
          <div style={{ background: T.surf, borderRadius:16,
            border:`1px solid ${T.bdr}`,
            boxShadow:"0 24px 64px rgba(28,10,0,0.22)",
            width:"100%", maxWidth:540,
            maxHeight:"90vh", overflowY:"auto" }}>

            {/* Modal header */}
            <div style={{ display:"flex", alignItems:"center",
              justifyContent:"space-between",
              padding:"16px 22px", borderBottom:`1px solid ${T.bdr}`,
              position:"sticky", top:0, background: T.surf, zIndex:10 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:"1.5rem", fontWeight:700, color: T.tx,
                margin:0, display:"flex", alignItems:"center", gap:8 }}>
                {editingCategory
                  ? <><Edit2 size={18} color={T.gold} /> Edit Category</>
                  : <><Plus  size={18} color={T.gold} /> Add New Category</>}
              </h2>
              <button onClick={() => setModalOpen(false)}
                style={{ background:"none", border:"none", cursor:"pointer",
                  color: T.muted, padding:4, borderRadius:6,
                  display:"flex", alignItems:"center" }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit(onSubmit)}
              style={{ padding:"20px 22px", display:"flex",
                flexDirection:"column", gap:16 }}>

              {/* Name */}
              <Field label="Category Name" required error={errors.name?.message}>
                <input type="text" {...register("name")}
                  placeholder="e.g. Mul Adum" style={inputStyle} />
              </Field>

              {/* Description */}
              <Field label="Description" error={errors.description?.message}>
                <textarea rows={3} {...register("description")}
                  placeholder="Describe the category (optional)…"
                  style={{ ...inputStyle, resize:"none", lineHeight:1.5 }} />
              </Field>

              {/* ── Dress Pricing Section ── */}
              <div style={{ background:"rgba(201,168,76,0.06)",
                border:`1px solid rgba(201,168,76,0.20)`,
                borderRadius:10, padding:"14px 16px" }}>

                <p style={{ fontSize:"0.75rem", fontWeight:700,
                  color: T.muted, margin:"0 0 12px",
                  letterSpacing:"0.10em", textTransform:"uppercase" }}>
                  Category Dress Pricing (Rs.)
                </p>
                <p style={{ fontSize:"0.72rem", color: T.sub,
                  margin:"0 0 14px", lineHeight:1.5 }}>
                  These prices override the default <em>Special Item Type</em> prices
                  when a user selects a dress from this category during booking.
                  Leave blank to use the default.
                </p>

                <div style={{ display:"grid",
                  gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>

                  <Field label="Groom" error={errors.groomDressPrice?.message}
                    hint="e.g. 25000">
                    <input type="number" min={0} step={500}
                      {...register("groomDressPrice")}
                      placeholder="25000"
                      style={inputStyle} />
                  </Field>

                  <Field label="Best Man" error={errors.bestmanDressPrice?.message}
                    hint="e.g. 14500">
                    <input type="number" min={0} step={500}
                      {...register("bestmanDressPrice")}
                      placeholder="14500"
                      style={inputStyle} />
                  </Field>

                  <Field label="Page Boy" error={errors.pageBoyDressPrice?.message}
                    hint="e.g. 8500">
                    <input type="number" min={0} step={500}
                      {...register("pageBoyDressPrice")}
                      placeholder="8500"
                      style={inputStyle} />
                  </Field>

                </div>
              </div>

              {/* Modal footer */}
              <div style={{ display:"flex", justifyContent:"flex-end", gap:10,
                paddingTop:14, borderTop:`1px solid ${T.bdr}`, marginTop:4 }}>
                <button type="button" onClick={() => setModalOpen(false)}
                  style={{ padding:"9px 20px", borderRadius:8,
                    border:`1px solid ${T.bdr}`, background: T.surf,
                    color: T.muted, cursor:"pointer",
                    fontSize:"0.82rem", fontWeight:500 }}>
                  Cancel
                </button>
                <button type="submit"
                  disabled={loading || isSubmitting}
                  style={{ padding:"9px 24px", borderRadius:8, border:"none",
                    cursor: loading||isSubmitting ? "not-allowed" : "pointer",
                    fontSize:"0.82rem", fontWeight:600, color:"#fff",
                    display:"flex", alignItems:"center", gap:7,
                    background: loading||isSubmitting
                      ? "#aaa"
                      : editingCategory
                        ? "linear-gradient(135deg,#C9A84C,#E2C56A)"
                        : T.red,
                    boxShadow: loading||isSubmitting
                      ? "none"
                      : "0 2px 10px rgba(139,26,26,0.22)" }}>
                  {loading || isSubmitting
                    ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                    : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------- Tiny helper components ---------------------------------------- */
const Th = ({ children }) => (
  <th style={{ padding:"10px 12px", textAlign:"left",
    fontSize:"0.70rem", fontWeight:700, color:"#7A6555",
    letterSpacing:"0.10em", textTransform:"uppercase",
    whiteSpace:"nowrap" }}>
    {children}
  </th>
);

const Td = ({ children }) => (
  <td style={{ padding:"9px 12px", verticalAlign:"middle",
    fontSize:"0.78rem", color:"#1C1008", whiteSpace:"nowrap" }}>
    {children}
  </td>
);

const ActionBtn = ({ children, title, bg, color, hoverBg, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display:"flex", alignItems:"center", justifyContent:"center",
        width:28, height:28, borderRadius:6, border:"none",
        cursor:"pointer", transition:"background 0.15s",
        background: hovered ? hoverBg : bg, color }}>
      {children}
    </button>
  );
};

const PagBtn = ({ children, onClick, disabled, active }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding:"5px 10px", borderRadius:6, fontSize:"0.75rem",
        fontWeight: active ? 700 : 400, border:"1px solid",
        cursor: disabled ? "not-allowed" : "pointer", transition:"all 0.15s",
        borderColor: active ? "#8B1A1A" : "rgba(201,168,76,0.25)",
        background: active ? "#8B1A1A" : hovered&&!disabled ? "rgba(201,168,76,0.12)" : "#fff",
        color: active ? "#fff" : disabled ? "#C4B5A8" : "#1C1008" }}>
      {children}
    </button>
  );
};

export default CategoryManager;

