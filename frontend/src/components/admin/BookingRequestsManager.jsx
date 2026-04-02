import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  Users, MapPin, Calendar, Phone, Music2, Shirt, Crown,
  ChevronDown, ChevronUp, Search, RefreshCw, Truck,
  CheckCircle2, XCircle, Trophy, Eye, ChevronRight
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{
    --cr:#8B1A1A;--cr-l:#B22222;--cr-g:rgba(139,26,26,.07);
    --go:#C9A84C;--go-l:#E2C56A;--go-g:rgba(201,168,76,.12);
    --in:#3730A3;--in-g:rgba(55,48,163,.07);
    --gn:#15803D;--gn-g:rgba(21,128,61,.07);
    --bg:#FAF7F4;--bg2:#F2EDE6;--surf:#fff;
    --bdr:rgba(201,168,76,.22);--tx:#1C1008;--mu:#7A6555;--su:#C4B5A8;
  }
  .ab-root{font-family:'DM Sans',sans-serif;min-height:100vh;
    background:linear-gradient(135deg,#f8f4f0 0%,#faf7f4 100%);padding:32px 24px 80px}
  .ab-head{margin-bottom:28px}
  .ab-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:var(--tx);margin-bottom:4px}
  .ab-title span{color:var(--cr)}
  .ab-sub{font-size:.85rem;color:var(--mu);font-weight:300}
  .ab-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:28px}
  .ab-stat{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:16px 18px;
    box-shadow:0 2px 0 rgba(201,168,76,.10),0 4px 14px rgba(139,26,26,.03)}
  .ab-stat-num{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;line-height:1}
  .ab-stat-label{font-size:.65rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--mu);margin-top:4px}
  .ab-stat-num.pending{color:#D97706}.ab-stat-num.price_set{color:var(--in)}
  .ab-stat-num.accepted{color:var(--gn)}.ab-stat-num.approved{color:var(--gn)}
  .ab-stat-num.rejected{color:var(--cr)}.ab-stat-num.completed{color:#7C3AED}
  .ab-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:20px}
  .ab-search-wrap{position:relative;flex:1;max-width:320px;min-width:200px}
  .ab-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--su);pointer-events:none}
  .ab-search{width:100%;padding:9px 12px 9px 33px;border:1px solid rgba(201,168,76,.25);border-radius:7px;
    background:var(--surf);font-family:'DM Sans',sans-serif;font-size:.85rem;color:var(--tx);
    outline:none;transition:border-color .2s,box-shadow .2s}
  .ab-search:focus{border-color:var(--go);box-shadow:0 0 0 3px var(--go-g)}
  .ab-search::placeholder{color:var(--su)}
  .ab-status-tabs{display:flex;gap:5px;flex-wrap:wrap}
  .ab-tab{padding:7px 13px;border-radius:40px;border:1px solid var(--bdr);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.70rem;font-weight:500;letter-spacing:.07em;
    text-transform:uppercase;color:var(--mu);cursor:pointer;transition:all .2s}
  .ab-tab.active{color:#fff;border-color:transparent}
  .ab-tab.ALL.active{background:var(--tx)}.ab-tab.PENDING.active{background:#D97706}
  .ab-tab.PRICE_SET.active{background:var(--in)}.ab-tab.ACCEPTED_WITH_PRICE.active{background:var(--gn)}
  .ab-tab.CANCELLED.active{background:#64748B}.ab-tab.APPROVED.active{background:var(--gn)}
  .ab-tab.REJECTED.active{background:var(--cr)}.ab-tab.COMPLETED.active{background:#7C3AED}
  .ab-refresh{padding:9px;border:1px solid var(--bdr);border-radius:7px;background:var(--surf);
    cursor:pointer;color:var(--mu);display:flex;align-items:center;transition:all .2s}
  .ab-refresh:hover{border-color:var(--go);color:var(--tx)}
  .ab-card{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;
    margin-bottom:14px;box-shadow:0 2px 0 rgba(201,168,76,.10),0 4px 16px rgba(139,26,26,.03);transition:box-shadow .25s}
  .ab-card:hover{box-shadow:0 2px 0 rgba(201,168,76,.18),0 8px 28px rgba(139,26,26,.06)}
  .ab-card-bar{height:3px}
  .ab-card-bar.PENDING{background:linear-gradient(90deg,#D97706,#F59E0B)}
  .ab-card-bar.PRICE_SET{background:linear-gradient(90deg,var(--in),#6366F1)}
  .ab-card-bar.ACCEPTED_WITH_PRICE{background:linear-gradient(90deg,var(--gn),#22C55E)}
  .ab-card-bar.CANCELLED{background:linear-gradient(90deg,#64748B,#94A3B8)}
  .ab-card-bar.APPROVED{background:linear-gradient(90deg,var(--gn),#16A34A)}
  .ab-card-bar.REJECTED{background:linear-gradient(90deg,var(--cr),#DC2626)}
  .ab-card-bar.COMPLETED{background:linear-gradient(90deg,#7C3AED,#A855F7)}
  .ab-card-head{padding:16px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .ab-card-left{flex:1;min-width:200px}
  .ab-card-pkg{font-family:'Cormorant Garamond',serif;font-size:1.20rem;font-weight:700;color:var(--tx);margin-bottom:4px}
  .ab-card-user{font-size:.78rem;color:var(--mu);margin-bottom:6px;display:flex;align-items:center;gap:5px}
  .ab-card-meta{display:flex;flex-wrap:wrap;gap:10px;font-size:.75rem;color:var(--mu)}
  .ab-card-meta-item{display:flex;align-items:center;gap:4px}
  .ab-card-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
  .ab-status{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:40px;
    font-size:.65rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
  .ab-status.PENDING{background:#FEF3C7;color:#92400E;border:1px solid #FCD34D}
  .ab-status.PRICE_SET{background:var(--in-g);color:var(--in);border:1px solid rgba(55,48,163,.22)}
  .ab-status.ACCEPTED_WITH_PRICE{background:var(--gn-g);color:var(--gn);border:1px solid rgba(21,128,61,.22)}
  .ab-status.CANCELLED{background:#F1F5F9;color:#64748B;border:1px solid #CBD5E1}
  .ab-status.APPROVED{background:var(--gn-g);color:var(--gn);border:1px solid rgba(21,128,61,.22)}
  .ab-status.REJECTED{background:var(--cr-g);color:var(--cr);border:1px solid rgba(139,26,26,.22)}
  .ab-status.COMPLETED{background:rgba(124,58,237,.08);color:#7C3AED;border:1px solid rgba(124,58,237,.22)}
  .ab-transport{display:flex;align-items:center;gap:5px;font-size:.80rem;color:var(--in);font-weight:600}
  .ab-actions{padding:12px 20px;border-top:1px solid var(--bdr);display:flex;align-items:center;
    gap:8px;flex-wrap:wrap;background:rgba(250,247,244,.60)}
  .ab-dd-wrap{position:relative;display:inline-block}
  .ab-dd-trigger{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:6px;
    cursor:pointer;border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.10);
    font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:500;letter-spacing:.07em;
    text-transform:uppercase;color:var(--tx);transition:all .2s}
  .ab-dd-trigger:hover{background:rgba(201,168,76,.18);border-color:var(--go)}
  .ab-dd-trigger .ab-dd-arrow{transition:transform .2s}
  .ab-dd-trigger.open .ab-dd-arrow{transform:rotate(180deg)}
  .ab-dd-menu{position:absolute;top:calc(100% + 6px);left:0;z-index:200;background:var(--surf);
    border:1px solid var(--bdr);border-radius:9px;
    box-shadow:0 8px 32px rgba(28,16,8,.10),0 2px 8px rgba(201,168,76,.08);
    min-width:210px;overflow:hidden;animation:abDdIn .18s ease}
  @keyframes abDdIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  .ab-dd-label{padding:8px 14px 6px;font-size:.60rem;font-weight:600;letter-spacing:.16em;
    text-transform:uppercase;color:var(--su);border-bottom:1px solid rgba(201,168,76,.12)}
  .ab-dd-item{display:flex;align-items:center;gap:8px;width:100%;padding:10px 14px;background:none;
    border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;
    color:var(--tx);text-align:left;transition:background .15s}
  .ab-dd-item:hover{background:var(--go-g)}
  .ab-dd-item .ab-dd-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
  .ab-dd-item.price .ab-dd-dot{background:var(--in)}.ab-dd-item.price{color:var(--in)}
  .ab-dd-item.approve .ab-dd-dot{background:var(--gn)}.ab-dd-item.approve{color:var(--gn)}
  .ab-dd-item.reject .ab-dd-dot{background:var(--cr)}.ab-dd-item.reject{color:var(--cr)}
  .ab-dd-item.complete .ab-dd-dot{background:#7C3AED}.ab-dd-item.complete{color:#7C3AED}
  .ab-dd-no-action{font-size:.72rem;color:var(--su);font-style:italic;padding:2px 0}
  .ab-toggle{width:100%;padding:10px 20px;background:none;border:none;border-top:1px solid var(--bdr);
    display:flex;align-items:center;justify-content:space-between;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:500;letter-spacing:.12em;
    text-transform:uppercase;color:var(--mu);transition:color .2s}
  .ab-toggle:hover{color:var(--cr)}
  .ab-details{padding:18px 20px;border-top:1px solid var(--bdr);background:rgba(250,247,244,.40);animation:abSlide .2s ease}
  @keyframes abSlide{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
  .ab-d-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:600px){.ab-d-grid{grid-template-columns:1fr}}
  .ab-d-section{margin-bottom:14px}
  .ab-d-title{font-size:.63rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
    color:var(--go);margin-bottom:8px;display:flex;align-items:center;gap:5px;
    padding-bottom:6px;border-bottom:1px solid rgba(201,168,76,.16)}
  .ab-d-row{display:flex;justify-content:space-between;padding:4px 0;gap:12px}
  .ab-d-key{font-size:.75rem;color:var(--mu);flex-shrink:0}
  .ab-d-val{font-size:.80rem;color:var(--tx);font-weight:500;text-align:right}
  .ab-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:5px;font-size:.68rem;margin:2px}
  .ab-chip.GROOM{background:var(--cr-g);border:1px solid rgba(139,26,26,.18);color:var(--cr)}
  .ab-chip.BEST_MAN{background:var(--in-g);border:1px solid rgba(55,48,163,.18);color:var(--in)}
  .ab-chip.PAGE_BOY{background:var(--go-g);border:1px solid rgba(201,168,76,.28);color:#8B6914}
  .ab-perf-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:5px;
    background:var(--in-g);border:1px solid rgba(55,48,163,.14);font-size:.68rem;color:var(--in);margin:2px}
  /* Pricing summary */
  .ab-price-box{background:rgba(139,26,26,.02);border:1px solid rgba(139,26,26,.10);
    border-radius:8px;padding:14px 16px;margin-top:4px}
  .ab-price-line{display:flex;justify-content:space-between;align-items:center;
    padding:5px 0;border-bottom:1px solid rgba(201,168,76,.09);gap:12px}
  .ab-price-line:last-child{border-bottom:none}
  .ab-price-line-k{font-size:.75rem;color:var(--mu)}
  .ab-price-line-v{font-size:.80rem;font-weight:500;text-align:right;color:var(--tx)}
  .ab-price-subtotal{display:flex;justify-content:space-between;align-items:center;
    padding:10px 0 4px;margin-top:6px;border-top:2px solid rgba(201,168,76,.22);gap:12px}
  .ab-price-subtotal-k{font-size:.72rem;font-weight:600;letter-spacing:.10em;text-transform:uppercase;color:var(--mu)}
  .ab-price-subtotal-v{font-family:'Cormorant Garamond',serif;font-size:1.30rem;font-weight:700;color:var(--cr)}
  .ab-price-grand{display:flex;justify-content:space-between;align-items:center;
    padding:8px 0 2px;gap:12px}
  .ab-price-grand-k{font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--tx)}
  .ab-price-grand-v{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--cr)}
  .ab-price-input{width:100%;padding:11px 14px;border:1px solid rgba(201,168,76,.28);border-radius:7px;
    font-family:'DM Sans',sans-serif;font-size:1rem;color:var(--tx);outline:none;
    transition:border-color .2s,box-shadow .2s;margin-top:8px}
  .ab-price-input:focus{border-color:var(--go);box-shadow:0 0 0 3px var(--go-g)}
  .ab-spinner{width:44px;height:44px;border-radius:50%;border:2px solid rgba(201,168,76,.15);
    border-top-color:var(--go);animation:abSpin .85s linear infinite;margin:60px auto;display:block}
  @keyframes abSpin{to{transform:rotate(360deg)}}
  .ab-empty{text-align:center;padding:64px 20px;color:var(--mu);font-size:.90rem}
`;

const fmt = (n) => new Intl.NumberFormat("en-LK").format(n || 0);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" }) : "—";

const STATUS_LABELS = {
  PENDING: "Pending", PRICE_SET: "Price Set", ACCEPTED_WITH_PRICE: "Accepted",
  CANCELLED: "Cancelled", APPROVED: "Approved", REJECTED: "Rejected", COMPLETED: "Completed",
};
const ALL_STATUSES = ["ALL","PENDING","PRICE_SET","ACCEPTED_WITH_PRICE","CANCELLED","APPROVED","REJECTED","COMPLETED"];

const getActions = (status) => {
  switch (status) {
    case "PENDING":
      return [
        { key: "set-price", label: "Set Transport Price", variant: "price",  icon: <Truck size={13} /> },
        { key: "reject",    label: "Reject",              variant: "reject", icon: <XCircle size={13} /> },
      ];
    case "PRICE_SET":
      return [{ key: "reject", label: "Reject", variant: "reject", icon: <XCircle size={13} /> }];
    case "ACCEPTED_WITH_PRICE":
      return [
        { key: "approve", label: "Approve", variant: "approve", icon: <CheckCircle2 size={13} /> },
        { key: "reject",  label: "Reject",  variant: "reject",  icon: <XCircle size={13} /> },
      ];
    case "APPROVED":
      return [{ key: "complete", label: "Mark as Completed", variant: "complete", icon: <Trophy size={13} /> }];
    default:
      return [];
  }
};

const StatusDropdown = ({ booking, onSetPrice, onApprove, onReject, onComplete }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const actions = getActions(booking.status);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleAction = (key) => {
    setOpen(false);
    switch (key) {
      case "set-price": return onSetPrice(booking);
      case "approve":   return onApprove(booking.requestId);
      case "reject":    return onReject(booking.requestId);
      case "complete":  return onComplete(booking.requestId);
    }
  };

  if (actions.length === 0)
    return <span className="ab-dd-no-action">No further actions available</span>;

  return (
    <div className="ab-dd-wrap" ref={wrapRef}>
      <button className={`ab-dd-trigger${open ? " open" : ""}`} onClick={() => setOpen((p) => !p)}>
        <ChevronRight size={12} /> Change Status
        <ChevronDown size={12} className="ab-dd-arrow" />
      </button>
      {open && (
        <div className="ab-dd-menu">
          <div className="ab-dd-label">Available Actions</div>
          {actions.map((action) => (
            <button key={action.key} className={`ab-dd-item ${action.variant}`}
              onClick={() => handleAction(action.key)}>
              <span className="ab-dd-dot" />{action.icon}{action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BookingRow = ({ booking, onSetPrice, onApprove, onReject, onComplete }) => {
  const [expanded, setExpanded] = useState(false);
  const s = booking.status;

  return (
    <div className="ab-card">
      <div className={`ab-card-bar ${s}`} />

      <div className="ab-card-head">
        <div className="ab-card-left">
          <div className="ab-card-pkg">{booking.specialPackageName}</div>
          <div className="ab-card-user"><Users size={11} /> {booking.userFullName} — {booking.userEmail}</div>
          <div className="ab-card-meta">
            <span className="ab-card-meta-item"><MapPin size={10} /> {booking.hotelName}, {booking.nearestCity}</span>
            <span className="ab-card-meta-item"><Calendar size={10} /> {fmtDate(booking.eventDate)}</span>
            <span className="ab-card-meta-item"><Phone size={10} /> {booking.contactNo}</span>
          </div>
        </div>
        <div className="ab-card-right">
          <span className={`ab-status ${s}`}>{STATUS_LABELS[s]}</span>
          {booking.transportPrice != null && (
            <span className="ab-transport"><Truck size={12} /> Rs. {fmt(booking.transportPrice)}</span>
          )}
          <span style={{ fontSize: ".68rem", color: "var(--mu)" }}>{fmtDate(booking.createdAt)}</span>
        </div>
      </div>

      <div className="ab-actions">
        <StatusDropdown booking={booking} onSetPrice={onSetPrice}
          onApprove={onApprove} onReject={onReject} onComplete={onComplete} />
      </div>

      <button className="ab-toggle" onClick={() => setExpanded((p) => !p)}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Eye size={12} /> View Full Details
        </span>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded && (
        <div className="ab-details">
          <div className="ab-d-grid">
            {/* Customer */}
            <div className="ab-d-section">
              <div className="ab-d-title"><Users size={9} /> Customer</div>
              {[["Full Name", booking.userFullName], ["Email", booking.userEmail], ["Phone", booking.userPhone]]
                .map(([k, v]) => (
                  <div key={k} className="ab-d-row">
                    <span className="ab-d-key">{k}</span>
                    <span className="ab-d-val">{v || "—"}</span>
                  </div>
                ))}
            </div>

            {/* Event */}
            <div className="ab-d-section">
              <div className="ab-d-title"><MapPin size={9} /> Event Details</div>
              {[
                ["Hotel",         booking.hotelName],
                ["City",          booking.nearestCity],
                ["Date",          fmtDate(booking.eventDate)],
                ["Contact",       booking.contactNo],
                ["Groom Arrival", booking.groomArrivalTime || "—"],
                ["Poruwa Start",  booking.poruwaStartTime  || "—"],
              ].map(([k, v]) => (
                <div key={k} className="ab-d-row">
                  <span className="ab-d-key">{k}</span>
                  <span className="ab-d-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {booking.specialNotes && (
            <div className="ab-d-section">
              <div className="ab-d-title">📝 Special Notes</div>
              <p style={{ fontSize: ".82rem", color: "var(--tx)", lineHeight: "1.6",
                background: "rgba(201,168,76,.05)", padding: "10px 12px",
                borderRadius: "6px", border: "1px solid rgba(201,168,76,.15)" }}>
                {booking.specialNotes}
              </p>
            </div>
          )}

          <div className="ab-d-grid">
            {/* Dress */}
            <div className="ab-d-section">
              <div className="ab-d-title"><Shirt size={9} /> Dress Selections</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {booking.dressSelections?.map((ds, i) => (
                  <span key={i} className={`ab-chip ${ds.role}`}>
                    {ds.role === "GROOM" ? <Crown size={8} /> : <Users size={8} />}
                    {ds.role.replace("_", " ")} — {ds.dressItemName}
                  </span>
                ))}
              </div>
            </div>

            {/* Dancing */}
            <div className="ab-d-section">
              <div className="ab-d-title"><Music2 size={9} /> Dancing</div>
              {booking.selectedDancingPackage ? (
                <>
                  <div className="ab-d-row">
                    <span className="ab-d-key">Package</span>
                    <span className="ab-d-val">{booking.selectedDancingPackage.name}</span>
                  </div>
                  <div className="ab-d-row">
                    <span className="ab-d-key">Price</span>
                    <span className="ab-d-val">Rs. {fmt(booking.selectedDancingPackage.totalPrice)}</span>
                  </div>
                </>
              ) : <span style={{ fontSize: ".78rem", color: "var(--mu)" }}>None selected</span>}

              {booking.extraPerformers?.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ fontSize: ".65rem", color: "var(--mu)", letterSpacing: ".10em",
                    textTransform: "uppercase", marginBottom: "5px" }}>Extra Performers</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {booking.extraPerformers.map((ep, i) => (
                      <span key={i} className="ab-perf-chip">
                        {ep.quantity} × {ep.performerTypeName}
                        <span style={{ opacity: .7 }}>&nbsp;(Rs. {fmt(ep.pricePerUnit * ep.quantity)})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ PRICING SUMMARY — reads stored DB values ══ */}
          <div className="ab-d-section">
            <div className="ab-d-title">💰 Pricing Summary</div>
            <div className="ab-price-box">

              <div className="ab-price-line">
                <span className="ab-price-line-k">Package Base Price</span>
                <span className="ab-price-line-v">Rs. {fmt(booking.specialPackageFinalPrice)}</span>
              </div>

              {booking.selectedDancingPackage && (
                <div className="ab-price-line">
                  <span className="ab-price-line-k">Dancing — {booking.selectedDancingPackage.name}</span>
                  <span className="ab-price-line-v" style={{ color: "var(--in)" }}>
                    Rs. {fmt(booking.selectedDancingPackage.totalPrice)}
                  </span>
                </div>
              )}

              {(booking.extraPerformers || []).map((ep, i) => (
                <div key={i} className="ab-price-line">
                  <span className="ab-price-line-k">
                    {ep.quantity} × {ep.performerTypeName}
                    <span style={{ color: "var(--su)", fontSize: ".70rem" }}>
                      &nbsp;@ Rs. {fmt(ep.pricePerUnit)}
                    </span>
                  </span>
                  <span className="ab-price-line-v" style={{ color: "var(--cr)" }}>
                    + Rs. {fmt(ep.pricePerUnit * ep.quantity)}
                  </span>
                </div>
              ))}

              {/* ── Booking subtotal from DB ── */}
              <div className="ab-price-subtotal">
                <span className="ab-price-subtotal-k">Booking Subtotal</span>
                <span className="ab-price-subtotal-v">Rs. {fmt(booking.bookingSubtotal)}</span>
              </div>

              {/* Transport */}
              <div className="ab-price-line" style={{ marginTop: "10px", paddingTop: "10px",
                borderTop: "1px dashed rgba(201,168,76,.22)" }}>
                <span className="ab-price-line-k">Transport Price (set by admin)</span>
                <span className="ab-price-line-v"
                  style={{ color: booking.transportPrice != null ? "var(--in)" : "var(--su)" }}>
                  {booking.transportPrice != null ? `Rs. ${fmt(booking.transportPrice)}` : "Not set yet"}
                </span>
              </div>

              {/* ── Grand total from DB — only shown when stored ── */}
              {booking.grandTotal != null && (
                <div className="ab-price-grand">
                  <span className="ab-price-grand-k">Grand Total (incl. transport)</span>
                  <span className="ab-price-grand-v">Rs. {fmt(booking.grandTotal)}</span>
                </div>
              )}

              <div className="ab-price-line" style={{ marginTop: "6px" }}>
                <span className="ab-price-line-k">Customer Accepted Price</span>
                <span className="ab-price-line-v">
                  {booking.finalPriceAccepted ? "✅ Yes" : "❌ No"}
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
const BookingRequestsManager = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch]       = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/booking-requests/special-packages");
      setBookings(res.data || []);
    } catch { toastError("Failed to load bookings."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleSetPrice = async (booking) => {
    const { value: price } = await MySwal.fire({
      title: "Set Transport Price",
      html: `
        <p style="font-size:.85rem;color:#7A6555;margin-bottom:6px">
          <strong>${booking.userFullName}</strong> — ${booking.hotelName}
        </p>
        <p style="font-size:.80rem;color:#3730A3;font-weight:600;margin-bottom:4px">
          Booking subtotal: Rs. ${new Intl.NumberFormat("en-LK").format(booking.bookingSubtotal || 0)}
        </p>
        <p style="font-size:.75rem;color:#7A6555;margin-bottom:2px">
          Enter the transport price to add on top ↓
        </p>
        <input id="swal-price" type="number" min="0" step="100" placeholder="e.g. 7500"
          class="ab-price-input" style="width:100%;padding:11px 14px;
          border:1px solid rgba(201,168,76,.28);border-radius:7px;font-size:1rem;
          outline:none;margin-top:6px" />
      `,
      confirmButtonColor: "#3730A3",
      cancelButtonColor: "#6b7280",
      showCancelButton: true,
      confirmButtonText: "Set Price",
      preConfirm: () => {
        const val = parseFloat(document.getElementById("swal-price").value);
        if (isNaN(val) || val < 0) { Swal.showValidationMessage("Please enter a valid price"); return false; }
        return val;
      },
    });
    if (price === undefined) return;
    try {
      await api.put(
        `/api/admin/booking-requests/special-packages/${booking.requestId}/set-price`,
        { transportPrice: price }
      );
      toastSuccess(`Transport price set: Rs. ${fmt(price)}`);
      fetchBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed to set price."); }
  };

  const handleApprove = async (requestId) => {
    const result = await MySwal.fire({
      title: "Approve Booking?",
      text: "The customer will be notified that their booking is approved.",
      icon: "question", showCancelButton: true,
      confirmButtonColor: "#15803D", confirmButtonText: "Yes, Approve",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/admin/booking-requests/special-packages/${requestId}/approve`);
      toastSuccess("Booking approved!"); fetchBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed to approve."); }
  };

  const handleReject = async (requestId) => {
    const result = await MySwal.fire({
      title: "Reject Booking?",
      text: "This will permanently reject this booking request.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#8B1A1A", confirmButtonText: "Yes, Reject",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/admin/booking-requests/special-packages/${requestId}/reject`);
      toastSuccess("Booking rejected."); fetchBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed to reject."); }
  };

  const handleComplete = async (requestId) => {
    const result = await MySwal.fire({
      title: "Mark as Completed?",
      text: "This confirms the event has taken place successfully.",
      icon: "success", showCancelButton: true,
      confirmButtonColor: "#7C3AED", confirmButtonText: "Yes, Mark Complete",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/admin/booking-requests/special-packages/${requestId}/complete`);
      toastSuccess("Booking marked as completed!"); fetchBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed to complete."); }
  };

  const filtered = bookings
    .filter((b) => activeTab === "ALL" || b.status === activeTab)
    .filter((b) =>
      !search ||
      [b.userFullName, b.userEmail, b.hotelName, b.nearestCity, b.specialPackageName]
        .some((f) => f?.toLowerCase().includes(search.toLowerCase()))
    );

  const count = (s) => s === "ALL" ? bookings.length : bookings.filter((b) => b.status === s).length;
  const stats = {
    total: bookings.length, pending: count("PENDING"), priceSet: count("PRICE_SET"),
    accepted: count("ACCEPTED_WITH_PRICE"), approved: count("APPROVED"),
    completed: count("COMPLETED"), rejected: count("REJECTED") + count("CANCELLED"),
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ab-root">
        <div className="ab-head">
          <h1 className="ab-title">Booking <span>Requests</span></h1>
          <p className="ab-sub">Manage all special package booking requests from customers</p>
        </div>

        <div className="ab-stats">
          {[
            { label: "Total",     val: stats.total,     cls: "" },
            { label: "Pending",   val: stats.pending,   cls: "pending" },
            { label: "Price Set", val: stats.priceSet,  cls: "price_set" },
            { label: "Accepted",  val: stats.accepted,  cls: "accepted" },
            { label: "Approved",  val: stats.approved,  cls: "approved" },
            { label: "Completed", val: stats.completed, cls: "completed" },
            { label: "Rejected",  val: stats.rejected,  cls: "rejected" },
          ].map(({ label, val, cls }) => (
            <div key={label} className="ab-stat">
              <div className={`ab-stat-num ${cls}`}>{val}</div>
              <div className="ab-stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="ab-toolbar">
          <div className="ab-search-wrap">
            <Search size={13} className="ab-search-ico" />
            <input type="text" className="ab-search"
              placeholder="Search by name, hotel, package..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="ab-refresh" onClick={fetchBookings}><RefreshCw size={14} /></button>
        </div>

        <div className="ab-status-tabs" style={{ marginBottom: "20px" }}>
          {ALL_STATUSES.map((s) => (
            <button key={s}
              className={`ab-tab ${s}${activeTab === s ? " active" : ""}`}
              onClick={() => setActiveTab(s)}>
              {s === "ALL" ? "All" : STATUS_LABELS[s]} ({count(s)})
            </button>
          ))}
        </div>

        {loading ? <div className="ab-spinner" />
          : filtered.length === 0 ? <div className="ab-empty">No bookings found.</div>
          : filtered.map((b) => (
              <BookingRow key={b.requestId} booking={b}
                onSetPrice={handleSetPrice}
                onApprove={handleApprove}
                onReject={handleReject}
                onComplete={handleComplete}
              />
            ))
        }
      </div>
    </>
  );
};

export default BookingRequestsManager;


