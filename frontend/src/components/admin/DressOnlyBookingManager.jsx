import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  Users, MapPin, Calendar, Phone, Shirt,
  Crown, ChevronDown, ChevronUp, Search,
  RefreshCw, Truck, CheckCircle2, XCircle,
  Trophy, Eye, ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{--cr:#8B1A1A;--cr-l:#B22222;--cr-g:rgba(139,26,26,.07);
    --go:#C9A84C;--go-l:#E2C56A;--go-g:rgba(201,168,76,.12);
    --in:#3730A3;--in-g:rgba(55,48,163,.07);--gn:#15803D;--gn-g:rgba(21,128,61,.07);
    --bg:#FAF7F4;--bg2:#F2EDE6;--surf:#fff;
    --bdr:rgba(201,168,76,.22);--tx:#1C1008;--mu:#7A6555;--su:#C4B5A8;}
  .db-root{font-family:'DM Sans',sans-serif;min-height:100vh;
    background:linear-gradient(135deg,#f8f4f0 0%,#faf7f4 100%);padding:28px 24px 80px}
  .db-head{margin-bottom:24px}
  .db-title{font-family:'Cormorant Garamond',serif;font-size:2.1rem;font-weight:700;color:var(--tx);margin-bottom:4px}
  .db-title span{color:var(--cr)} .db-sub{font-size:.82rem;color:var(--mu);font-weight:300}
  .db-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:24px}
  .db-stat{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:14px 16px;
    box-shadow:0 2px 0 rgba(201,168,76,.08),0 4px 12px rgba(28,16,8,.03)}
  .db-stat-num{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:700;line-height:1}
  .db-stat-label{font-size:.62rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);margin-top:3px}
  .db-stat-num.pending{color:#D97706}.db-stat-num.price_set{color:var(--in)}
  .db-stat-num.accepted{color:var(--gn)}.db-stat-num.approved{color:var(--gn)}
  .db-stat-num.rejected{color:var(--cr)}.db-stat-num.completed{color:#7C3AED}
  .db-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:18px}
  .db-search-wrap{position:relative;flex:1;max-width:300px;min-width:180px}
  .db-search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--su);pointer-events:none}
  .db-search{width:100%;padding:8px 12px 8px 32px;border:1px solid rgba(201,168,76,.25);border-radius:7px;
    background:var(--surf);font-family:'DM Sans',sans-serif;font-size:.82rem;color:var(--tx);outline:none}
  .db-search:focus{border-color:var(--go);box-shadow:0 0 0 3px var(--go-g)}
  .db-tabs{display:flex;gap:5px;flex-wrap:wrap}
  .db-tab{padding:6px 12px;border-radius:40px;border:1px solid var(--bdr);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:500;letter-spacing:.07em;
    text-transform:uppercase;color:var(--mu);cursor:pointer;transition:all .2s}
  .db-tab.active{color:#fff;border-color:transparent}
  .db-tab.ALL.active{background:var(--tx)}.db-tab.PENDING.active{background:#D97706}
  .db-tab.PRICE_SET.active{background:var(--in)}.db-tab.ACCEPTED_WITH_PRICE.active{background:var(--gn)}
  .db-tab.CANCELLED.active{background:#64748B}.db-tab.APPROVED.active{background:var(--gn)}
  .db-tab.REJECTED.active{background:var(--cr)}.db-tab.COMPLETED.active{background:#7C3AED}
  .db-refresh{padding:8px;border:1px solid var(--bdr);border-radius:7px;background:var(--surf);
    cursor:pointer;color:var(--mu);display:flex;align-items:center;transition:all .2s}
  .db-refresh:hover{border-color:var(--go);color:var(--tx)}
  .db-card{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;
    margin-bottom:12px;box-shadow:0 2px 0 rgba(201,168,76,.08),0 4px 14px rgba(28,16,8,.03);transition:box-shadow .25s}
  .db-card:hover{box-shadow:0 2px 0 rgba(201,168,76,.16),0 8px 24px rgba(28,16,8,.05)}
  .db-card-bar{height:3px}
  .db-card-bar.PENDING{background:linear-gradient(90deg,#D97706,#F59E0B)}
  .db-card-bar.PRICE_SET{background:linear-gradient(90deg,var(--in),#6366F1)}
  .db-card-bar.ACCEPTED_WITH_PRICE{background:linear-gradient(90deg,var(--gn),#22C55E)}
  .db-card-bar.CANCELLED{background:linear-gradient(90deg,#64748B,#94A3B8)}
  .db-card-bar.APPROVED{background:linear-gradient(90deg,var(--gn),#16A34A)}
  .db-card-bar.REJECTED{background:linear-gradient(90deg,var(--cr),#DC2626)}
  .db-card-bar.COMPLETED{background:linear-gradient(90deg,#7C3AED,#A855F7)}
  .db-card-head{padding:14px 18px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .db-card-left{flex:1;min-width:180px}
  .db-card-pkg{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:var(--tx);margin-bottom:3px}
  .db-card-user{font-size:.76rem;color:var(--mu);margin-bottom:5px;display:flex;align-items:center;gap:4px}
  .db-card-meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.72rem;color:var(--mu)}
  .db-card-meta-item{display:flex;align-items:center;gap:3px}
  .db-card-right{display:flex;flex-direction:column;align-items:flex-end;gap:7px}
  .db-status{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:40px;
    font-size:.63rem;font-weight:600;letter-spacing:.07em;text-transform:uppercase}
  .db-status.PENDING{background:#FEF3C7;color:#92400E;border:1px solid #FCD34D}
  .db-status.PRICE_SET{background:var(--in-g);color:var(--in);border:1px solid rgba(55,48,163,.22)}
  .db-status.ACCEPTED_WITH_PRICE{background:var(--gn-g);color:var(--gn);border:1px solid rgba(21,128,61,.22)}
  .db-status.CANCELLED{background:#F1F5F9;color:#64748B;border:1px solid #CBD5E1}
  .db-status.APPROVED{background:var(--gn-g);color:var(--gn);border:1px solid rgba(21,128,61,.22)}
  .db-status.REJECTED{background:var(--cr-g);color:var(--cr);border:1px solid rgba(139,26,26,.22)}
  .db-status.COMPLETED{background:rgba(124,58,237,.08);color:#7C3AED;border:1px solid rgba(124,58,237,.22)}
  .db-transport{display:flex;align-items:center;gap:4px;font-size:.78rem;color:var(--in);font-weight:600}
  .db-actions{padding:10px 18px;border-top:1px solid var(--bdr);display:flex;align-items:center;
    gap:7px;flex-wrap:wrap;background:rgba(250,247,244,.60)}
  .db-dd-wrap{position:relative;display:inline-block}
  .db-dd-trigger{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;
    cursor:pointer;border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.10);
    font-family:'DM Sans',sans-serif;font-size:.70rem;font-weight:500;letter-spacing:.06em;
    text-transform:uppercase;color:var(--tx);transition:all .2s}
  .db-dd-trigger:hover{background:rgba(201,168,76,.18);border-color:var(--go)}
  .db-dd-menu{position:absolute;top:calc(100% + 5px);left:0;z-index:200;background:var(--surf);
    border:1px solid var(--bdr);border-radius:9px;
    box-shadow:0 8px 28px rgba(28,16,8,.10);min-width:200px;overflow:hidden}
  .db-dd-label{padding:7px 12px 5px;font-size:.58rem;font-weight:600;letter-spacing:.16em;
    text-transform:uppercase;color:var(--su);border-bottom:1px solid rgba(201,168,76,.10)}
  .db-dd-item{display:flex;align-items:center;gap:7px;width:100%;padding:9px 12px;background:none;
    border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.76rem;font-weight:500;
    color:var(--tx);text-align:left;transition:background .15s}
  .db-dd-item:hover{background:var(--go-g)}
  .db-dd-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .db-dd-item.price .db-dd-dot{background:var(--in)}.db-dd-item.price{color:var(--in)}
  .db-dd-item.approve .db-dd-dot{background:var(--gn)}.db-dd-item.approve{color:var(--gn)}
  .db-dd-item.reject .db-dd-dot{background:var(--cr)}.db-dd-item.reject{color:var(--cr)}
  .db-dd-item.complete .db-dd-dot{background:#7C3AED}.db-dd-item.complete{color:#7C3AED}
  .db-detail-toggle{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:6px;
    border:1px solid var(--bdr);background:transparent;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.70rem;color:var(--mu);transition:all .2s}
  .db-detail-toggle:hover{border-color:var(--go);color:var(--tx)}
  .db-detail-panel{border-top:1px solid var(--bdr);padding:16px 18px;background:rgba(250,247,244,.5)}
  .db-detail-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:14px}
  .db-detail-item{display:flex;flex-direction:column;gap:2px}
  .db-detail-key{font-size:.63rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--su)}
  .db-detail-val{font-size:.82rem;color:var(--tx);font-weight:400}
  .db-dress-list{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}
  .db-dress-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:6px;
    font-size:.72rem;border:1px solid var(--bdr);background:var(--go-g);color:var(--tx)}
  .db-price-row{display:flex;gap:20px;flex-wrap:wrap;padding:10px 12px;
    background:rgba(139,26,26,.04);border-radius:8px;border:1px solid rgba(139,26,26,.10);margin-top:10px}
  .db-price-item{display:flex;flex-direction:column;gap:2px}
  .db-price-key{font-size:.60rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--su)}
  .db-price-val{font-family:'Cormorant Garamond',serif;font-size:1.10rem;font-weight:700;color:var(--cr)}
  .db-empty{text-align:center;padding:48px 24px;color:var(--mu);font-size:.88rem}
`;

/* ─── Helpers ─────────────────────────────────────────────── */
const fmt = (n) => n != null ? new Intl.NumberFormat("en-LK").format(n) : "—";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB",
  { day:"2-digit", month:"short", year:"numeric" }) : "—";

const STATUSES = ["ALL","PENDING","PRICE_SET","ACCEPTED_WITH_PRICE","APPROVED","REJECTED","COMPLETED","CANCELLED"];
const ROLE_BADGE = { GROOM:"#8B6914", BEST_MAN:"#3730A3", PAGE_BOY:"#8B1A1A" };
const ROLE_BG    = { GROOM:"rgba(201,168,76,.10)", BEST_MAN:"rgba(55,48,163,.08)", PAGE_BOY:"rgba(139,26,26,.07)" };

/* ═══════════════════════════════════════════════════════════ */
const DressOnlyBookingManager = () => {
  const [bookings,  setBookings]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [statusTab, setStatusTab] = useState("ALL");
  const [loading,   setLoading]   = useState(true);
  const [expanded,  setExpanded]  = useState({});
  const [openDd,    setOpenDd]    = useState(null);
  const ddRefs = useRef({});

  /* ── inject CSS ── */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-component", "dress-only-manager");
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
    return () => { if (document.head.contains(tag)) document.head.removeChild(tag); };
  }, []);

  /* ── close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (openDd && ddRefs.current[openDd] && !ddRefs.current[openDd].contains(e.target))
        setOpenDd(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDd]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/booking-requests/dress-only");
      setBookings(res.data || []);
    } catch { toastError("Failed to load bookings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  /* ── Stats ── */
  const counts = STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.status === s).length; return acc;
  }, {});

  /* ── Filter ── */
  const filtered = bookings.filter(b => {
    const matchStatus = statusTab === "ALL" || b.status === statusTab;
    const q = search.toLowerCase();
    const matchSearch = !q || b.userFullName?.toLowerCase().includes(q)
      || b.userEmail?.toLowerCase().includes(q) || b.hotelName?.toLowerCase().includes(q)
      || b.nearestCity?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  /* ── Actions ── */
  const doAction = async (action, b) => {
    setOpenDd(null);
    if (action === "price") {
      const { value } = await MySwal.fire({
        title: "Set Transport Price",
        input: "number", inputLabel: "Transport Price (Rs.)", inputPlaceholder: "e.g. 5000",
        showCancelButton: true, confirmButtonColor: "#3730A3",
        inputValidator: (v) => (!v || isNaN(v) || Number(v) < 0) ? "Enter a valid price" : undefined,
      });
      if (!value) return;
      try {
        await api.put(`/api/admin/booking-requests/dress-only/${b.requestId}/set-price`,
          { transportPrice: Number(value) });
        toastSuccess("Transport price set!");
        fetchBookings();
      } catch (e) { toastError(e.response?.data?.message || "Failed"); }
      return;
    }
    const map = {
      approve:  { url:"approve",  text:"Approve this booking?",   color:"#15803D" },
      reject:   { url:"reject",   text:"Reject this booking?",    color:"#8B1A1A" },
      complete: { url:"complete", text:"Mark this as completed?", color:"#7C3AED" },
    };
    const cfg = map[action]; if (!cfg) return;
    const res = await MySwal.fire({
      title: cfg.text, icon: "question", showCancelButton: true,
      confirmButtonColor: cfg.color, confirmButtonText: "Yes, proceed",
    });
    if (!res.isConfirmed) return;
    try {
      await api.put(`/api/admin/booking-requests/dress-only/${b.requestId}/${cfg.url}`);
      toastSuccess("Done!");
      fetchBookings();
    } catch (e) { toastError(e.response?.data?.message || "Failed"); }
  };

  /* ── Available actions per status ── */
  const getActions = (status) => {
    if (status === "PENDING")              return ["price","reject"];
    if (status === "PRICE_SET")            return ["reject"];
    if (status === "ACCEPTED_WITH_PRICE")  return ["approve","reject"];
    if (status === "APPROVED")             return ["complete"];
    return [];
  };

  const ACTION_CFG = {
    price:   { label:"Set Transport Price", cls:"price",   icon:<Truck size={13}/> },
    approve: { label:"Approve",             cls:"approve", icon:<CheckCircle2 size={13}/> },
    reject:  { label:"Reject",              cls:"reject",  icon:<XCircle size={13}/> },
    complete:{ label:"Mark Completed",      cls:"complete",icon:<Trophy size={13}/> },
  };

  return (
    <div className="db-root">
      <div className="db-head">
        <h1 className="db-title">Dress-Only <span>Bookings</span></h1>
        <p className="db-sub">Manage all dress-only booking requests</p>
      </div>

      {/* Stats */}
      <div className="db-stats">
        {[
          ["Total",     bookings.length, ""],
          ["Pending",   counts.PENDING,           "pending"],
          ["Price Set", counts.PRICE_SET,          "price_set"],
          ["Accepted",  counts.ACCEPTED_WITH_PRICE,"accepted"],
          ["Approved",  counts.APPROVED,           "approved"],
          ["Completed", counts.COMPLETED,          "completed"],
          ["Rejected",  counts.REJECTED,           "rejected"],
        ].map(([label, value, cls]) => (
          <div key={label} className="db-stat">
            <div className={`db-stat-num ${cls}`}>{value}</div>
            <div className="db-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="db-toolbar">
        <div className="db-search-wrap">
          <Search size={14} className="db-search-ico" />
          <input className="db-search" placeholder="Search name, email, hotel…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="db-tabs">
          {STATUSES.map(s => (
            <button key={s} className={`db-tab ${s} ${statusTab === s ? "active" : ""}`}
              onClick={() => setStatusTab(s)}>
              {s === "ALL" ? "All" : s === "ACCEPTED_WITH_PRICE" ? "Accepted" : s.replace("_"," ")}
            </button>
          ))}
        </div>
        <button className="db-refresh" onClick={fetchBookings} title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="db-empty">Loading bookings…</div>
      ) : filtered.length === 0 ? (
        <div className="db-empty">No bookings found matching your filters.</div>
      ) : (
        filtered.map(b => {
          const actions = getActions(b.status);
          const isExpanded = expanded[b.requestId];
          return (
            <div key={b.requestId} className="db-card">
              <div className={`db-card-bar ${b.status}`} />
              <div className="db-card-head">
                <div className="db-card-left">
                  <div className="db-card-pkg">
                    <Shirt size={14} style={{ verticalAlign:"middle", marginRight:5, color:"var(--go)" }} />
                    Dress-Only Request
                  </div>
                  <div className="db-card-user">
                    <Users size={11} /> {b.userFullName}
                    <span style={{ color:"var(--su)" }}>·</span> {b.userEmail}
                  </div>
                  <div className="db-card-meta">
                    <span className="db-card-meta-item"><Calendar size={11}/> {b.eventDate}</span>
                    <span className="db-card-meta-item"><MapPin size={11}/> {b.hotelName}, {b.nearestCity}</span>
                    <span className="db-card-meta-item"><Phone size={11}/> {b.contactNo}</span>
                  </div>
                </div>
                <div className="db-card-right">
                  <span className={`db-status ${b.status}`}>{b.status.replace("_"," ")}</span>
                  {b.transportPrice != null && (
                    <span className="db-transport">
                      <Truck size={12}/> Rs. {fmt(b.transportPrice)}
                    </span>
                  )}
                  {b.grandTotal != null && (
                    <span style={{ fontSize:".80rem", fontWeight:700, color:"var(--cr)",
                      fontFamily:"'Cormorant Garamond',serif" }}>
                      Total: Rs. {fmt(b.grandTotal)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions row */}
              <div className="db-actions">
                {actions.length > 0 && (
                  <div className="db-dd-wrap"
                    ref={el => ddRefs.current[b.requestId] = el}>
                    <button className="db-dd-trigger"
                      onClick={() => setOpenDd(openDd === b.requestId ? null : b.requestId)}>
                      Actions {openDd === b.requestId ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                    </button>
                    {openDd === b.requestId && (
                      <div className="db-dd-menu">
                        <div className="db-dd-label">Available Actions</div>
                        {actions.map(a => (
                          <button key={a} className={`db-dd-item ${ACTION_CFG[a].cls}`}
                            onClick={() => doAction(a, b)}>
                            <span className="db-dd-dot"/>
                            {ACTION_CFG[a].icon} {ACTION_CFG[a].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button className="db-detail-toggle"
                  onClick={() => setExpanded(p => ({ ...p, [b.requestId]: !p[b.requestId] }))}>
                  {isExpanded ? <><ChevronUp size={13}/> Hide Details</> : <><Eye size={13}/> View Details</>}
                </button>
              </div>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="db-detail-panel">
                  <div className="db-detail-grid">
                    {[
                      ["Groom Arrival",  b.groomArrivalTime || "—"],
                      ["Poruwa Start",   b.poruwaStartTime  || "—"],
                      ["Notes",          b.specialNotes     || "—"],
                      ["Submitted",      fmtDate(b.createdAt)],
                      ["Last Updated",   fmtDate(b.updatedAt)],
                    ].map(([k, v]) => (
                      <div key={k} className="db-detail-item">
                        <span className="db-detail-key">{k}</span>
                        <span className="db-detail-val">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dress selections */}
                  {b.dressSelections?.length > 0 && (
                    <>
                      <div style={{ fontSize:".63rem", fontWeight:700, letterSpacing:".12em",
                        textTransform:"uppercase", color:"var(--su)", marginBottom:8 }}>
                        Dress Selections
                      </div>
                      <div className="db-dress-list">
                        {b.dressSelections.map((s, i) => (
                          <span key={i} className="db-dress-chip"
                            style={{ background: ROLE_BG[s.role], borderColor:"transparent",
                              color: ROLE_BADGE[s.role] }}>
                            <Crown size={10} />
                            {s.role.replace("_"," ")} · {s.dressItemName}
                            <span style={{ color:"var(--mu)", marginLeft:3 }}>({s.categoryName})</span>
                            <span style={{ fontWeight:700, marginLeft:3 }}>×{s.quantity}</span>
                            {s.unitPrice && (
                              <span style={{ marginLeft:4, fontWeight:700 }}>
                                = Rs. {fmt(s.lineTotal)}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Price summary */}
                  <div className="db-price-row">
                    <div className="db-price-item">
                      <span className="db-price-key">Dress Subtotal</span>
                      <span className="db-price-val">Rs. {fmt(b.bookingSubtotal)}</span>
                    </div>
                    {b.transportPrice != null && (
                      <div className="db-price-item">
                        <span className="db-price-key">Transport</span>
                        <span className="db-price-val" style={{ color:"var(--in)" }}>
                          Rs. {fmt(b.transportPrice)}
                        </span>
                      </div>
                    )}
                    {b.grandTotal != null && (
                      <div className="db-price-item">
                        <span className="db-price-key">Final Total Bill</span>
                        <span className="db-price-val">Rs. {fmt(b.grandTotal)}</span>
                      </div>
                    )}
                    <div className="db-price-item">
                      <span className="db-price-key">Price Accepted</span>
                      <span className="db-price-val" style={{
                        color: b.finalPriceAccepted ? "var(--gn)" : "var(--mu)",
                        fontSize:".85rem" }}>
                        {b.finalPriceAccepted ? "Yes ✓" : "Not yet"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DressOnlyBookingManager;
