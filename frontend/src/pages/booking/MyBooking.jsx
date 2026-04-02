import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { toastSuccess, toastError } from "../../utils/toast";
import {
  Sparkles, MapPin, Calendar, ChevronDown, ChevronUp,
  Check, X, Music2, Shirt, Phone, Users, Crown, User,
  RefreshCw, Plus, FileText, Truck,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{
    --crimson:#8B1A1A;--crimson-l:#B22222;--crimson-glow:rgba(139,26,26,.08);
    --gold:#C9A84C;--gold-l:#E2C56A;--gold-glow:rgba(201,168,76,.13);
    --indigo:#3730A3;--indigo-glow:rgba(55,48,163,.07);
    --green:#15803D;--green-glow:rgba(21,128,61,.08);
    --bg:#FAF7F4;--surface:#fff;--border:rgba(201,168,76,.22);
    --text:#1C1008;--muted:#7A6555;--subtle:#C4B5A8;
  }
  .mb-root{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh}

  .mb-hero{background:linear-gradient(135deg,#1a0505 0%,#2e0808 45%,#1a0a02 100%);
    padding:52px 24px 68px;text-align:center;position:relative;overflow:hidden}
  .mb-hero::before{content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse 70% 60% at 20% 30%,rgba(201,168,76,.12) 0%,transparent 60%),
               radial-gradient(ellipse 50% 40% at 80% 70%,rgba(139,26,26,.25) 0%,transparent 60%);pointer-events:none}
  .mb-hero-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 15px;border-radius:40px;
    border:1px solid rgba(201,168,76,.30);background:rgba(201,168,76,.07);
    color:var(--gold-l);font-size:.70rem;font-weight:500;letter-spacing:.20em;text-transform:uppercase;
    margin-bottom:16px;position:relative;z-index:1}
  .mb-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.9rem,5vw,3.2rem);
    font-weight:700;color:#FDF8F0;position:relative;z-index:1;margin-bottom:8px}
  .mb-hero-title em{font-style:italic;color:var(--gold-l)}
  .mb-hero-sub{font-size:.88rem;color:rgba(253,248,240,.55);max-width:460px;
    margin:0 auto;line-height:1.7;position:relative;z-index:1}

  .mb-body{max-width:900px;margin:0 auto;padding:48px 24px 96px}
  .mb-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:24px}
  .mb-new-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:7px;border:none;
    background:linear-gradient(135deg,var(--crimson),#9B2335);color:#fff;
    font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;letter-spacing:.09em;text-transform:uppercase;
    cursor:pointer;transition:box-shadow .22s,transform .18s;text-decoration:none}
  .mb-new-btn:hover{box-shadow:0 4px 18px rgba(139,26,26,.32);transform:translateY(-1px)}
  .mb-new-btn.indigo{background:linear-gradient(135deg,var(--indigo),#4338CA)}
  .mb-new-btn.indigo:hover{box-shadow:0 4px 18px rgba(55,48,163,.32)}

  .mb-type-switch{display:flex;gap:8px;margin-bottom:24px;padding:4px;
    background:rgba(201,168,76,.08);border:1px solid var(--border);border-radius:10px;width:fit-content}
  .mb-type-btn{padding:9px 20px;border-radius:7px;border:none;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.80rem;font-weight:500;letter-spacing:.06em;
    transition:all .25s;background:transparent;color:var(--muted)}
  .mb-type-btn.special.active{background:linear-gradient(135deg,var(--crimson),#9B2335);color:#fff;
    box-shadow:0 2px 12px rgba(139,26,26,.28)}
  .mb-type-btn.dancing.active{background:linear-gradient(135deg,var(--indigo),#4338CA);color:#fff;
    box-shadow:0 2px 12px rgba(55,48,163,.28)}
  .mb-type-btn:not(.active):hover{color:var(--text)}

  .mb-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:28px}
  .mb-tab{padding:7px 14px;border-radius:40px;border:1px solid var(--border);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:500;letter-spacing:.06em;
    text-transform:uppercase;color:var(--muted);cursor:pointer;transition:all .2s}
  .mb-tab.active{border-color:transparent;color:#fff;box-shadow:0 2px 10px rgba(139,26,26,.22)}
  .mb-tab.all.active{background:var(--text)}.mb-tab.PENDING.active{background:#D97706}
  .mb-tab.PRICE_SET.active{background:var(--indigo)}.mb-tab.ACCEPTED_WITH_PRICE.active{background:var(--green)}
  .mb-tab.CANCELLED.active{background:#64748B}.mb-tab.APPROVED.active{background:var(--green)}
  .mb-tab.REJECTED.active{background:var(--crimson)}.mb-tab.COMPLETED.active{background:#7C3AED}

  .mb-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;
    overflow:hidden;margin-bottom:18px;
    box-shadow:0 2px 0 rgba(201,168,76,.12),0 4px 20px rgba(139,26,26,.04);transition:box-shadow .25s}
  .mb-card:hover{box-shadow:0 2px 0 rgba(201,168,76,.18),0 8px 32px rgba(139,26,26,.07)}
  .mb-card-bar{height:3.5px}
  .mb-card-bar.PENDING{background:linear-gradient(90deg,#D97706,#F59E0B)}
  .mb-card-bar.PRICE_SET{background:linear-gradient(90deg,var(--indigo),#6366F1)}
  .mb-card-bar.ACCEPTED_WITH_PRICE{background:linear-gradient(90deg,var(--green),#22C55E)}
  .mb-card-bar.CANCELLED{background:linear-gradient(90deg,#64748B,#94A3B8)}
  .mb-card-bar.APPROVED{background:linear-gradient(90deg,var(--green),#16A34A)}
  .mb-card-bar.REJECTED{background:linear-gradient(90deg,var(--crimson),#DC2626)}
  .mb-card-bar.COMPLETED{background:linear-gradient(90deg,#7C3AED,#A855F7)}
  .mb-card-head{padding:18px 22px;display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .mb-card-pkg{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:700;color:var(--text);margin-bottom:5px}
  .mb-card-meta{display:flex;flex-wrap:wrap;gap:12px;font-size:.78rem;color:var(--muted)}
  .mb-card-meta-item{display:flex;align-items:center;gap:5px}
  .mb-status{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:40px;
    font-size:.68rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;flex-shrink:0}
  .mb-status.PENDING{background:#FEF3C7;color:#92400E;border:1px solid #FCD34D}
  .mb-status.PRICE_SET{background:rgba(55,48,163,.08);color:var(--indigo);border:1px solid rgba(55,48,163,.22)}
  .mb-status.ACCEPTED_WITH_PRICE{background:var(--green-glow);color:var(--green);border:1px solid rgba(21,128,61,.22)}
  .mb-status.CANCELLED{background:#F1F5F9;color:#64748B;border:1px solid #CBD5E1}
  .mb-status.APPROVED{background:var(--green-glow);color:var(--green);border:1px solid rgba(21,128,61,.22)}
  .mb-status.REJECTED{background:var(--crimson-glow);color:var(--crimson);border:1px solid rgba(139,26,26,.22)}
  .mb-status.COMPLETED{background:rgba(124,58,237,.08);color:#7C3AED;border:1px solid rgba(124,58,237,.22)}

  .mb-price-box{padding:14px 22px;background:rgba(55,48,163,.03);border-top:1px solid rgba(55,48,163,.10);
    border-bottom:1px solid rgba(55,48,163,.10);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
  .mb-price-label{font-size:.70rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
  .mb-price-val{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:var(--indigo)}
  .mb-price-actions{display:flex;gap:8px}
  .mb-accept-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:6px;border:none;
    background:linear-gradient(135deg,var(--green),#16A34A);color:#fff;font-family:'DM Sans',sans-serif;
    font-size:.75rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s}
  .mb-accept-btn:hover{box-shadow:0 3px 14px rgba(21,128,61,.30);transform:translateY(-1px)}
  .mb-cancel-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:6px;
    border:1px solid rgba(139,26,26,.25);background:var(--crimson-glow);color:var(--crimson);
    font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s}
  .mb-cancel-btn:hover{background:rgba(139,26,26,.14)}

  .mb-pricing-section{padding:16px 22px;border-top:1px solid var(--border);background:rgba(139,26,26,.015)}
  .mb-pricing-title{font-size:.65rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;
    color:var(--gold);margin-bottom:12px;display:flex;align-items:center;gap:6px}
  .mb-pricing-line{display:flex;justify-content:space-between;align-items:center;
    padding:5px 0;border-bottom:1px solid rgba(201,168,76,.08);gap:16px}
  .mb-pricing-line:last-child{border-bottom:none}
  .mb-pricing-line-k{font-size:.78rem;color:var(--muted)}
  .mb-pricing-line-v{font-size:.82rem;color:var(--text);font-weight:500;text-align:right;white-space:nowrap}
  .mb-pricing-subtotal{display:flex;justify-content:space-between;align-items:center;
    padding:10px 0 6px;margin-top:6px;border-top:2px solid rgba(201,168,76,.22);gap:16px}
  .mb-pricing-subtotal-k{font-size:.72rem;font-weight:600;letter-spacing:.10em;text-transform:uppercase;color:var(--muted)}
  .mb-pricing-subtotal-v{font-family:'Cormorant Garamond',serif;font-size:1.30rem;font-weight:700;color:var(--crimson)}
  .mb-pricing-transport{display:flex;justify-content:space-between;align-items:center;
    padding:8px 0 5px;border-top:1px dashed rgba(201,168,76,.25);margin-top:4px;gap:16px}
  .mb-pricing-transport-k{font-size:.75rem;color:var(--muted);display:flex;align-items:center;gap:5px}
  .mb-pricing-transport-v{font-size:.85rem;font-weight:600;text-align:right;color:var(--indigo)}
  .mb-pricing-grand{display:flex;justify-content:space-between;align-items:center;
    padding:10px 0 2px;border-top:2px solid rgba(139,26,26,.18);margin-top:2px;gap:16px}
  .mb-pricing-grand-k{font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text)}
  .mb-pricing-grand-v{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--crimson)}

  .mb-toggle{width:100%;padding:11px 22px;background:none;border:none;border-top:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-between;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:.72rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);transition:color .2s}
  .mb-toggle:hover{color:var(--crimson)}
  .mb-details{padding:20px 22px;border-top:1px solid var(--border);background:rgba(250,247,244,.50);animation:mbSlide .2s ease}
  @keyframes mbSlide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  .mb-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:600px){.mb-detail-grid{grid-template-columns:1fr}}
  .mb-detail-section{margin-bottom:16px}
  .mb-detail-section-title{font-size:.65rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;
    color:var(--gold);margin-bottom:10px;display:flex;align-items:center;gap:5px;
    padding-bottom:7px;border-bottom:1px solid rgba(201,168,76,.18)}
  .mb-detail-row{display:flex;justify-content:space-between;align-items:flex-start;padding:5px 0;gap:12px}
  .mb-detail-key{font-size:.78rem;color:var(--muted);flex-shrink:0}
  .mb-detail-val{font-size:.82rem;color:var(--text);font-weight:500;text-align:right}
  .mb-dress-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:5px;margin:2px;font-size:.70rem}
  .mb-dress-chip.GROOM{background:rgba(139,26,26,.07);border:1px solid rgba(139,26,26,.18);color:var(--crimson)}
  .mb-dress-chip.BEST_MAN{background:var(--indigo-glow);border:1px solid rgba(55,48,163,.18);color:var(--indigo)}
  .mb-dress-chip.PAGE_BOY{background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.28);color:#8B6914}
  .mb-performer-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:5px;
    background:var(--indigo-glow);border:1px solid rgba(55,48,163,.14);font-size:.70rem;color:var(--indigo);margin:2px}

  .mb-spinner{width:44px;height:44px;border-radius:50%;border:2px solid rgba(201,168,76,.15);
    border-top-color:var(--gold);animation:mbSpin .85s linear infinite;margin:60px auto;display:block}
  @keyframes mbSpin{to{transform:rotate(360deg)}}
  .mb-empty{text-align:center;padding:80px 20px}
  .mb-empty-icon{width:70px;height:70px;border-radius:16px;margin:0 auto 18px;background:var(--crimson-glow);
    border:1px solid rgba(139,26,26,.14);display:flex;align-items:center;justify-content:center;color:var(--crimson)}
  .mb-empty-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--text);margin-bottom:8px}
  .mb-empty-text{font-size:.85rem;color:var(--muted);font-weight:300;margin-bottom:24px}
`;

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const fmt = (n) => new Intl.NumberFormat("en-LK").format(n || 0);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" }) : "—";

const STATUS_LABELS = {
  PENDING: "Pending Review", PRICE_SET: "Price Set", ACCEPTED_WITH_PRICE: "Accepted",
  CANCELLED: "Cancelled", APPROVED: "Approved", REJECTED: "Rejected", COMPLETED: "Completed",
};
const STATUS_ICONS = {
  PENDING: "⏳", PRICE_SET: "💰", ACCEPTED_WITH_PRICE: "✅",
  CANCELLED: "✖", APPROVED: "🎉", REJECTED: "❌", COMPLETED: "🏆",
};
const ALL_STATUSES = ["ALL","PENDING","PRICE_SET","ACCEPTED_WITH_PRICE","CANCELLED","APPROVED","REJECTED","COMPLETED"];

/* ─── Shared Pricing Section ──────────────────────────────────────────
   Reads bookingSubtotal and grandTotal directly from the API response.
   These are stored in the DB — never computed client-side.
────────────────────────────────────────────────────────────────────── */
const PricingSection = ({ booking, accentColor = "var(--crimson)" }) => (
  <div className="mb-pricing-section">
    <div className="mb-pricing-title">💰 Pricing Summary</div>

    {/* Base package price */}
    <div className="mb-pricing-line">
      <span className="mb-pricing-line-k">Package Base Price</span>
      <span className="mb-pricing-line-v">
        Rs. {fmt(booking.specialPackageFinalPrice ?? booking.dancingPackageBasePrice)}
      </span>
    </div>

    {/* Dancing package (special bookings only) */}
    {booking.selectedDancingPackage && (
      <div className="mb-pricing-line">
        <span className="mb-pricing-line-k">Dancing — {booking.selectedDancingPackage.name}</span>
        <span className="mb-pricing-line-v" style={{ color: "var(--indigo)" }}>
          Rs. {fmt(booking.selectedDancingPackage.totalPrice)}
        </span>
      </div>
    )}

    {/* Extra performers */}
    {(booking.extraPerformers || []).map((ep, i) => (
      <div key={i} className="mb-pricing-line">
        <span className="mb-pricing-line-k">{ep.quantity} × {ep.performerTypeName}</span>
        <span className="mb-pricing-line-v" style={{ color: "var(--crimson)" }}>
          + Rs. {fmt(ep.pricePerUnit * ep.quantity)}
        </span>
      </div>
    ))}

    {/* ── bookingSubtotal — read from DB ── */}
    <div className="mb-pricing-subtotal">
      <span className="mb-pricing-subtotal-k">Booking Subtotal</span>
      <span className="mb-pricing-subtotal-v" style={{ color: accentColor }}>
        Rs. {fmt(booking.bookingSubtotal)}
      </span>
    </div>

    {/* Transport */}
    <div className="mb-pricing-transport">
      <span className="mb-pricing-transport-k">
        <Truck size={12} /> Transport Price
        {booking.status === "PENDING" && (
          <span style={{ color: "var(--subtle)", fontSize: ".70rem" }}>&nbsp;(to be set)</span>
        )}
      </span>
      <span className="mb-pricing-transport-v">
        {booking.transportPrice != null ? `Rs. ${fmt(booking.transportPrice)}` : "—"}
      </span>
    </div>

    {/* ── grandTotal — read from DB (only shown when stored) ── */}
    {booking.grandTotal != null && (
      <div className="mb-pricing-grand">
        <span className="mb-pricing-grand-k">Grand Total</span>
        <span className="mb-pricing-grand-v">Rs. {fmt(booking.grandTotal)}</span>
      </div>
    )}
  </div>
);

/* ─── Special Package Booking Card ──────────────────────────────────── */
const BookingCard = ({ booking, onAcceptPrice, onCancel }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-card">
      <div className={`mb-card-bar ${booking.status}`} />

      <div className="mb-card-head">
        <div style={{ flex: 1 }}>
          <div className="mb-card-pkg">{booking.specialPackageName}</div>
          <div className="mb-card-meta">
            <span className="mb-card-meta-item"><MapPin size={11} /> {booking.hotelName}, {booking.nearestCity}</span>
            <span className="mb-card-meta-item"><Calendar size={11} /> {fmtDate(booking.eventDate)}</span>
            <span className="mb-card-meta-item"><Phone size={11} /> {booking.contactNo}</span>
          </div>
        </div>
        <span className={`mb-status ${booking.status}`}>
          {STATUS_ICONS[booking.status]} {STATUS_LABELS[booking.status]}
        </span>
      </div>

      <PricingSection booking={booking} />

      {/* Accept / Decline when PRICE_SET */}
      {booking.status === "PRICE_SET" && (
        <div className="mb-price-box">
          <div>
            <div className="mb-price-label">Transport Price Added by Admin — Please Review</div>
            <div className="mb-price-val">Rs. {fmt(booking.transportPrice)}</div>
            {booking.grandTotal != null && (
              <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: "3px" }}>
                Grand Total: <strong style={{ color: "var(--text)" }}>Rs. {fmt(booking.grandTotal)}</strong>
              </div>
            )}
          </div>
          <div className="mb-price-actions">
            <button className="mb-accept-btn" onClick={() => onAcceptPrice(booking.requestId)}>
              <Check size={13} /> Accept Transport Price
            </button>
            <button className="mb-cancel-btn" onClick={() => onCancel(booking.requestId)}>
              <X size={13} /> Decline
            </button>
          </div>
        </div>
      )}

      {["ACCEPTED_WITH_PRICE","APPROVED","COMPLETED"].includes(booking.status) &&
        booking.transportPrice != null && (
          <div className="mb-price-box">
            <div>
              <div className="mb-price-label">Transport Price (Accepted)</div>
              <div className="mb-price-val">Rs. {fmt(booking.transportPrice)}</div>
              {booking.grandTotal != null && (
                <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: "3px" }}>
                  Grand Total: <strong style={{ color: "var(--text)" }}>Rs. {fmt(booking.grandTotal)}</strong>
                </div>
              )}
            </div>
            <span className="mb-status ACCEPTED_WITH_PRICE" style={{ alignSelf: "center" }}>
              <Check size={11} /> Accepted
            </span>
          </div>
        )}

      <button className="mb-toggle" onClick={() => setExpanded(!expanded)}>
        <span>View Details</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mb-details">
          <div className="mb-detail-grid">
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><MapPin size={10} /> Event Details</div>
              {[
                ["Hotel",         booking.hotelName],
                ["City",          booking.nearestCity],
                ["Date",          fmtDate(booking.eventDate)],
                ["Contact",       booking.contactNo],
                ["Groom Arrival", booking.groomArrivalTime || "—"],
                ["Poruwa Start",  booking.poruwaStartTime  || "—"],
              ].map(([k, v]) => (
                <div key={k} className="mb-detail-row">
                  <span className="mb-detail-key">{k}</span>
                  <span className="mb-detail-val">{v}</span>
                </div>
              ))}
              {booking.specialNotes && (
                <div className="mb-detail-row">
                  <span className="mb-detail-key">Notes</span>
                  <span className="mb-detail-val" style={{ maxWidth: "180px" }}>{booking.specialNotes}</span>
                </div>
              )}
            </div>
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><Sparkles size={10} /> Price Breakdown</div>
              <div className="mb-detail-row">
                <span className="mb-detail-key">Subtotal</span>
                <span className="mb-detail-val" style={{ color: "var(--crimson)", fontWeight: 700 }}>
                  Rs. {fmt(booking.bookingSubtotal)}
                </span>
              </div>
              {booking.grandTotal != null && (
                <div className="mb-detail-row">
                  <span className="mb-detail-key">Grand Total</span>
                  <span className="mb-detail-val" style={{ color: "var(--crimson)", fontWeight: 700 }}>
                    Rs. {fmt(booking.grandTotal)}
                  </span>
                </div>
              )}
              <div className="mb-detail-row">
                <span className="mb-detail-key">Submitted</span>
                <span className="mb-detail-val">{fmtDate(booking.createdAt)}</span>
              </div>
            </div>
          </div>

          {booking.dressSelections?.length > 0 && (
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><Shirt size={10} /> Dress Selections</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {booking.dressSelections.map((ds, i) => (
                  <span key={i} className={`mb-dress-chip ${ds.role}`}>
                    {ds.role === "GROOM" ? <Crown size={9} /> : ds.role === "BEST_MAN" ? <Users size={9} /> : <User size={9} />}
                    {ds.role.replace("_", " ")} — {ds.dressItemName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {booking.selectedDancingPackage && (
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><Music2 size={10} /> Dancing Package</div>
              <div className="mb-detail-row">
                <span className="mb-detail-key">Package</span>
                <span className="mb-detail-val">{booking.selectedDancingPackage.name}</span>
              </div>
              <div className="mb-detail-row">
                <span className="mb-detail-key">Price</span>
                <span className="mb-detail-val">Rs. {fmt(booking.selectedDancingPackage.totalPrice)}</span>
              </div>
            </div>
          )}

          {booking.extraPerformers?.length > 0 && (
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><Users size={10} /> Extra Performers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {booking.extraPerformers.map((ep, i) => (
                  <span key={i} className="mb-performer-chip">
                    {ep.quantity} × {ep.performerTypeName}
                    <span style={{ opacity: .7 }}>&nbsp;(Rs. {fmt(ep.pricePerUnit * ep.quantity)})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Dancing Package Booking Card ──────────────────────────────────── */
const DancingBookingCard = ({ booking, onAcceptPrice, onCancel }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-card">
      <div className={`mb-card-bar ${booking.status || "PENDING"}`} />

      <div className="mb-card-head">
        <div style={{ flex: 1 }}>
          <div className="mb-card-pkg">
            <Music2 size={16} style={{ display: "inline", marginRight: "7px",
              color: "var(--indigo)", verticalAlign: "middle" }} />
            {booking.dancingPackageName}
          </div>
          <div className="mb-card-meta">
            <span className="mb-card-meta-item"><MapPin size={11} /> {booking.hotelName}, {booking.nearestCity}</span>
            <span className="mb-card-meta-item"><Calendar size={11} /> {fmtDate(booking.eventDate)}</span>
            <span className="mb-card-meta-item"><Phone size={11} /> {booking.contactNo}</span>
          </div>
        </div>
        <span className={`mb-status ${booking.status || "PENDING"}`}>
          {STATUS_ICONS[booking.status] || "⏳"} {STATUS_LABELS[booking.status] || "Pending"}
        </span>
      </div>

      <PricingSection booking={booking} accentColor="var(--indigo)" />

      {/* Accept / Decline when PRICE_SET */}
      {booking.status === "PRICE_SET" && (
        <div className="mb-price-box">
          <div>
            <div className="mb-price-label">Transport Price Added by Admin — Please Review</div>
            <div className="mb-price-val">Rs. {fmt(booking.transportPrice)}</div>
            {booking.grandTotal != null && (
              <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: "3px" }}>
                Grand Total: <strong style={{ color: "var(--text)" }}>Rs. {fmt(booking.grandTotal)}</strong>
              </div>
            )}
          </div>
          <div className="mb-price-actions">
            <button className="mb-accept-btn" onClick={() => onAcceptPrice(booking.requestId)}>
              <Check size={13} /> Accept Transport Price
            </button>
            <button className="mb-cancel-btn" onClick={() => onCancel(booking.requestId)}>
              <X size={13} /> Decline
            </button>
          </div>
        </div>
      )}

      {["ACCEPTED_WITH_PRICE","APPROVED","COMPLETED"].includes(booking.status) &&
        booking.transportPrice != null && (
          <div className="mb-price-box">
            <div>
              <div className="mb-price-label">Transport Price (Accepted)</div>
              <div className="mb-price-val">Rs. {fmt(booking.transportPrice)}</div>
              {booking.grandTotal != null && (
                <div style={{ fontSize: ".72rem", color: "var(--muted)", marginTop: "3px" }}>
                  Grand Total: <strong style={{ color: "var(--text)" }}>Rs. {fmt(booking.grandTotal)}</strong>
                </div>
              )}
            </div>
            <span className="mb-status ACCEPTED_WITH_PRICE" style={{ alignSelf: "center" }}>
              <Check size={11} /> Accepted
            </span>
          </div>
        )}

      <button className="mb-toggle" onClick={() => setExpanded(!expanded)}>
        <span>View Details</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mb-details">
          <div className="mb-detail-grid">
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><MapPin size={10} /> Event Details</div>
              {[
                ["Hotel",         booking.hotelName],
                ["City",          booking.nearestCity],
                ["Date",          fmtDate(booking.eventDate)],
                ["Contact",       booking.contactNo],
                ["Groom Arrival", booking.groomArrivalTime || "—"],
                ["Poruwa Start",  booking.poruwaStartTime  || "—"],
              ].map(([k, v]) => (
                <div key={k} className="mb-detail-row">
                  <span className="mb-detail-key">{k}</span>
                  <span className="mb-detail-val">{v}</span>
                </div>
              ))}
              {booking.specialNotes && (
                <div className="mb-detail-row">
                  <span className="mb-detail-key">Notes</span>
                  <span className="mb-detail-val" style={{ maxWidth: "180px" }}>{booking.specialNotes}</span>
                </div>
              )}
            </div>
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><Music2 size={10} /> Package</div>
              <div className="mb-detail-row">
                <span className="mb-detail-key">Name</span>
                <span className="mb-detail-val">{booking.dancingPackageName}</span>
              </div>
              <div className="mb-detail-row">
                <span className="mb-detail-key">Base Price</span>
                <span className="mb-detail-val">Rs. {fmt(booking.dancingPackageBasePrice)}</span>
              </div>
              <div className="mb-detail-row">
                <span className="mb-detail-key">Subtotal</span>
                <span className="mb-detail-val" style={{ color: "var(--indigo)", fontWeight: 700 }}>
                  Rs. {fmt(booking.bookingSubtotal)}
                </span>
              </div>
              {booking.grandTotal != null && (
                <div className="mb-detail-row">
                  <span className="mb-detail-key">Grand Total</span>
                  <span className="mb-detail-val" style={{ color: "var(--crimson)", fontWeight: 700 }}>
                    Rs. {fmt(booking.grandTotal)}
                  </span>
                </div>
              )}
              <div className="mb-detail-row">
                <span className="mb-detail-key">Submitted</span>
                <span className="mb-detail-val">{fmtDate(booking.createdAt)}</span>
              </div>
            </div>
          </div>

          {booking.extraPerformers?.length > 0 && (
            <div className="mb-detail-section">
              <div className="mb-detail-section-title"><Users size={10} /> Extra Performers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {booking.extraPerformers.map((ep, i) => (
                  <span key={i} className="mb-performer-chip">
                    {ep.quantity} × {ep.performerTypeName}
                    <span style={{ opacity: .7 }}>&nbsp;(Rs. {fmt(ep.pricePerUnit * ep.quantity)})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
const MyBookings = () => {
  const [bookings, setBookings]               = useState([]);
  const [dancingBookings, setDancingBookings]  = useState([]);
  const [bookingType, setBookingType]          = useState("special");
  const [loading, setLoading]                  = useState(true);
  const [activeTab, setActiveTab]              = useState("ALL");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings/special-packages");
      setBookings(res.data || []);
    } catch { toastError("Failed to load special package bookings."); }
  };

  const fetchDancingBookings = async () => {
    try {
      const res = await api.get("/api/bookings/dancing-packages");
      setDancingBookings(res.data || []);
    } catch { toastError("Failed to load dancing package bookings."); }
  };

  const refreshAll = () => {
    setLoading(true);
    Promise.all([fetchBookings(), fetchDancingBookings()]).finally(() => setLoading(false));
  };

  useEffect(() => { refreshAll(); }, []); // eslint-disable-line

  const currentBookings = bookingType === "special" ? bookings : dancingBookings;
  const filtered = activeTab === "ALL"
    ? currentBookings
    : currentBookings.filter((b) => b.status === activeTab);
  const count = (s) =>
    s === "ALL" ? currentBookings.length : currentBookings.filter((b) => b.status === s).length;

  /* ── Special package actions ── */
  const handleAcceptPrice = async (requestId) => {
    const result = await MySwal.fire({
      title: "Accept Transport Price?",
      text: "Once accepted, the admin will proceed to approve your booking.",
      icon: "question", showCancelButton: true,
      confirmButtonColor: "#15803D", confirmButtonText: "Yes, Accept",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/bookings/special-packages/${requestId}/accept-price`);
      toastSuccess("Price accepted!"); fetchBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed."); }
  };

  const handleCancel = async (requestId) => {
    const result = await MySwal.fire({
      title: "Cancel Booking?", text: "This action cannot be undone.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#8B1A1A", confirmButtonText: "Yes, Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/bookings/special-packages/${requestId}/cancel`);
      toastSuccess("Booking cancelled."); fetchBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed."); }
  };

  /* ── Dancing package actions ── */
  const handleDancingAcceptPrice = async (requestId) => {
    const result = await MySwal.fire({
      title: "Accept Transport Price?",
      text: "Once accepted, the admin will proceed to approve your dancing package booking.",
      icon: "question", showCancelButton: true,
      confirmButtonColor: "#15803D", confirmButtonText: "Yes, Accept",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/bookings/dancing-packages/${requestId}/accept-price`);
      toastSuccess("Price accepted!"); fetchDancingBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed."); }
  };

  const handleDancingCancel = async (requestId) => {
    const result = await MySwal.fire({
      title: "Cancel Booking?", text: "This action cannot be undone.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#8B1A1A", confirmButtonText: "Yes, Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/api/bookings/dancing-packages/${requestId}/cancel`);
      toastSuccess("Booking cancelled."); fetchDancingBookings();
    } catch (err) { toastError(err.response?.data?.message || "Failed."); }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="mb-root">
        <section className="mb-hero">
          <div className="mb-hero-badge"><FileText size={12} /> My Bookings</div>
          <h1 className="mb-hero-title">My <em>Booking</em> Requests</h1>
          <p className="mb-hero-sub">Track your booking status and manage your upcoming wedding services.</p>
        </section>

        <div className="mb-body">
          <div className="mb-toolbar">
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--text)" }}>
              {currentBookings.length} Booking{currentBookings.length !== 1 ? "s" : ""}
            </h2>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button onClick={refreshAll}
                style={{ padding: "9px", border: "1px solid var(--border)", borderRadius: "7px",
                  background: "transparent", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center" }}>
                <RefreshCw size={14} />
              </button>
              <Link
                to={bookingType === "special" ? "/booking/special-packages" : "/booking/dancing-packages"}
                className={`mb-new-btn${bookingType === "dancing" ? " indigo" : ""}`}>
                <Plus size={14} /> New {bookingType === "special" ? "Special Package" : "Dancing Package"}
              </Link>
            </div>
          </div>

          {/* Type Switcher */}
          <div className="mb-type-switch">
            <button className={`mb-type-btn special ${bookingType === "special" ? "active" : ""}`}
              onClick={() => { setBookingType("special"); setActiveTab("ALL"); }}>
               Special Packages {bookings.length > 0 && `(${bookings.length})`}
            </button>
            <button className={`mb-type-btn dancing ${bookingType === "dancing" ? "active" : ""}`}
              onClick={() => { setBookingType("dancing"); setActiveTab("ALL"); }}>
               Dancing Packages {dancingBookings.length > 0 && `(${dancingBookings.length})`}
            </button>
          </div>

          {/* Status Tabs */}
          <div className="mb-tabs">
            {ALL_STATUSES.map((s) => (
              <button key={s}
                className={`mb-tab ${s === "ALL" ? "all" : s}${activeTab === s ? " active" : ""}`}
                onClick={() => setActiveTab(s)}>
                {s === "ALL" ? "All" : STATUS_LABELS[s]} ({count(s)})
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="mb-spinner" />
          ) : filtered.length === 0 ? (
            <div className="mb-empty">
              <div className="mb-empty-icon">
                {bookingType === "special" ? <Sparkles size={28} /> : <Music2 size={28} />}
              </div>
              <p className="mb-empty-title">No Bookings Found</p>
              <p className="mb-empty-text">
                {bookingType === "special"
                  ? "You have no special package bookings yet."
                  : "You have no dancing package bookings yet."}
              </p>
              <Link
                to={bookingType === "special" ? "/booking/special-packages" : "/booking/dancing-packages"}
                className={`mb-new-btn${bookingType === "dancing" ? " indigo" : ""}`}>
                <Plus size={14} /> Book Now
              </Link>
            </div>
          ) : bookingType === "special" ? (
            filtered.map((b) => (
              <BookingCard key={b.requestId} booking={b}
                onAcceptPrice={handleAcceptPrice} onCancel={handleCancel} />
            ))
          ) : (
            filtered.map((b) => (
              <DancingBookingCard key={b.requestId} booking={b}
                onAcceptPrice={handleDancingAcceptPrice} onCancel={handleDancingCancel} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;


