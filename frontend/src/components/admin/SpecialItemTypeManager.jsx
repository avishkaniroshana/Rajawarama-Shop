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
  bg: "#FAF7F4", surf: "#FFFFFF", bdr: "rgba(201,168,76,0.22)",
  gold: "#C9A84C", goldBg: "rgba(201,168,76,0.10)",
  red: "#8B1A1A", redBg: "rgba(139,26,26,0.07)",
  tx: "#1C1008", muted: "#7A6555", sub: "#C4B5A8",
};

const specialItemTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  pricePerUnit: z.number({ invalid_type_error: "Price is required" }).positive("Price must be greater than 0"),
  maxAvailable: z.number({ invalid_type_error: "Max available is required" }).int("Must be a whole number").nonnegative("Cannot be negative").optional().default(999),
});

const inputStyle = {
  width:"100%", padding:"8px 12px", borderRadius:7, border:`1px solid ${T.bdr}`,
  outline:"none", fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem",
  color:T.tx, background:T.surf, boxSizing:"border-box",
};

const Field = ({ label, required, error, children }) => (
  <div>
    <label style={{ display:"block", fontSize:"0.75rem", fontWeight:600, color:T.muted, marginBottom:5, letterSpacing:"0.03em" }}>
      {label}{required && <span style={{ color:T.red }}> *</span>}
    </label>
    {children}
    {error && <p style={{ color:T.red, fontSize:"0.72rem", marginTop:3 }}>{error}</p>}
  </div>
);

const SpecialItemTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState({});

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(specialItemTypeSchema),
    defaultValues: { name:"", pricePerUnit:0, maxAvailable:999 },
  });

  useEffect(() => { fetchTypes(); }, []);

  const fetchTypes = async () => {
    try { const res = await api.get("/api/admin/special-item-types"); setTypes(res.data || []); }
    catch { toastError("Failed to load special item types"); }
  };

  const openModal = (type = null) => {
    if (type) {
      setEditingType(type);
      setValue("name", type.name || "");
      setValue("pricePerUnit", type.pricePerUnit || 0);
      setValue("maxAvailable", type.maxAvailable ?? 999);
    } else { setEditingType(null); reset(); }
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editingType) {
        await api.put(`/api/admin/special-item-types/${editingType.id}`, data);
        toastSuccess("Special item type updated");
      } else {
        await api.post("/api/admin/special-item-types", data);
        toastSuccess("Special item type created");
      }
      setModalOpen(false);
      fetchTypes();
    } catch (err) {
      toastError(err.response?.data?.message || "Operation failed");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Permanent Delete?", text: "This will permanently delete this item type!",
      icon: "error", showCancelButton: true,
      confirmButtonColor: T.red, cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete Forever",
    });
    if (result.isConfirmed) {
      try { await api.delete(`/api/admin/special-item-types/${id}`); toastSuccess("Item type deleted"); fetchTypes(); }
      catch { toastError("Delete failed"); }
    }
  };

  const toggleIdVisibility = (id) => setVisibleIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ minHeight:"100vh", background:T.bg, padding:"28px 28px 60px", fontFamily:"'DM Sans',sans-serif" }}>

      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:700, color:T.tx, margin:0 }}>
          Special Item <span style={{ color:T.red }}>Types</span>
        </h1>
        <p style={{ color:T.muted, fontSize:"0.82rem", marginTop:4, marginBottom:0 }}>
          Define additional billable items for use in special packages
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12, marginBottom:22 }}>
        {[
          { label:"Total Types", value:types.length, color:T.tx },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:T.surf, border:`1px solid ${T.bdr}`, borderRadius:10, padding:"14px 16px", boxShadow:`0 2px 0 rgba(201,168,76,0.08),0 4px 12px rgba(28,16,8,0.04)` }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem", fontWeight:700, color, lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:"0.63rem", color:T.muted, marginTop:3, letterSpacing:"0.12em", textTransform:"uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button onClick={() => openModal()}
          style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", background:T.red, color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontSize:"0.82rem", fontWeight:600, letterSpacing:"0.04em", boxShadow:`0 2px 8px rgba(139,26,26,0.18)` }}>
          <Plus size={15} /> Add New Special Item Type
        </button>
      </div>

      <div style={{ background:T.surf, border:`1px solid ${T.bdr}`, borderRadius:12, overflow:"hidden", boxShadow:`0 2px 0 rgba(201,168,76,0.08),0 6px 20px rgba(28,16,8,0.04)` }}>
        <div style={{ overflowX:"auto", width:"100%" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.78rem", minWidth:560 }}>
            <thead>
              <tr style={{ background:`linear-gradient(90deg,${T.goldBg},rgba(201,168,76,0.05))`, borderBottom:`1px solid ${T.bdr}` }}>
                <Th>ID</Th><Th>Name</Th><Th>Price / Unit (LKR)</Th><Th>Max Available</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {types.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:"40px 16px", textAlign:"center", color:T.muted, fontSize:"0.85rem" }}>No special item types found. Add your first type above.</td></tr>
              ) : (
                types.map((type, idx) => (
                  <tr key={type.id}
                    style={{ borderBottom:`1px solid rgba(201,168,76,0.10)`, background:idx%2===0?T.surf:"#FDFBF8", transition:"background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.goldBg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = idx%2===0?T.surf:"#FDFBF8")}
                  >
                    <Td>
                      {!visibleIds[type.id] ? (
                        <button onClick={() => toggleIdVisibility(type.id)} style={{ color:T.gold, fontSize:"0.72rem", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>Show</button>
                      ) : (
                        <>
                          <button onClick={() => toggleIdVisibility(type.id)} style={{ color:T.gold, fontSize:"0.72rem", background:"none", border:"none", cursor:"pointer", textDecoration:"underline" }}>Hide</button>
                          <div style={{ marginTop:3, wordBreak:"break-all", color:T.muted, fontSize:"0.68rem", fontFamily:"monospace", maxWidth:140 }}>{type.id}</div>
                        </>
                      )}
                    </Td>
                    <Td><span style={{ fontWeight:500, color:T.tx }}>{type.name}</span></Td>
                    <Td><span style={{ fontWeight:600, color:T.tx }}>Rs. {type.pricePerUnit?.toLocaleString("en-LK") || "0"}</span></Td>
                    <Td>
                      <span style={{ display:"inline-block", padding:"3px 9px", borderRadius:40, fontSize:"0.68rem", fontWeight:600, background:T.goldBg, color:T.gold, border:`1px solid rgba(201,168,76,0.35)` }}>
                        {type.maxAvailable >= 999 ? "Unlimited" : type.maxAvailable}
                      </span>
                    </Td>
                    <Td>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <ActionBtn title="Edit" bg="rgba(201,168,76,0.12)" color={T.gold} hoverBg="rgba(201,168,76,0.24)" onClick={() => openModal(type)}><Edit2 size={13} /></ActionBtn>
                        <ActionBtn title="Delete" bg={T.redBg} color={T.red} hoverBg="rgba(139,26,26,0.15)" onClick={() => handleDelete(type.id)}><Trash2 size={13} /></ActionBtn>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(28,10,0,0.65)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:16 }}>
          <div style={{ background:T.surf, borderRadius:16, border:`1px solid ${T.bdr}`, boxShadow:"0 24px 64px rgba(28,10,0,0.22)", width:"100%", maxWidth:460, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 22px", borderBottom:`1px solid ${T.bdr}`, position:"sticky", top:0, background:T.surf, zIndex:10 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", fontWeight:700, color:T.tx, margin:0, display:"flex", alignItems:"center", gap:8 }}>
                {editingType ? <><Edit2 size={18} color={T.gold} /> Edit Item Type</> : <><Plus size={18} color={T.gold} /> Add Special Item Type</>}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:T.muted, padding:4, borderRadius:6, display:"flex", alignItems:"center" }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:16 }}>
              <Field label="Item Name" required error={errors.name?.message}>
                <input {...register("name")} placeholder="e.g. Wedding Coordination" style={inputStyle} />
              </Field>
              <Field label="Price per Unit (LKR)" required error={errors.pricePerUnit?.message}>
                <input type="number" step="100" {...register("pricePerUnit", { valueAsNumber:true })} placeholder="25000" style={inputStyle} />
              </Field>
              <Field label="Max Available (optional)" error={errors.maxAvailable?.message}>
                <input type="number" {...register("maxAvailable", { valueAsNumber:true })} placeholder="999 (unlimited if empty)" style={inputStyle} />
              </Field>

              <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:14, borderTop:`1px solid ${T.bdr}`, marginTop:4 }}>
                <button type="button" onClick={() => setModalOpen(false)}
                  style={{ padding:"9px 20px", borderRadius:8, border:`1px solid ${T.bdr}`, background:T.surf, color:T.muted, cursor:"pointer", fontSize:"0.82rem", fontWeight:500 }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading || isSubmitting}
                  style={{ padding:"9px 24px", borderRadius:8, border:"none", cursor:(loading||isSubmitting)?"not-allowed":"pointer", fontSize:"0.82rem", fontWeight:600, color:"#fff", display:"flex", alignItems:"center", gap:7,
                    background: (loading||isSubmitting) ? "#aaa" : editingType ? "linear-gradient(135deg,#C9A84C,#E2C56A)" : T.red,
                    boxShadow: (loading||isSubmitting) ? "none" : "0 2px 10px rgba(139,26,26,0.22)" }}>
                  {loading||isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editingType ? "Update Type" : "Create Type"}
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
  <th style={{ padding:"10px 12px", textAlign:"left", fontSize:"0.70rem", fontWeight:700, color:"#7A6555", letterSpacing:"0.10em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{children}</th>
);
const Td = ({ children }) => (
  <td style={{ padding:"9px 12px", verticalAlign:"middle", fontSize:"0.78rem", color:"#1C1008", whiteSpace:"nowrap" }}>{children}</td>
);
const ActionBtn = ({ children, title, bg, color, hoverBg, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display:"flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:6, border:"none", cursor:"pointer", transition:"background 0.15s", background:hovered?hoverBg:bg, color }}>
      {children}
    </button>
  );
};

export default SpecialItemTypeManager;

