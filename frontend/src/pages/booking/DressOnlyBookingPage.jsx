import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  Shirt, Crown, Users, User, Plus, Trash2,
  MapPin, Calendar, Clock, FileText, Phone,
  ChevronRight, ChevronLeft, Check, Loader2, Info,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{--cr:#8B1A1A;--cr-g:rgba(139,26,26,.08);--go:#C9A84C;--go-l:#E2C56A;
    --go-g:rgba(201,168,76,.13);--in:#3730A3;--in-g:rgba(55,48,163,.07);
    --bg:#FAF7F4;--surf:#fff;--bdr:rgba(201,168,76,.22);--tx:#1C1008;--mu:#7A6555;--su:#C4B5A8;}
  .do-root{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh}
  .do-hero{background:linear-gradient(135deg,#0a0505 0%,#2a0808 50%,#0a0a02 100%);
    padding:52px 24px 68px;text-align:center;position:relative;overflow:hidden}
  .do-hero::before{content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse 60% 50% at 20% 40%,rgba(201,168,76,.10) 0%,transparent 60%),
               radial-gradient(ellipse 50% 40% at 80% 60%,rgba(139,26,26,.22) 0%,transparent 60%);pointer-events:none}
  .do-hero-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 15px;border-radius:40px;
    border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.07);color:var(--go-l);
    font-size:.70rem;font-weight:500;letter-spacing:.20em;text-transform:uppercase;
    margin-bottom:16px;position:relative;z-index:1}
  .do-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,5vw,3.1rem);
    font-weight:700;color:#FDF8F0;position:relative;z-index:1;margin-bottom:10px}
  .do-hero-title em{font-style:italic;color:var(--go-l)}
  .do-hero-sub{font-size:.86rem;color:rgba(253,248,240,.55);max-width:460px;
    margin:0 auto;line-height:1.7;position:relative;z-index:1}
  .do-stepper{background:var(--surf);border-bottom:1px solid var(--bdr);padding:20px 24px;position:sticky;top:0;z-index:20}
  .do-stepper-inner{max-width:680px;margin:0 auto;display:flex;align-items:center}
  .do-step{display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;position:relative}
  .do-step:not(:last-child)::after{content:'';position:absolute;top:17px;left:calc(50% + 20px);right:calc(-50% + 20px);height:1px;background:var(--bdr)}
  .do-step.done:not(:last-child)::after{background:var(--go)}
  .do-step-circle{width:34px;height:34px;border-radius:50%;border:2px solid var(--bdr);
    display:flex;align-items:center;justify-content:center;
    font-family:'Cormorant Garamond',serif;font-size:.95rem;font-weight:700;
    color:var(--su);background:var(--bg);transition:all .3s;position:relative;z-index:1}
  .do-step.active .do-step-circle{border-color:var(--cr);background:var(--cr);color:#fff;box-shadow:0 0 0 4px var(--cr-g)}
  .do-step.done .do-step-circle{border-color:var(--go);background:var(--go);color:#fff}
  .do-step-label{font-size:.60rem;font-weight:500;letter-spacing:.10em;text-transform:uppercase;color:var(--su);text-align:center;white-space:nowrap}
  .do-step.active .do-step-label{color:var(--cr)} .do-step.done .do-step-label{color:var(--go)}
  .do-body{max-width:820px;margin:0 auto;padding:44px 24px 90px}
  .do-section-title{font-family:'Cormorant Garamond',serif;font-size:1.85rem;font-weight:700;color:var(--tx);margin-bottom:6px}
  .do-section-sub{font-size:.84rem;color:var(--mu);font-weight:300;margin-bottom:28px;line-height:1.6}
  .do-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:600px){.do-grid{grid-template-columns:1fr}}
  .do-field{display:flex;flex-direction:column;gap:5px} .do-field.full{grid-column:1/-1}
  .do-label{font-size:.73rem;font-weight:500;letter-spacing:.10em;text-transform:uppercase;color:var(--mu);display:flex;align-items:center;gap:5px}
  .do-label .req{color:var(--cr)}
  .do-input{padding:10px 13px;border:1px solid rgba(201,168,76,.28);border-radius:7px;
    background:var(--surf);font-family:'DM Sans',sans-serif;font-size:.88rem;color:var(--tx);
    outline:none;transition:border-color .2s,box-shadow .2s;width:100%;box-sizing:border-box}
  .do-input:focus{border-color:var(--go);box-shadow:0 0 0 3px var(--go-g)}
  .do-input::placeholder{color:var(--su)} .do-textarea{resize:vertical;min-height:80px}
  .do-err{font-size:.73rem;color:var(--cr);margin-top:2px}
  .do-hint{font-size:.70rem;color:var(--su);margin-top:2px;display:flex;align-items:center;gap:4px}
  .do-role-section{margin-bottom:28px}
  .do-role-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--bdr)}
  .do-role-title{font-family:'Cormorant Garamond',serif;font-size:1.10rem;font-weight:700;color:var(--tx);display:flex;align-items:center;gap:8px}
  .do-role-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center}
  .do-role-icon.groom{background:rgba(139,26,26,.08);color:var(--cr)}
  .do-role-icon.bman{background:var(--in-g);color:var(--in)}
  .do-role-icon.pboy{background:rgba(201,168,76,.10);color:#8B6914}
  .do-add-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:6px;
    border:1px dashed rgba(201,168,76,.40);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.73rem;font-weight:500;color:var(--mu);cursor:pointer;transition:all .2s}
  .do-add-btn:hover{border-color:var(--go);color:var(--tx);background:var(--go-g)}
  .do-dress-card{background:var(--surf);border:1px solid var(--bdr);border-radius:8px;padding:12px 14px;margin-bottom:10px}
  .do-dress-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .do-dress-select{flex:1;min-width:180px;padding:9px 11px;border:1px solid rgba(201,168,76,.28);border-radius:7px;
    background:var(--surf);font-family:'DM Sans',sans-serif;font-size:.83rem;color:var(--tx);outline:none;transition:border-color .2s}
  .do-dress-select:focus{border-color:var(--go);box-shadow:0 0 0 3px var(--go-g)}
  .do-qty-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}
  .do-qty-label{font-size:.70rem;color:var(--mu);white-space:nowrap}
  .do-qty-btn{width:26px;height:26px;border-radius:5px;border:1px solid var(--bdr);
    background:var(--surf);color:var(--tx);font-size:.95rem;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .15s}
  .do-qty-btn:hover{border-color:var(--cr);color:var(--cr)}
  .do-qty-val{width:28px;text-align:center;font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:700;color:var(--tx)}
  .do-remove-btn{padding:8px;border:1px solid rgba(139,26,26,.20);border-radius:7px;
    background:rgba(139,26,26,.05);color:var(--cr);cursor:pointer;transition:all .2s;display:flex;align-items:center;flex-shrink:0}
  .do-remove-btn:hover{background:rgba(139,26,26,.12)}
  .do-price-hint{font-size:.73rem;color:var(--cr);font-weight:600;margin-top:6px;display:flex;align-items:center;gap:4px}
  .do-price-strip{background:linear-gradient(135deg,rgba(139,26,26,.04),rgba(201,168,76,.06));
    border:1px solid rgba(201,168,76,.22);border-radius:10px;padding:14px 18px;margin-top:20px;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
  .do-ps-item{display:flex;flex-direction:column;gap:2px;flex:1;min-width:110px}
  .do-ps-label{font-size:.60rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--su)}
  .do-ps-val{font-family:'Cormorant Garamond',serif;font-size:1.10rem;font-weight:700;color:var(--tx)}
  .do-ps-val.total{color:var(--cr);font-size:1.30rem} .do-ps-divider{width:1px;background:var(--bdr);align-self:stretch}
  .do-review-card{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden;margin-bottom:16px}
  .do-review-head{padding:12px 18px;background:linear-gradient(135deg,rgba(139,26,26,.04),rgba(201,168,76,.04));
    border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:8px;
    font-size:.70rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--mu)}
  .do-review-body{padding:16px 18px}
  .do-review-row{display:flex;align-items:flex-start;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(201,168,76,.08);gap:14px}
  .do-review-row:last-child{border-bottom:none}
  .do-review-key{font-size:.76rem;color:var(--mu);white-space:nowrap} .do-review-val{font-size:.82rem;color:var(--tx);font-weight:500;text-align:right}
  .do-dress-review-row{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid rgba(201,168,76,.07)}
  .do-dress-review-row:last-child{border-bottom:none}
  .do-review-total-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:2px solid rgba(201,168,76,.22);margin-top:6px}
  .do-review-total-label{font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mu)}
  .do-review-total-val{font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:700;color:var(--cr)}
  .do-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:40px;font-size:.63rem;font-weight:500;white-space:nowrap}
  .do-badge.groom{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.28);color:#8B6914}
  .do-badge.bman{background:var(--in-g);border:1px solid rgba(55,48,163,.18);color:var(--in)}
  .do-badge.pboy{background:rgba(139,26,26,.07);border:1px solid rgba(139,26,26,.18);color:var(--cr)}
  .do-nav{display:flex;justify-content:space-between;align-items:center;margin-top:36px;padding-top:24px;border-top:1px solid var(--bdr)}
  .do-back-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 20px;
    border-radius:7px;border:1px solid var(--bdr);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;
    letter-spacing:.07em;text-transform:uppercase;color:var(--mu);cursor:pointer;transition:all .2s}
  .do-back-btn:hover{border-color:var(--tx);color:var(--tx)}
  .do-next-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 26px;
    border-radius:7px;border:none;background:linear-gradient(135deg,var(--cr),#9B2335);color:#fff;
    font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;
    letter-spacing:.09em;text-transform:uppercase;cursor:pointer;transition:all .22s}
  .do-next-btn:hover{box-shadow:0 4px 18px rgba(139,26,26,.30);transform:translateY(-1px)}
  .do-next-btn:disabled{opacity:.50;cursor:not-allowed;transform:none}
  .do-info{padding:12px 16px;border-radius:8px;background:rgba(201,168,76,.07);
    border:1px solid rgba(201,168,76,.22);font-size:.80rem;color:var(--mu);
    line-height:1.6;margin-bottom:20px;display:flex;gap:9px;align-items:flex-start}
  .do-empty-role{font-size:.78rem;color:var(--su);font-style:italic;padding:6px 0}
  .do-spinner{width:40px;height:40px;border-radius:50%;border:2px solid rgba(201,168,76,.15);
    border-top-color:var(--go);animation:doSpin .85s linear infinite;margin:60px auto;display:block}
  @keyframes doSpin{to{transform:rotate(360deg)}}
`;

const fmt   = (n) => new Intl.NumberFormat("en-LK").format(n || 0);
const STEPS = ["Event Details", "Dress Selections", "Review & Submit"];
const makeRow = () => ({ dressItemId: "", quantity: 1 });

const DressOnlyBookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep]             = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [dressItems, setDressItems] = useState([]);
  const [form, setForm] = useState({
    hotelName: "", nearestCity: "", eventDate: "",
    contactNo: "", groomArrivalTime: "", poruwaStartTime: "", specialNotes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [phonePrefilled, setPhonePrefilled] = useState(false);
  const [groomRows,   setGroomRows]   = useState([makeRow()]);
  const [bestManRows, setBestManRows] = useState([]);
  const [pageBoyRows, setPageBoyRows] = useState([]);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-page", "dress-only-booking");
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
    return () => { if (document.head.contains(tag)) document.head.removeChild(tag); };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [dressRes, profileRes] = await Promise.all([
          api.get("/api/public/dress-items"),
          api.get("/api/profile"),
        ]);
        setDressItems(dressRes.data || []);
        const phone = profileRes.data?.phone || "";
        if (phone) { setForm((p) => ({ ...p, contactNo: phone })); setPhonePrefilled(true); }
      } catch { toastError("Failed to load data. Please refresh."); }
      finally { setLoadingData(false); }
    };
    load();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (!form.hotelName.trim())   e.hotelName   = "Hotel name is required";
    if (!form.nearestCity.trim()) e.nearestCity  = "City is required";
    if (!form.eventDate)          e.eventDate    = "Event date is required";
    else if (new Date(form.eventDate) <= new Date()) e.eventDate = "Date must be in the future";
    if (!form.contactNo.trim())   e.contactNo    = "Contact number is required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const updateRow    = (setter, i, field, val) =>
    setter((p) => p.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  const removeRow    = (setter, i) =>
    setter((p) => p.filter((_, idx) => idx !== i));
  const adjustQty    = (setter, i, delta) =>
    setter((p) => p.map((r, idx) => idx === i
      ? { ...r, quantity: Math.max(1, (r.quantity || 1) + delta) } : r));

  const getUnitPrice = (dressItemId, role) => {
    if (!dressItemId) return null;
    const it = dressItems.find((d) => d.dressItemId === dressItemId);
    if (!it) return null;
    if (role === "GROOM")    return it.categoryGroomDressPrice    ?? null;
    if (role === "BEST_MAN") return it.categoryBestmanDressPrice  ?? null;
    if (role === "PAGE_BOY") return it.categoryPageBoyDressPrice  ?? null;
    return null;
  };

  const calcSubtotal = () => {
    let total = 0;
    [...groomRows.map(r => ({ ...r, role: "GROOM" })),
     ...bestManRows.map(r => ({ ...r, role: "BEST_MAN" })),
     ...pageBoyRows.map(r => ({ ...r, role: "PAGE_BOY" })),
    ].forEach(({ dressItemId, quantity, role }) => {
      const p = getUnitPrice(dressItemId, role);
      if (p) total += p * (quantity || 1);
    });
    return total;
  };
  const subtotal = calcSubtotal();

  const canNext = () => step === 1 ? groomRows.some(r => r.dressItemId) : true;

  const handleNext = () => {
    if (step === 0 && !validateForm()) return;
    setStep(s => Math.min(s + 1, 2));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const dressSelections = [];
      groomRows.filter(r => r.dressItemId).forEach(r =>
        dressSelections.push({ role: "GROOM",    dressItemId: r.dressItemId, quantity: r.quantity || 1 }));
      bestManRows.filter(r => r.dressItemId).forEach(r =>
        dressSelections.push({ role: "BEST_MAN", dressItemId: r.dressItemId, quantity: r.quantity || 1 }));
      pageBoyRows.filter(r => r.dressItemId).forEach(r =>
        dressSelections.push({ role: "PAGE_BOY", dressItemId: r.dressItemId, quantity: r.quantity || 1 }));
      if (!dressSelections.length) { toastError("Please select at least one dress."); setSubmitting(false); return; }
      await api.post("/api/bookings/dress-only", {
        hotelName: form.hotelName, nearestCity: form.nearestCity, eventDate: form.eventDate,
        contactNo: form.contactNo,
        groomArrivalTime: form.groomArrivalTime || null, poruwaStartTime: form.poruwaStartTime || null,
        specialNotes: form.specialNotes || null, dressSelections,
      });
      toastSuccess("Dress booking submitted successfully! ");
      navigate("/my-bookings");
    } catch (err) {
      toastError(err.response?.data?.message || "Submission failed.");
    } finally { setSubmitting(false); }
  };

  const dressLabel = (id) => {
    const it = dressItems.find(d => d.dressItemId === id);
    return it ? `${it.dressItemName} (${it.categoryName})` : "—";
  };

  const DressRowCard = ({ row, index, setter, role, canRemove }) => {
    const up = getUnitPrice(row.dressItemId, role);
    const lt = up ? up * (row.quantity || 1) : null;
    return (
      <div className="do-dress-card">
        <div className="do-dress-row">
          <select className="do-dress-select" value={row.dressItemId}
            onChange={e => updateRow(setter, index, "dressItemId", e.target.value)}>
            <option value="">— Select a dress item —</option>
            {dressItems.map(d => (
              <option key={d.dressItemId} value={d.dressItemId}>
                {d.dressItemName} — {d.categoryName}
              </option>
            ))}
          </select>
          <div className="do-qty-wrap">
            <span className="do-qty-label">Qty</span>
            <button className="do-qty-btn" onClick={() => adjustQty(setter, index, -1)}>−</button>
            <span className="do-qty-val">{row.quantity || 1}</span>
            <button className="do-qty-btn" onClick={() => adjustQty(setter, index, +1)}>+</button>
          </div>
          {canRemove && (
            <button className="do-remove-btn" onClick={() => removeRow(setter, index)}>
              <Trash2 size={13} />
            </button>
          )}
        </div>
        {row.dressItemId && up && (
          <p className="do-price-hint">
            <Shirt size={11} /> Rs. {fmt(up)} / unit
            {(row.quantity || 1) > 1 && (
              <span style={{ marginLeft: 4, color: "var(--mu)", fontWeight: 400 }}>
                × {row.quantity} = <strong>Rs. {fmt(lt)}</strong>
              </span>
            )}
          </p>
        )}
        {row.dressItemId && !up && (
          <p style={{ fontSize: ".72rem", color: "var(--su)", marginTop: 4, fontStyle: "italic" }}>
            Price not yet configured for this category — admin will confirm.
          </p>
        )}
      </div>
    );
  };

  if (loadingData) return <div className="do-root"><div className="do-spinner" /></div>;

  return (
    <div className="do-root">
      <section className="do-hero">
        <div className="do-hero-badge"><Shirt size={12} /> Dress-Only Booking</div>
        <h1 className="do-hero-title">Book <em>Dresses Only</em></h1>
        <p className="do-hero-sub">
          Reserve traditional wedding attire for the Groom, Best Man and Page Boys — no dancing or special package required.
        </p>
      </section>

      <div className="do-stepper">
        <div className="do-stepper-inner">
          {STEPS.map((label, i) => (
            <div key={i} className={`do-step ${i < step ? "done" : i === step ? "active" : ""}`}>
              <div className="do-step-circle">{i < step ? <Check size={14}/> : i + 1}</div>
              <span className="do-step-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="do-body">

        {/* ══ STEP 0 — Event Details ══ */}
        {step === 0 && (
          <>
            <h2 className="do-section-title">Event Details</h2>
            <p className="do-section-sub">Tell us about your venue, date and contact information.</p>
            <div className="do-grid">
              {[["Hotel Name","hotelName","text"],["Nearest City","nearestCity","text"],
                ["Event Date","eventDate","date"],["Contact Number","contactNo","text"],
                ["Groom Arrival Time","groomArrivalTime","time"],["Poruwa Start Time","poruwaStartTime","time"],
              ].map(([label, name, type]) => (
                <div key={name} className="do-field">
                  <label className="do-label">
                    {type === "date" ? <Calendar size={11}/> : type === "time" ? <Clock size={11}/> :
                     name === "contactNo" ? <Phone size={11}/> : <MapPin size={11}/>}
                    {" "}{label}
                    {["hotelName","nearestCity","eventDate","contactNo"].includes(name) &&
                      <span className="req"> *</span>}
                  </label>
                  <input name={name} type={type} className="do-input"
                    min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                    placeholder={name === "hotelName" ? "e.g. Hill Side Hotel" :
                                 name === "nearestCity" ? "e.g. Badulla" :
                                 name === "contactNo" ? "e.g. 0771234567" : undefined}
                    value={form[name]} onChange={handleFormChange} />
                  {name === "contactNo" && phonePrefilled &&
                    <p className="do-hint"><Info size={10}/> Auto-filled from your profile.</p>}
                  {formErrors[name] && <p className="do-err">{formErrors[name]}</p>}
                </div>
              ))}
              <div className="do-field full">
                <label className="do-label"><FileText size={11}/> Special Notes</label>
                <textarea name="specialNotes" className="do-input do-textarea"
                  placeholder="Any special requests for the team..."
                  value={form.specialNotes} onChange={handleFormChange} />
              </div>
            </div>
          </>
        )}

        {/* ══ STEP 1 — Dress Selections ══ */}
        {step === 1 && (
          <>
            <h2 className="do-section-title">Dress Selections</h2>
            <p className="do-section-sub">
              Select attire for each role. Prices vary by dress category. You can add multiple dresses and set quantity per row.
            </p>

            {/* GROOM */}
            <div className="do-role-section">
              <div className="do-role-head">
                <div className="do-role-title">
                  <div className="do-role-icon groom"><Crown size={13}/></div>
                  Groom <span style={{ color:"var(--cr)", fontSize:".73rem" }}> *</span>
                </div>
                <button className="do-add-btn" onClick={() => setGroomRows(p => [...p, makeRow()])}>
                  <Plus size={11}/> Add Another
                </button>
              </div>
              {groomRows.map((row, i) => (
                <DressRowCard key={i} row={row} index={i} setter={setGroomRows}
                  role="GROOM" canRemove={groomRows.length > 1} />
              ))}
              {groomRows.every(r => !r.dressItemId) &&
                <p className="do-err">Please select at least one dress for the Groom</p>}
            </div>

            {/* BEST MAN */}
            <div className="do-role-section">
              <div className="do-role-head">
                <div className="do-role-title">
                  <div className="do-role-icon bman"><Users size={13}/></div>
                  Best Man / Groomsmen
                  <span style={{ fontSize:".70rem", color:"var(--mu)", fontWeight:400 }}>&nbsp;(optional)</span>
                </div>
                <button className="do-add-btn" onClick={() => setBestManRows(p => [...p, makeRow()])}>
                  <Plus size={11}/> Add Best Man
                </button>
              </div>
              {bestManRows.length === 0 &&
                <p className="do-empty-role">No Best Man dresses added. Click "Add Best Man" to add one.</p>}
              {bestManRows.map((row, i) => (
                <DressRowCard key={i} row={row} index={i} setter={setBestManRows}
                  role="BEST_MAN" canRemove={true} />
              ))}
            </div>

            {/* PAGE BOYS */}
            <div className="do-role-section">
              <div className="do-role-head">
                <div className="do-role-title">
                  <div className="do-role-icon pboy"><User size={13}/></div>
                  Page Boys
                  <span style={{ fontSize:".70rem", color:"var(--mu)", fontWeight:400 }}>&nbsp;(optional)</span>
                </div>
                <button className="do-add-btn" onClick={() => setPageBoyRows(p => [...p, makeRow()])}>
                  <Plus size={11}/> Add Page Boy
                </button>
              </div>
              {pageBoyRows.length === 0 &&
                <p className="do-empty-role">No Page Boy dresses added. Click "Add Page Boy" to add one.</p>}
              {pageBoyRows.map((row, i) => (
                <DressRowCard key={i} row={row} index={i} setter={setPageBoyRows}
                  role="PAGE_BOY" canRemove={true} />
              ))}
            </div>

            {subtotal > 0 && (
              <div className="do-price-strip">
                <div className="do-ps-item">
                  <span className="do-ps-label">Dress Subtotal</span>
                  <span className="do-ps-val total">Rs. {fmt(subtotal)}</span>
                </div>
                <div className="do-ps-divider"/>
                <div className="do-ps-item">
                  <span className="do-ps-label">Transport Price</span>
                  <span className="do-ps-val" style={{ color:"var(--mu)", fontSize:".85rem" }}>Will set by admin</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ STEP 2 — Review ══ */}
        {step === 2 && (
          <>
            <h2 className="do-section-title">Review & Submit</h2>
            <p className="do-section-sub">Please review your booking details before submitting.</p>

            <div className="do-review-card">
              <div className="do-review-head"><MapPin size={11}/> Event Details</div>
              <div className="do-review-body">
                {[["Hotel",form.hotelName],["City",form.nearestCity],["Date",form.eventDate],
                  ["Contact",form.contactNo],["Groom Arrival",form.groomArrivalTime||"—"],
                  ["Poruwa Start",form.poruwaStartTime||"—"],["Notes",form.specialNotes||"—"]
                ].map(([k,v]) => (
                  <div key={k} className="do-review-row">
                    <span className="do-review-key">{k}</span>
                    <span className="do-review-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="do-review-card">
              <div className="do-review-head"><Shirt size={11}/> Dress Selections</div>
              <div className="do-review-body">
                {groomRows.filter(r => r.dressItemId).map((r, i) => {
                  const up = getUnitPrice(r.dressItemId, "GROOM");
                  return (
                    <div key={i} className="do-dress-review-row">
                      <span className="do-badge groom">Groom</span>
                      <span style={{ flex:1, fontSize:".82rem" }}>{dressLabel(r.dressItemId)}</span>
                      <span style={{ fontSize:".72rem", color:"var(--mu)" }}>×{r.quantity}</span>
                      {up && <span style={{ fontSize:".78rem", color:"var(--cr)", fontWeight:600 }}>Rs. {fmt(up * r.quantity)}</span>}
                    </div>
                  );
                })}
                {bestManRows.filter(r => r.dressItemId).map((r, i) => {
                  const up = getUnitPrice(r.dressItemId, "BEST_MAN");
                  return (
                    <div key={i} className="do-dress-review-row">
                      <span className="do-badge bman">Best Man {i+1}</span>
                      <span style={{ flex:1, fontSize:".82rem" }}>{dressLabel(r.dressItemId)}</span>
                      <span style={{ fontSize:".72rem", color:"var(--mu)" }}>×{r.quantity}</span>
                      {up && <span style={{ fontSize:".78rem", color:"var(--cr)", fontWeight:600 }}>Rs. {fmt(up * r.quantity)}</span>}
                    </div>
                  );
                })}
                {pageBoyRows.filter(r => r.dressItemId).map((r, i) => {
                  const up = getUnitPrice(r.dressItemId, "PAGE_BOY");
                  return (
                    <div key={i} className="do-dress-review-row">
                      <span className="do-badge pboy">Page Boy {i+1}</span>
                      <span style={{ flex:1, fontSize:".82rem" }}>{dressLabel(r.dressItemId)}</span>
                      <span style={{ fontSize:".72rem", color:"var(--mu)" }}>×{r.quantity}</span>
                      {up && <span style={{ fontSize:".78rem", color:"var(--cr)", fontWeight:600 }}>Rs. {fmt(up * r.quantity)}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="do-review-card">
              <div className="do-review-head">💰 Pricing Summary</div>
              <div className="do-review-body">
                <div className="do-review-row">
                  <span className="do-review-key">Dress Subtotal</span>
                  <span className="do-review-val">Rs. {fmt(subtotal)}</span>
                </div>
                <div className="do-review-row">
                  <span className="do-review-key">Transport Price</span>
                  <span className="do-review-val" style={{ color:"var(--mu)", fontStyle:"italic" }}>
                    Set by admin after review
                  </span>
                </div>
                <div className="do-review-total-row">
                  <span className="do-review-total-label">Estimated Total</span>
                  <span className="do-review-total-val">Rs. {fmt(subtotal)}</span>
                </div>
              </div>
            </div>

            <div className="do-info">
              <Info size={14} style={{ flexShrink:0, marginTop:2 }}/>
              After submission, our team will review your request and set the transport price.
              You will then be able to accept or cancel the booking.
            </div>
          </>
        )}

        <div className="do-nav">
          <button className="do-back-btn"
            onClick={() => setStep(s => Math.max(s-1, 0))}
            style={{ visibility: step === 0 ? "hidden" : "visible" }}>
            <ChevronLeft size={14}/> Back
          </button>
          {step < 2 ? (
            <button className="do-next-btn" onClick={handleNext} disabled={!canNext()}>
              Next <ChevronRight size={14}/>
            </button>
          ) : (
            <button className="do-next-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? <><Loader2 size={14} className="animate-spin"/> Submitting…</>
                : <><Check size={14}/> Submit Booking</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DressOnlyBookingPage;

