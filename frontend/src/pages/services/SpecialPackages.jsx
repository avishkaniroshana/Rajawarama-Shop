import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles, Tag, Gift, ChevronDown, ChevronUp, Music2, Crown,
  ArrowRight, RefreshCw,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cr:#8B1A1A; --cr-l:#B22222; --cr-g:rgba(139,26,26,.08);
    --go:#C9A84C; --go-l:#E2C56A; --go-g:rgba(201,168,76,.13);
    --in:#3730A3; --in-g:rgba(55,48,163,.07);
    --bg:#FAF7F4; --bg2:#F2EDE6; --surf:#fff;
    --bdr:rgba(201,168,76,.22); --tx:#1C1008; --mu:#7A6555; --su:#C4B5A8;
  }

  .sp-root { font-family:'DM Sans',sans-serif; background:var(--bg); min-height:100vh; overflow-x:hidden; }

  /* ── Hero ── */
  .sp-hero {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,#1a0505 0%,#3b0a0a 40%,#1a0a02 100%);
    padding:88px 24px 100px; text-align:center;
  }
  .sp-hero::before {
    content:''; position:absolute; inset:0;
    background:
      radial-gradient(ellipse 70% 60% at 20% 30%,rgba(201,168,76,.14) 0%,transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 70%,rgba(139,26,26,.30) 0%,transparent 60%);
    pointer-events:none;
  }
  .sp-hero::after {
    content:''; position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%);
    width:600px; height:600px; border-radius:50%;
    border:1px solid rgba(201,168,76,.06);
    box-shadow:0 0 0 60px rgba(201,168,76,.03),0 0 0 120px rgba(201,168,76,.02);
    pointer-events:none;
  }
  .sp-hero-badge {
    display:inline-flex; align-items:center; gap:7px; padding:6px 16px; border-radius:40px;
    border:1px solid rgba(201,168,76,.35); background:rgba(201,168,76,.08);
    color:var(--go-l); font-size:.70rem; font-weight:500; letter-spacing:.20em; text-transform:uppercase;
    margin-bottom:22px; position:relative; z-index:1;
  }
  .sp-hero-title {
    font-family:'Cormorant Garamond',serif; font-size:clamp(2.6rem,6vw,4.4rem);
    font-weight:700; line-height:1.05; color:#FDF8F0; position:relative; z-index:1; margin-bottom:18px;
  }
  .sp-hero-title em { font-style:italic; color:var(--go-l); }
  .sp-hero-sub {
    font-size:1rem; font-weight:300; color:rgba(253,248,240,.65);
    max-width:520px; margin:0 auto 36px; line-height:1.7; position:relative; z-index:1;
  }
  .sp-hero-rule {
    width:60px; height:1.5px; margin:0 auto;
    background:linear-gradient(90deg,transparent,var(--go),transparent);
    position:relative; z-index:1;
  }

  /* ── Body ── */
  .sp-body { max-width:1200px; margin:0 auto; padding:64px 24px 96px; }
  .sp-section-label { display:flex; align-items:center; gap:14px; margin-bottom:40px; }
  .sp-section-label::before,.sp-section-label::after {
    content:''; flex:1; height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.30));
  }
  .sp-section-label::after { background:linear-gradient(270deg,transparent,rgba(201,168,76,.30)); }
  .sp-section-label span {
    font-size:.68rem; font-weight:500; letter-spacing:.22em; text-transform:uppercase;
    color:var(--go); white-space:nowrap;
  }
  .sp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(360px,1fr)); gap:32px; }

  /* ── Package Card ── */
  .sp-card {
    background:var(--surf); border:1px solid var(--bdr); border-radius:12px;
    overflow:hidden; position:relative;
    box-shadow:0 2px 0 rgba(201,168,76,.18),0 8px 32px rgba(139,26,26,.05);
    transition:transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s;
  }
  .sp-card:hover {
    transform:translateY(-4px);
    box-shadow:0 2px 0 rgba(201,168,76,.25),0 20px 60px rgba(139,26,26,.10);
  }
  .sp-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,var(--cr),var(--go),var(--cr));
    background-size:200% 100%; animation:shimmerBar 3s linear infinite;
  }
  @keyframes shimmerBar { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .sp-card-head { padding:28px 28px 0; display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
  .sp-card-name { font-family:'Cormorant Garamond',serif; font-size:1.55rem; font-weight:700; line-height:1.1; color:var(--tx); }
  .sp-discount-badge {
    flex-shrink:0; display:flex; align-items:center; gap:5px; padding:5px 11px;
    border-radius:40px; background:linear-gradient(135deg,var(--cr),#C0392B);
    color:#fff; font-size:.72rem; font-weight:600;
  }
  .sp-price-block { padding:18px 28px 0; display:flex; align-items:baseline; gap:8px; }
  .sp-price-label { font-size:.70rem; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:var(--mu); }
  .sp-price { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; color:var(--cr); line-height:1; }
  .sp-price-currency { font-size:1rem; font-weight:500; color:var(--mu); margin-right:2px; }
  .sp-badges { padding:14px 28px 0; display:flex; flex-wrap:wrap; gap:8px; }
  .sp-badge {
    display:inline-flex; align-items:center; gap:5px; padding:4px 10px;
    border-radius:4px; font-size:.68rem; font-weight:500; letter-spacing:.06em;
  }
  .sp-badge.coordination { background:rgba(201,168,76,.10); border:1px solid rgba(201,168,76,.28); color:#8B6914; }
  .sp-badge.packaging    { background:rgba(139,26,26,.07);  border:1px solid rgba(139,26,26,.18);  color:var(--cr); }
  .sp-badge.dancing      { background:rgba(79,70,229,.07);  border:1px solid rgba(79,70,229,.20);  color:#4338CA; }
  .sp-card-divider {
    margin:18px 28px; height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,.25),transparent);
  }
  .sp-items-toggle {
    width:100%; padding:0 28px 16px; background:none; border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:space-between;
    font-family:'DM Sans',sans-serif; font-size:.75rem; font-weight:500;
    letter-spacing:.12em; text-transform:uppercase; color:var(--mu); transition:color .2s;
  }
  .sp-items-toggle:hover { color:var(--cr); }
  .sp-items-list { padding:0 28px; animation:fadeSlideDown .25s ease; }
  @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .sp-item-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:8px 0; border-bottom:1px solid rgba(201,168,76,.09); font-size:.85rem;
  }
  .sp-item-row:last-child { border-bottom:none; }
  .sp-item-name { display:flex; align-items:center; gap:8px; color:var(--tx); }
  .sp-item-dot  { width:5px; height:5px; border-radius:50%; background:var(--go); flex-shrink:0; }
  .sp-item-qty  { font-family:'Cormorant Garamond',serif; font-size:.9rem; font-weight:600; color:var(--cr); }
  .sp-free-section { padding:12px 28px 0; }
  .sp-free-label {
    font-size:.68rem; font-weight:500; letter-spacing:.14em; text-transform:uppercase;
    color:var(--go); margin-bottom:8px; display:flex; align-items:center; gap:6px;
  }
  .sp-free-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:4px; }
  .sp-free-chip {
    padding:3px 10px; border-radius:40px;
    background:rgba(201,168,76,.08); border:1px solid rgba(201,168,76,.22);
    font-size:.72rem; color:#7A5C1E; font-weight:500;
  }
  .sp-card-foot { padding:20px 28px 26px; margin-top:4px; }
  .sp-book-btn {
    width:100%; padding:13px;
    background: linear-gradient(135deg, #FF7A18, #FFB347);
    border:none; border-radius:6px; color:#fff;
    font-family:'DM Sans',sans-serif; font-size:.80rem; font-weight:500;
    letter-spacing:.10em; text-transform:uppercase; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    position:relative; overflow:hidden; transition:box-shadow .25s,transform .18s;
  }
  .sp-book-btn::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(201,168,76,.20),transparent);
    opacity:0; transition:.25s;
  }
  .sp-book-btn:hover { box-shadow:0 4px 20px rgba(139,26,26,.35); transform:translateY(-1px); }
  .sp-book-btn:hover::after { opacity:1; }

  /* ── States ── */
  .sp-state {
    min-height:60vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:16px;
    text-align:center; padding:40px;
  }
  .sp-spinner {
    width:48px; height:48px; border-radius:50%;
    border:2px solid rgba(201,168,76,.15); border-top-color:var(--go);
    animation:spSpin .85s linear infinite;
  }
  @keyframes spSpin { to{transform:rotate(360deg)} }
  .sp-state-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; color:var(--tx); }
  .sp-state-text  { font-size:.875rem; color:var(--mu); font-weight:300; }
  .sp-retry-btn {
    display:inline-flex; align-items:center; gap:8px; padding:10px 22px;
    border-radius:5px; background:linear-gradient(135deg,var(--cr),var(--cr-l));
    border:none; color:#fff; font-family:'DM Sans',sans-serif; font-size:.78rem;
    font-weight:500; letter-spacing:.07em; text-transform:uppercase; cursor:pointer;
    transition:box-shadow .22s,transform .18s;
  }
  .sp-retry-btn:hover { box-shadow:0 4px 18px rgba(139,26,26,.35); transform:translateY(-1px); }
  .sp-empty { text-align:center; padding:80px 20px; }
  .sp-empty-icon {
    width:72px; height:72px; border-radius:16px; margin:0 auto 20px;
    background:rgba(201,168,76,.08); border:1px solid rgba(201,168,76,.20);
    display:flex; align-items:center; justify-content:center; color:var(--go);
  }
  @media(max-width:600px){
    .sp-grid{grid-template-columns:1fr}
    .sp-card-head{flex-direction:column}
    .sp-hero-title{font-size:2.2rem}
  }
`;

/* ======================================================================
   PACKAGE CARD
======================================================================= */
const PackageCard = ({ pkg, onBook }) => {
  const [expanded, setExpanded] = useState(false);
  const fmtP = (p) => new Intl.NumberFormat("en-LK").format(p || 0);

  return (
    <div className="sp-card">
      <div className="sp-card-head">
        <h3 className="sp-card-name">{pkg.name}</h3>
        {pkg.discountPercent > 0 && (
          <span className="sp-discount-badge"><Tag size={11} /> {pkg.discountPercent}% OFF</span>
        )}
      </div>

      <div className="sp-price-block">
        <span className="sp-price-label">Total</span>
        <div className="sp-price">
          <span className="sp-price-currency">Rs. </span>{fmtP(pkg.finalPrice)}
        </div>
      </div>

      {(pkg.weddingCoordinationIncluded || pkg.weddingPackagingIncluded || pkg.linkedDancingPackageName) && (
        <div className="sp-badges">
          {pkg.weddingCoordinationIncluded && (
            <span className="sp-badge coordination"><Crown size={10} /> Wedding Coordination</span>
          )}
          {pkg.weddingPackagingIncluded && (
            <span className="sp-badge packaging"><Sparkles size={10} /> Wedding Packaging</span>
          )}
          {pkg.linkedDancingPackageName && (
            <span className="sp-badge dancing"><Music2 size={10} /> + {pkg.linkedDancingPackageName}</span>
          )}
        </div>
      )}

      <div className="sp-card-divider" />

      {pkg.items?.length > 0 && (
        <>
          <button className="sp-items-toggle" onClick={() => setExpanded(p => !p)}>
            <span>{pkg.items.length} Item{pkg.items.length !== 1 ? "s" : ""} Included</span>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {expanded && (
            <div className="sp-items-list">
              {pkg.items.map(item => (
                <div key={item.id} className="sp-item-row">
                  <span className="sp-item-name">
                    <span className="sp-item-dot" />{item.specialItemTypeName}
                  </span>
                  <span className="sp-item-qty">× {item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {pkg.freeItems?.length > 0 && (
        <div className="sp-free-section">
          <div className="sp-free-label"><Gift size={11} /> Free Inclusions</div>
          <div className="sp-free-chips">
            {pkg.freeItems.map((item, i) => (
              <span key={i} className="sp-free-chip">✦ {item}</span>
            ))}
          </div>
        </div>
      )}

      <div className="sp-card-foot">
        {/* ── Navigates to the full booking page with this package pre-selected ── */}
        <button className="sp-book-btn" onClick={() => onBook(pkg)}>
          Book This Package <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

/* =====================================================================
   MAIN PAGE
========================================================================== */
const SpecialPackages = () => {
  const { isLoggedIn } = useAuth();
  const navigate       = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchPackages = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get("/api/public/special-packages");
      setPackages(res.data || []);
    } catch {
      setError("Failed to load packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleBook = (pkg) => {
    if (!isLoggedIn) {
      // Redirect to sign-in, then come back to the booking page
      navigate("/signin", { state: { from: "/services/special" } });
      return;
    }
    // ── Navigate to the full booking page, passing the selected package id ──
    // SpecialPackageBooking reads this from location.state and auto-selects
    // the package, then jumps straight to Step 1 (Event Details).
    navigate("/booking/special-packages", {
      state: { preselectedPackageId: pkg.id },
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sp-root">

        {/* Hero */}
        <section className="sp-hero">
          <div className="sp-hero-badge"><Sparkles size={12} /> Premium Packages</div>
          <h1 className="sp-hero-title">Our <em>Special</em> Packages</h1>
          <p className="sp-hero-sub">
            Curated with care — every detail of your most cherished day, wrapped in tradition and elegance.
          </p>
          <div className="sp-hero-rule" />
        </section>

        <div className="sp-body">
          <div className="sp-section-label"><span>Available Packages</span></div>

          {loading && (
            <div className="sp-state">
              <div className="sp-spinner" />
              <p className="sp-state-text">Loading packages…</p>
            </div>
          )}

          {error && (
            <div className="sp-state">
              <p className="sp-state-title">Something went wrong</p>
              <p className="sp-state-text">{error}</p>
              <button className="sp-retry-btn" onClick={fetchPackages}>
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          )}

          {!loading && !error && packages.length === 0 && (
            <div className="sp-empty">
              <div className="sp-empty-icon"><Sparkles size={28} /></div>
              <p className="sp-state-title">No Packages Yet</p>
              <p className="sp-state-text">Check back soon.</p>
            </div>
          )}

          {!loading && !error && packages.length > 0 && (
            <div className="sp-grid">
              {packages.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} onBook={handleBook} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default SpecialPackages;




