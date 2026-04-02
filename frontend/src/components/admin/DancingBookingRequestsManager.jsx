import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  Users,
  MapPin,
  Calendar,
  Phone,
  Music2,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Truck,
  CheckCircle2,
  XCircle,
  Trophy,
  Eye,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

/* ─── CSS (same design language as BookingRequestsManager) ── */
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
  .dab-root{font-family:'DM Sans',sans-serif;min-height:100vh;
    background:linear-gradient(135deg,#f8f4f0 0%,#faf7f4 100%);padding:32px 24px 80px}
  .dab-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:var(--tx);margin-bottom:4px}
  .dab-title span{color:var(--in)}
  .dab-sub{font-size:.85rem;color:var(--mu);font-weight:300;margin-bottom:28px}
  .dab-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-bottom:28px}
  .dab-stat{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:16px 18px;
    box-shadow:0 2px 0 rgba(201,168,76,.10),0 4px 14px rgba(55,48,163,.03)}
  .dab-stat-num{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;line-height:1}
  .dab-stat-label{font-size:.65rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--mu);margin-top:4px}
  .dab-stat-num.pending{color:#D97706}.dab-stat-num.price_set{color:var(--in)}
  .dab-stat-num.accepted{color:var(--gn)}.dab-stat-num.approved{color:var(--gn)}
  .dab-stat-num.rejected{color:var(--cr)}.dab-stat-num.completed{color:#7C3AED}
  .dab-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:20px}
  .dab-search-wrap{position:relative;flex:1;max-width:320px;min-width:200px}
  .dab-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--su);pointer-events:none}
  .dab-search{width:100%;padding:9px 12px 9px 33px;border:1px solid rgba(201,168,76,.25);border-radius:7px;
    background:var(--surf);font-family:'DM Sans',sans-serif;font-size:.85rem;color:var(--tx);outline:none}
  .dab-search:focus{border-color:var(--go);box-shadow:0 0 0 3px var(--go-g)}
  .dab-tabs{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:20px}
  .dab-tab{padding:7px 13px;border-radius:40px;border:1px solid var(--bdr);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.70rem;font-weight:500;letter-spacing:.07em;
    text-transform:uppercase;color:var(--mu);cursor:pointer;transition:all .2s}
  .dab-tab.active{color:#fff;border-color:transparent}
  .dab-tab.ALL.active{background:var(--tx)}.dab-tab.PENDING.active{background:#D97706}
  .dab-tab.PRICE_SET.active{background:var(--in)}.dab-tab.ACCEPTED_WITH_PRICE.active{background:var(--gn)}
  .dab-tab.CANCELLED.active{background:#64748B}.dab-tab.APPROVED.active{background:var(--gn)}
  .dab-tab.REJECTED.active{background:var(--cr)}.dab-tab.COMPLETED.active{background:#7C3AED}
  .dab-refresh{padding:9px;border:1px solid var(--bdr);border-radius:7px;background:var(--surf);
    cursor:pointer;color:var(--mu);display:flex;align-items:center}
  .dab-card{background:var(--surf);border:1px solid var(--bdr);border-radius:12px;overflow:hidden;
    margin-bottom:14px;box-shadow:0 2px 0 rgba(201,168,76,.10),0 4px 16px rgba(55,48,163,.03);transition:box-shadow .25s}
  .dab-card:hover{box-shadow:0 2px 0 rgba(201,168,76,.18),0 8px 28px rgba(55,48,163,.06)}
  .dab-card-bar{height:3px}
  .dab-card-bar.PENDING{background:linear-gradient(90deg,#D97706,#F59E0B)}
  .dab-card-bar.PRICE_SET{background:linear-gradient(90deg,var(--in),#6366F1)}
  .dab-card-bar.ACCEPTED_WITH_PRICE{background:linear-gradient(90deg,var(--gn),#22C55E)}
  .dab-card-bar.CANCELLED{background:linear-gradient(90deg,#64748B,#94A3B8)}
  .dab-card-bar.APPROVED{background:linear-gradient(90deg,var(--gn),#16A34A)}
  .dab-card-bar.REJECTED{background:linear-gradient(90deg,var(--cr),#DC2626)}
  .dab-card-bar.COMPLETED{background:linear-gradient(90deg,#7C3AED,#A855F7)}
  .dab-card-head{padding:16px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .dab-card-pkg{font-family:'Cormorant Garamond',serif;font-size:1.20rem;font-weight:700;color:var(--tx);margin-bottom:4px}
  .dab-card-user{font-size:.78rem;color:var(--mu);margin-bottom:6px;display:flex;align-items:center;gap:5px}
  .dab-card-meta{display:flex;flex-wrap:wrap;gap:10px;font-size:.75rem;color:var(--mu)}
  .dab-card-meta-item{display:flex;align-items:center;gap:4px}
  .dab-status{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:40px;
    font-size:.65rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
  .dab-status.PENDING{background:#FEF3C7;color:#92400E;border:1px solid #FCD34D}
  .dab-status.PRICE_SET{background:var(--in-g);color:var(--in);border:1px solid rgba(55,48,163,.22)}
  .dab-status.ACCEPTED_WITH_PRICE{background:var(--gn-g);color:var(--gn);border:1px solid rgba(21,128,61,.22)}
  .dab-status.CANCELLED{background:#F1F5F9;color:#64748B;border:1px solid #CBD5E1}
  .dab-status.APPROVED{background:var(--gn-g);color:var(--gn);border:1px solid rgba(21,128,61,.22)}
  .dab-status.REJECTED{background:var(--cr-g);color:var(--cr);border:1px solid rgba(139,26,26,.22)}
  .dab-status.COMPLETED{background:rgba(124,58,237,.08);color:#7C3AED;border:1px solid rgba(124,58,237,.22)}
  .dab-transport{display:flex;align-items:center;gap:5px;font-size:.80rem;color:var(--in);font-weight:600}
  .dab-actions{padding:12px 20px;border-top:1px solid var(--bdr);display:flex;align-items:center;
    gap:8px;flex-wrap:wrap;background:rgba(250,247,244,.60)}
  .dab-dd-wrap{position:relative;display:inline-block}
  .dab-dd-trigger{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:6px;
    cursor:pointer;border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.10);
    font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:500;letter-spacing:.07em;
    text-transform:uppercase;color:var(--tx);transition:all .2s}
  .dab-dd-trigger:hover{background:rgba(201,168,76,.18);border-color:var(--go)}
  .dab-dd-trigger .dab-dd-arrow{transition:transform .2s}
  .dab-dd-trigger.open .dab-dd-arrow{transform:rotate(180deg)}
  .dab-dd-menu{position:absolute;top:calc(100% + 6px);left:0;z-index:200;background:var(--surf);
    border:1px solid var(--bdr);border-radius:9px;
    box-shadow:0 8px 32px rgba(28,16,8,.10);min-width:210px;overflow:hidden;animation:dabDdIn .18s ease}
  @keyframes dabDdIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  .dab-dd-label{padding:8px 14px 6px;font-size:.60rem;font-weight:600;letter-spacing:.16em;
    text-transform:uppercase;color:var(--su);border-bottom:1px solid rgba(201,168,76,.12)}
  .dab-dd-item{display:flex;align-items:center;gap:8px;width:100%;padding:10px 14px;background:none;
    border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;
    color:var(--tx);text-align:left;transition:background .15s}
  .dab-dd-item:hover{background:var(--go-g)}
  .dab-dd-item .dab-dd-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
  .dab-dd-item.price .dab-dd-dot{background:var(--in)}.dab-dd-item.price{color:var(--in)}
  .dab-dd-item.approve .dab-dd-dot{background:var(--gn)}.dab-dd-item.approve{color:var(--gn)}
  .dab-dd-item.reject .dab-dd-dot{background:var(--cr)}.dab-dd-item.reject{color:var(--cr)}
  .dab-dd-item.complete .dab-dd-dot{background:#7C3AED}.dab-dd-item.complete{color:#7C3AED}
  .dab-dd-no-action{font-size:.72rem;color:var(--su);font-style:italic;padding:2px 0}
  .dab-toggle{width:100%;padding:10px 20px;background:none;border:none;border-top:1px solid var(--bdr);
    display:flex;align-items:center;justify-content:space-between;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:500;letter-spacing:.12em;
    text-transform:uppercase;color:var(--mu);transition:color .2s}
  .dab-toggle:hover{color:var(--cr)}
  .dab-details{padding:18px 20px;border-top:1px solid var(--bdr);background:rgba(250,247,244,.40);animation:dabSlide .2s ease}
  @keyframes dabSlide{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
  .dab-d-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:600px){.dab-d-grid{grid-template-columns:1fr}}
  .dab-d-section{margin-bottom:14px}
  .dab-d-title{font-size:.63rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
    color:var(--go);margin-bottom:8px;display:flex;align-items:center;gap:5px;
    padding-bottom:6px;border-bottom:1px solid rgba(201,168,76,.16)}
  .dab-d-row{display:flex;justify-content:space-between;padding:4px 0;gap:12px}
  .dab-d-key{font-size:.75rem;color:var(--mu);flex-shrink:0}
  .dab-d-val{font-size:.80rem;color:var(--tx);font-weight:500;text-align:right}
  .dab-perf-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:5px;
    background:var(--in-g);border:1px solid rgba(55,48,163,.14);font-size:.68rem;color:var(--in);margin:2px}
  .dab-price-box{background:rgba(55,48,163,.02);border:1px solid rgba(55,48,163,.10);
    border-radius:8px;padding:14px 16px;margin-top:4px}
  .dab-price-line{display:flex;justify-content:space-between;align-items:center;
    padding:5px 0;border-bottom:1px solid rgba(201,168,76,.09);gap:12px}
  .dab-price-line:last-child{border-bottom:none}
  .dab-price-line-k{font-size:.75rem;color:var(--mu)}
  .dab-price-line-v{font-size:.80rem;font-weight:500;text-align:right;color:var(--tx)}
  .dab-price-subtotal{display:flex;justify-content:space-between;align-items:center;
    padding:10px 0 4px;margin-top:6px;border-top:2px solid rgba(201,168,76,.22);gap:12px}
  .dab-price-subtotal-k{font-size:.72rem;font-weight:600;letter-spacing:.10em;text-transform:uppercase;color:var(--mu)}
  .dab-price-subtotal-v{font-family:'Cormorant Garamond',serif;font-size:1.30rem;font-weight:700;color:var(--in)}
  .dab-price-grand{display:flex;justify-content:space-between;align-items:center;
    padding:8px 0 2px;gap:12px}
  .dab-price-grand-k{font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--tx)}
  .dab-price-grand-v{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--in)}
  .dab-price-input{width:100%;padding:11px 14px;border:1px solid rgba(201,168,76,.28);border-radius:7px;
    font-family:'DM Sans',sans-serif;font-size:1rem;color:var(--tx);outline:none;margin-top:8px}
  .dab-price-input:focus{border-color:var(--go);box-shadow:0 0 0 3px var(--go-g)}
  .dab-spinner{width:44px;height:44px;border-radius:50%;border:2px solid rgba(201,168,76,.15);
    border-top-color:var(--go);animation:dabSpin .85s linear infinite;margin:60px auto;display:block}
  @keyframes dabSpin{to{transform:rotate(360deg)}}
  .dab-empty{text-align:center;padding:64px 20px;color:var(--mu);font-size:.90rem}
`;

const fmt = (n) => new Intl.NumberFormat("en-LK").format(n || 0);
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const STATUS_LABELS = {
  PENDING: "Pending",
  PRICE_SET: "Price Set",
  ACCEPTED_WITH_PRICE: "Accepted",
  CANCELLED: "Cancelled",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};
const ALL_STATUSES = [
  "ALL",
  "PENDING",
  "PRICE_SET",
  "ACCEPTED_WITH_PRICE",
  "CANCELLED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const getActions = (status) => {
  switch (status) {
    case "PENDING":
      return [
        {
          key: "set-price",
          label: "Set Transport Price",
          variant: "price",
          icon: <Truck size={13} />,
        },
        {
          key: "reject",
          label: "Reject",
          variant: "reject",
          icon: <XCircle size={13} />,
        },
      ];
    case "PRICE_SET":
      return [
        {
          key: "reject",
          label: "Reject",
          variant: "reject",
          icon: <XCircle size={13} />,
        },
      ];
    case "ACCEPTED_WITH_PRICE":
      return [
        {
          key: "approve",
          label: "Approve",
          variant: "approve",
          icon: <CheckCircle2 size={13} />,
        },
        {
          key: "reject",
          label: "Reject",
          variant: "reject",
          icon: <XCircle size={13} />,
        },
      ];
    case "APPROVED":
      return [
        {
          key: "complete",
          label: "Mark as Completed",
          variant: "complete",
          icon: <Trophy size={13} />,
        },
      ];
    default:
      return [];
  }
};

const StatusDropdown = ({
  booking,
  onSetPrice,
  onApprove,
  onReject,
  onComplete,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const actions = getActions(booking.status);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleAction = (key) => {
    setOpen(false);
    switch (key) {
      case "set-price":
        return onSetPrice(booking);
      case "approve":
        return onApprove(booking.requestId);
      case "reject":
        return onReject(booking.requestId);
      case "complete":
        return onComplete(booking.requestId);
    }
  };

  if (actions.length === 0)
    return (
      <span className="dab-dd-no-action">No further actions available</span>
    );

  return (
    <div className="dab-dd-wrap" ref={wrapRef}>
      <button
        className={`dab-dd-trigger${open ? " open" : ""}`}
        onClick={() => setOpen((p) => !p)}
      >
        <ChevronRight size={12} /> Change Status
        <ChevronDown size={12} className="dab-dd-arrow" />
      </button>
      {open && (
        <div className="dab-dd-menu">
          <div className="dab-dd-label">Available Actions</div>
          {actions.map((action) => (
            <button
              key={action.key}
              className={`dab-dd-item ${action.variant}`}
              onClick={() => handleAction(action.key)}
            >
              <span className="dab-dd-dot" />
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BookingRow = ({
  booking,
  onSetPrice,
  onApprove,
  onReject,
  onComplete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const s = booking.status;

  return (
    <div className="dab-card">
      <div className={`dab-card-bar ${s}`} />
      <div className="dab-card-head">
        <div style={{ flex: 1 }}>
          <div className="dab-card-pkg">{booking.dancingPackageName}</div>
          <div className="dab-card-user">
            <Users size={11} /> {booking.userFullName} — {booking.userEmail}
          </div>
          <div className="dab-card-meta">
            <span className="dab-card-meta-item">
              <MapPin size={10} /> {booking.hotelName}, {booking.nearestCity}
            </span>
            <span className="dab-card-meta-item">
              <Calendar size={10} /> {fmtDate(booking.eventDate)}
            </span>
            <span className="dab-card-meta-item">
              <Phone size={10} /> {booking.contactNo}
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <span className={`dab-status ${s}`}>{STATUS_LABELS[s]}</span>
          {booking.transportPrice && (
            <span className="dab-transport">
              <Truck size={12} /> Rs. {fmt(booking.transportPrice)}
            </span>
          )}
          <span style={{ fontSize: ".68rem", color: "var(--mu)" }}>
            {fmtDate(booking.createdAt)}
          </span>
        </div>
      </div>

      <div className="dab-actions">
        <StatusDropdown
          booking={booking}
          onSetPrice={onSetPrice}
          onApprove={onApprove}
          onReject={onReject}
          onComplete={onComplete}
        />
      </div>

      <button className="dab-toggle" onClick={() => setExpanded((p) => !p)}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Eye size={12} /> View Full Details
        </span>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded && (
        <div className="dab-details">
          <div className="dab-d-grid">
            <div className="dab-d-section">
              <div className="dab-d-title">
                <Users size={9} /> Customer
              </div>
              {[
                ["Full Name", booking.userFullName],
                ["Email", booking.userEmail],
                ["Phone", booking.userPhone],
              ].map(([k, v]) => (
                <div key={k} className="dab-d-row">
                  <span className="dab-d-key">{k}</span>
                  <span className="dab-d-val">{v || "—"}</span>
                </div>
              ))}
            </div>
            <div className="dab-d-section">
              <div className="dab-d-title">
                <MapPin size={9} /> Event Details
              </div>
              {[
                ["Hotel", booking.hotelName],
                ["City", booking.nearestCity],
                ["Date", fmtDate(booking.eventDate)],
                ["Contact", booking.contactNo],
                ["Groom Arrival", booking.groomArrivalTime || "—"],
                ["Poruwa Start", booking.poruwaStartTime || "—"],
              ].map(([k, v]) => (
                <div key={k} className="dab-d-row">
                  <span className="dab-d-key">{k}</span>
                  <span className="dab-d-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {booking.specialNotes && (
            <div className="dab-d-section">
              <div className="dab-d-title">📝 Special Notes</div>
              <p
                style={{
                  fontSize: ".82rem",
                  color: "var(--tx)",
                  lineHeight: "1.6",
                  background: "rgba(201,168,76,.05)",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(201,168,76,.15)",
                }}
              >
                {booking.specialNotes}
              </p>
            </div>
          )}

          {booking.extraPerformers?.length > 0 && (
            <div className="dab-d-section">
              <div className="dab-d-title">
                <Music2 size={9} /> Extra Performers
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {booking.extraPerformers.map((ep, i) => (
                  <span key={i} className="dab-perf-chip">
                    {ep.quantity} × {ep.performerTypeName}
                    <span style={{ opacity: 0.7 }}>
                      &nbsp;(Rs. {fmt(ep.pricePerUnit * ep.quantity)})
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="dab-d-section">
            <div className="dab-d-title">💰 Pricing Summary</div>
            <div className="dab-price-box">
              <div className="dab-price-line">
                <span className="dab-price-line-k">Package Base Price</span>
                <span className="dab-price-line-v">
                  Rs. {fmt(booking.dancingPackageBasePrice)}
                </span>
              </div>
              {(booking.extraPerformers || []).map((ep, i) => (
                <div key={i} className="dab-price-line">
                  <span className="dab-price-line-k">
                    {ep.quantity} × {ep.performerTypeName}
                    <span style={{ color: "var(--su)", fontSize: ".70rem" }}>
                      &nbsp;@ Rs. {fmt(ep.pricePerUnit)}
                    </span>
                  </span>
                  <span
                    className="dab-price-line-v"
                    style={{ color: "var(--cr)" }}
                  >
                    + Rs. {fmt(ep.pricePerUnit * ep.quantity)}
                  </span>
                </div>
              ))}
              <div className="dab-price-subtotal">
                <span className="dab-price-subtotal-k">Booking Subtotal</span>
                <span className="dab-price-subtotal-v">
                  Rs. {fmt(booking.bookingSubtotal)}
                </span>
              </div>
              <div
                className="dab-price-line"
                style={{
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "1px dashed rgba(201,168,76,.22)",
                }}
              >
                <span className="dab-price-line-k">
                  Transport (set by admin)
                </span>
                <span
                  className="dab-price-line-v"
                  style={{
                    color: booking.transportPrice ? "var(--in)" : "var(--su)",
                  }}
                >
                  {booking.transportPrice
                    ? `Rs. ${fmt(booking.transportPrice)}`
                    : "Not set yet"}
                </span>
              </div>
              {booking.transportPrice && (
                <div className="dab-price-grand">
                  <span className="dab-price-grand-k">Grand Total</span>
                  <span className="dab-price-grand-v">
                    Rs.{" "}
                    {fmt(
                      (booking.bookingSubtotal || 0) + booking.transportPrice,
                    )}
                  </span>
                </div>
              )}
              <div className="dab-price-line" style={{ marginTop: "6px" }}>
                <span className="dab-price-line-k">
                  Customer Accepted Price
                </span>
                <span className="dab-price-line-v">
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

const DancingBookingRequestsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/booking-requests/dancing-packages");
      setBookings(res.data || []);
    } catch {
      toastError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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
        <p style="font-size:.75rem;color:#7A6555;margin-bottom:2px">Enter transport price ↓</p>
        <input id="swal-price" type="number" min="0" step="100" placeholder="e.g. 7500"
          style="width:100%;padding:11px 14px;border:1px solid rgba(201,168,76,.28);
          border-radius:7px;font-size:1rem;outline:none;margin-top:6px" />
      `,
      confirmButtonColor: "#3730A3",
      cancelButtonColor: "#6b7280",
      showCancelButton: true,
      confirmButtonText: "Set Price",
      preConfirm: () => {
        const val = parseFloat(document.getElementById("swal-price").value);
        if (isNaN(val) || val < 0) {
          Swal.showValidationMessage("Please enter a valid price");
          return false;
        }
        return val;
      },
    });
    if (price === undefined) return;
    try {
      await api.put(
        `/api/admin/booking-requests/dancing-packages/${booking.requestId}/set-price`,
        { transportPrice: price },
      );
      toastSuccess(`Transport price set: Rs. ${fmt(price)}`);
      fetchBookings();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to set price.");
    }
  };

  const handleApprove = async (requestId) => {
    const result = await MySwal.fire({
      title: "Approve Booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#15803D",
      confirmButtonText: "Yes, Approve",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(
        `/api/admin/booking-requests/dancing-packages/${requestId}/approve`,
      );
      toastSuccess("Booking approved!");
      fetchBookings();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed.");
    }
  };

  const handleReject = async (requestId) => {
    const result = await MySwal.fire({
      title: "Reject Booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B1A1A",
      confirmButtonText: "Yes, Reject",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(
        `/api/admin/booking-requests/dancing-packages/${requestId}/reject`,
      );
      toastSuccess("Booking rejected.");
      fetchBookings();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed.");
    }
  };

  const handleComplete = async (requestId) => {
    const result = await MySwal.fire({
      title: "Mark as Completed?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      confirmButtonText: "Yes, Mark Complete",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(
        `/api/admin/booking-requests/dancing-packages/${requestId}/complete`,
      );
      toastSuccess("Marked as completed!");
      fetchBookings();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed.");
    }
  };

  const filtered = bookings
    .filter((b) => activeTab === "ALL" || b.status === activeTab)
    .filter(
      (b) =>
        !search ||
        [
          b.userFullName,
          b.userEmail,
          b.hotelName,
          b.nearestCity,
          b.dancingPackageName,
        ].some((f) => f?.toLowerCase().includes(search.toLowerCase())),
    );

  const count = (s) =>
    s === "ALL"
      ? bookings.length
      : bookings.filter((b) => b.status === s).length;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="dab-root">
        <h1 className="dab-title">
          Dancing Package <span>Booking Requests</span>
        </h1>
        <p className="dab-sub">
          Manage all dancing package booking requests from customers
        </p>

        <div className="dab-stats">
          {[
            { label: "Total", val: bookings.length, cls: "" },
            { label: "Pending", val: count("PENDING"), cls: "pending" },
            { label: "Price Set", val: count("PRICE_SET"), cls: "price_set" },
            {
              label: "Accepted",
              val: count("ACCEPTED_WITH_PRICE"),
              cls: "accepted",
            },
            { label: "Approved", val: count("APPROVED"), cls: "approved" },
            { label: "Completed", val: count("COMPLETED"), cls: "completed" },
            {
              label: "Rejected",
              val: count("REJECTED") + count("CANCELLED"),
              cls: "rejected",
            },
          ].map(({ label, val, cls }) => (
            <div key={label} className="dab-stat">
              <div className={`dab-stat-num ${cls}`}>{val}</div>
              <div className="dab-stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="dab-toolbar">
          <div className="dab-search-wrap">
            <Search size={13} className="dab-search-ico" />
            <input
              type="text"
              className="dab-search"
              placeholder="Search by name, hotel, package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="dab-refresh" onClick={fetchBookings}>
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="dab-tabs">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              className={`dab-tab ${s}${activeTab === s ? " active" : ""}`}
              onClick={() => setActiveTab(s)}
            >
              {s === "ALL" ? "All" : STATUS_LABELS[s]} ({count(s)})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dab-spinner" />
        ) : filtered.length === 0 ? (
          <div className="dab-empty">No bookings found.</div>
        ) : (
          filtered.map((b) => (
            <BookingRow
              key={b.requestId}
              booking={b}
              onSetPrice={handleSetPrice}
              onApprove={handleApprove}
              onReject={handleReject}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </>
  );
};

export default DancingBookingRequestsManager;
