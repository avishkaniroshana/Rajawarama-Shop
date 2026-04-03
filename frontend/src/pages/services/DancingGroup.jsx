import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Users, Drum, ArrowRight, RefreshCw, ChevronDown } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --crimson:       #8B1A1A;
    --crimson-light: #B22222;
    --gold:          #C9A84C;
    --gold-light:    #E2C56A;
    --gold-glow:     rgba(201,168,76,0.14);
    --indigo:        #3730A3;
    --indigo-glow:   rgba(55,48,163,0.08);
    --bg:            #FAF7F4;
    --surface:       #FFFFFF;
    --border:        rgba(201,168,76,0.22);
    --text:          #1C1008;
    --muted:         #7A6555;
  }

  .dg-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Hero ── */
  .dg-hero {
    position: relative;
    background: linear-gradient(135deg, #0a0318 0%, #1a0a2e 45%, #0e0510 100%);
    padding: 88px 24px 100px;
    text-align: center;
    overflow: hidden;
  }
  .dg-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 40%, rgba(139,26,26,0.20) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 85% 60%, rgba(79,70,229,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 40% 60% at 50% 0%,  rgba(201,168,76,0.10) 0%, transparent 60%);
    pointer-events: none;
  }
  .dg-hero-waves {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 80px; pointer-events: none; overflow: hidden;
  }
  .dg-hero-waves svg { display: block; }

  .dg-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 16px; border-radius: 40px;
    border: 1px solid rgba(201,168,76,0.30);
    background: rgba(201,168,76,0.07);
    color: var(--gold-light);
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.20em; text-transform: uppercase;
    margin-bottom: 22px; position: relative; z-index: 1;
  }
  .dg-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.6rem, 6vw, 4.4rem);
    font-weight: 700; line-height: 1.05;
    color: #FDF8F0;
    position: relative; z-index: 1;
    margin-bottom: 18px;
  }
  .dg-hero-title em { font-style: italic; color: var(--gold-light); }
  .dg-hero-sub {
    font-size: 1rem; font-weight: 300; color: rgba(253,248,240,0.60);
    max-width: 500px; margin: 0 auto 36px;
    line-height: 1.7; position: relative; z-index: 1;
  }
  .dg-hero-rule {
    width: 60px; height: 1.5px; margin: 0 auto;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    position: relative; z-index: 1;
  }

  /* ── Stats ── */
  .dg-stats {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 28px 24px;
  }
  .dg-stats-inner {
    max-width: 900px; margin: 0 auto;
    display: flex; justify-content: center; gap: 60px; flex-wrap: wrap;
  }
  .dg-stat { text-align: center; }
  .dg-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 700; line-height: 1;
    color: var(--crimson);
  }
  .dg-stat-label {
    font-size: 0.70rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); margin-top: 4px;
  }

  /* ── Body ── */
  .dg-body {
    max-width: 1200px; margin: 0 auto;
    padding: 64px 24px 96px;
  }

  .dg-section-label {
    display: flex; align-items: center; gap: 14px; margin-bottom: 40px;
  }
  .dg-section-label::before, .dg-section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.28));
  }
  .dg-section-label::after {
    background: linear-gradient(270deg, transparent, rgba(201,168,76,0.28));
  }
  .dg-section-label span {
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--gold); white-space: nowrap;
  }

  /* ── Cards grid ── */
  .dg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
  }

  /* ── Card ── */
  .dg-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 0 rgba(201,168,76,0.15), 0 8px 28px rgba(55,48,163,0.06);
    transition: transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s;
    display: flex; flex-direction: column;
  }
  .dg-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 2px 0 rgba(201,168,76,0.22), 0 20px 56px rgba(55,48,163,0.10);
  }
  .dg-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--indigo), var(--gold), var(--crimson));
  }

  .dg-card-accent {
    padding: 22px 24px 0;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  }
  .dg-card-icon {
    width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(55,48,163,0.08), rgba(139,26,26,0.08));
    border: 1px solid rgba(201,168,76,0.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--indigo);
  }
  .dg-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.50rem; font-weight: 700; line-height: 1.15;
    color: var(--text); flex: 1;
  }

  .dg-price-row {
    padding: 14px 24px 0;
    display: flex; align-items: baseline; gap: 6px;
  }
  .dg-price-rs { font-size: 0.85rem; font-weight: 400; color: var(--muted); }
  .dg-price-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.90rem; font-weight: 700; color: var(--crimson); line-height: 1;
  }
  .dg-price-note { font-size: 0.70rem; color: var(--muted); letter-spacing: 0.04em; margin-left: 2px; }

  .dg-divider {
    margin: 18px 24px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.22), transparent);
  }

  .dg-performers-head {
    padding: 0 24px 10px;
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted);
    display: flex; align-items: center; gap: 6px;
  }
  .dg-performers-grid {
    padding: 0 24px;
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .dg-performer-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 6px;
    background: rgba(55,48,163,0.05);
    border: 1px solid rgba(55,48,163,0.14);
    font-size: 0.80rem; color: var(--text);
  }
  .dg-performer-count {
    display: inline-flex; align-items: center; justify-content: center;
    width: 20px; height: 20px; border-radius: 4px;
    background: linear-gradient(135deg, var(--crimson), #9B2335);
    color: #fff; font-size: 0.68rem; font-weight: 700;
    flex-shrink: 0;
  }

  /* ── Details toggle ── */
  .dg-toggle-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 24px; margin-top: 10px;
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.10em;
    color: var(--gold); text-transform: uppercase;
    transition: color 0.2s;
  }
  .dg-toggle-btn:hover { color: var(--gold-light); }
  .dg-toggle-chevron {
    transition: transform 0.3s ease;
    display: flex; align-items: center;
  }
  .dg-toggle-chevron.open { transform: rotate(180deg); }

  .dg-details {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.35s ease, padding 0.3s ease;
    padding: 0 24px;
    font-size: 0.83rem; color: var(--muted); font-weight: 300;
    line-height: 1.65;
  }
  .dg-details.open {
    max-height: 600px;
    padding: 6px 24px 14px;
  }

  .dg-card-foot {
    margin-top: auto;
    padding: 20px 24px 24px;
  }

  .dg-book-btn {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1e1b4b, #1e3a8a);
  border: none; border-radius: 6px; color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.80rem; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
  transition: box-shadow 0.25s, transform 0.18s;
}
.dg-book-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(201,168,76,0.18), transparent);
  opacity: 0; transition: opacity 0.25s;
}
.dg-book-btn:hover { box-shadow: 0 4px 20px rgba(30,27,75,0.45); transform: translateY(-1px); }
.dg-book-btn:hover::after { opacity: 1; }

  // .dg-book-btn {
  //   width: 100%; padding: 13px;
  //   background: linear-gradient(135deg, #3730A3, #4338CA);
  //   border: none; border-radius: 6px; color: #fff;
  //   font-family: 'DM Sans', sans-serif;
  //   font-size: 0.80rem; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase;
  //   cursor: pointer;
  //   display: flex; align-items: center; justify-content: center; gap: 8px;
  //   position: relative; overflow: hidden;
  //   transition: box-shadow 0.25s, transform 0.18s;
  // }
  // .dg-book-btn::after {
  //   content: '';
  //   position: absolute; inset: 0;
  //   background: linear-gradient(135deg, rgba(201,168,76,0.18), transparent);
  //   opacity: 0; transition: opacity 0.25s;
  // }
  // .dg-book-btn:hover { box-shadow: 0 4px 20px rgba(55,48,163,0.35); transform: translateY(-1px); }
  // .dg-book-btn:hover::after { opacity: 1; }

  /* ── States ── */
  .dg-state {
    min-height: 60vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; text-align: center; padding: 40px;
  }
  .dg-spinner {
    width: 48px; height: 48px; border-radius: 50%;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: var(--gold);
    animation: dgSpin 0.85s linear infinite;
  }
  @keyframes dgSpin { to { transform: rotate(360deg); } }
  .dg-state-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 700; color: var(--text);
  }
  .dg-state-text { font-size: 0.875rem; color: var(--muted); font-weight: 300; }
  .dg-retry-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; border-radius: 5px;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
    border: none; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
    cursor: pointer; transition: box-shadow 0.22s, transform 0.18s;
  }
  .dg-retry-btn:hover { box-shadow: 0 4px 18px rgba(139,26,26,0.35); transform: translateY(-1px); }

  .dg-empty { text-align: center; padding: 80px 20px; }
  .dg-empty-icon {
    width: 72px; height: 72px; border-radius: 16px; margin: 0 auto 20px;
    background: rgba(55,48,163,0.06);
    border: 1px solid rgba(55,48,163,0.15);
    display: flex; align-items: center; justify-content: center;
    color: var(--indigo);
  }

  @media (max-width: 600px) {
    .dg-grid { grid-template-columns: 1fr; }
    .dg-hero-title { font-size: 2.2rem; }
    .dg-stats-inner { gap: 32px; }
  }
`;

/* ------------------------ Details Toggle Component ------------------------ */
const DetailsToggle = ({ details }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="dg-toggle-btn" onClick={() => setOpen(!open)}>
        <span className={`dg-toggle-chevron${open ? " open" : ""}`}>
          <ChevronDown size={14} />
        </span>
        {open ? "Hide Details" : "Show Details"}
      </button>
      <p className={`dg-details${open ? " open" : ""}`}>{details}</p>
    </>
  );
};

/* ------------------------ Main Component ------------------------ */
const DancingGroup = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/public/dancing-packages");
      setPackages(res.data || []);
    } catch {
      setError("Failed to load dancing packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  /* ── Navigate to booking with pre-selected package ── */
  const handleBook = (pkg) => {
    if (!isLoggedIn) {
      navigate("/signin", { state: { from: "/services/dancing-group" } });
      return;
    }
    navigate("/booking/dancing-packages", {
      state: { preselectedPackageId: pkg.id },
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", { minimumFractionDigits: 0 }).format(price);

  const totalPerformers = packages.reduce(
    (sum, pkg) =>
      sum +
      (pkg.includedPerformers?.reduce((s, p) => s + (p.quantity || 0), 0) || 0),
    0,
  );

  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-page", "dancing-group");
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
    return () => {
      if (document.head.contains(tag)) document.head.removeChild(tag);
    };
  }, []);

  return (
    <>
      <div className="dg-root">
        {/* ── Hero ── */}
        <section className="dg-hero">
          <div className="dg-hero-badge">
            <Drum size={12} /> Traditional Troupes
          </div>
          <h1 className="dg-hero-title">
            <em>Dancing</em> Group Packages
          </h1>
          <p className="dg-hero-sub">
            Breathtaking traditional and modern performances, crafted to add
            rhythm and grandeur to every ceremony.
          </p>
          <div className="dg-hero-rule" />

          <div className="dg-hero-waves">
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "80px" }}
            >
              <path
                d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
                fill="#FAF7F4"
              />
            </svg>
          </div>
        </section>

        {/* ── Stats ── */}
        {!loading && !error && packages.length > 0 && (
          <div className="dg-stats">
            <div className="dg-stats-inner">
              <div className="dg-stat">
                <div className="dg-stat-num">{packages.length}</div>
                <div className="dg-stat-label">Packages Available</div>
              </div>
              <div className="dg-stat">
                <div className="dg-stat-num">
                  {
                    new Set(
                      packages.flatMap(
                        (p) => p.includedPerformers?.map((x) => x.name) || [],
                      ),
                    ).size
                  }
                </div>
                <div className="dg-stat-label">Performer Types</div>
              </div>
              <div className="dg-stat">
                <div className="dg-stat-num">{totalPerformers}+</div>
                <div className="dg-stat-label">Total Performers</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="dg-body">
          <div className="dg-section-label">
            <span>Choose Your Package</span>
          </div>

          {loading && (
            <div className="dg-state">
              <div className="dg-spinner" />
              <p className="dg-state-text">Loading packages…</p>
            </div>
          )}

          {error && (
            <div className="dg-state">
              <p className="dg-state-title">Something went wrong</p>
              <p className="dg-state-text">{error}</p>
              <button className="dg-retry-btn" onClick={fetchPackages}>
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          )}

          {!loading && !error && packages.length === 0 && (
            <div className="dg-empty">
              <div className="dg-empty-icon">
                <Users size={28} />
              </div>
              <p className="dg-state-title">No Packages Yet</p>
              <p className="dg-state-text">
                Our dancing packages are being prepared. Please check back soon.
              </p>
            </div>
          )}

          {!loading && !error && packages.length > 0 && (
            <div className="dg-grid">
              {packages.map((pkg) => (
                <div key={pkg.id} className="dg-card">
                  <div className="dg-card-accent">
                    <div className="dg-card-icon">
                      <Drum size={20} />
                    </div>
                    <h3 className="dg-card-name">{pkg.name}</h3>
                  </div>

                  <div className="dg-price-row">
                    <span className="dg-price-rs">Rs.</span>
                    <span className="dg-price-val">
                      {formatPrice(pkg.totalPrice || 0)}
                    </span>
                    <span className="dg-price-note">/ package</span>
                  </div>

                  <div className="dg-divider" />

                  {pkg.includedPerformers &&
                    pkg.includedPerformers.length > 0 && (
                      <>
                        <div className="dg-performers-head">
                          <Users size={11} /> Performers Included
                        </div>
                        <div className="dg-performers-grid">
                          {pkg.includedPerformers.map((p) => (
                            <div key={p.id} className="dg-performer-chip">
                              <span className="dg-performer-count">
                                {p.quantity}
                              </span>
                              <span>{p.name}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                  {pkg.details && <DetailsToggle details={pkg.details} />}

                  <div className="dg-card-foot">
                    <button
                      className="dg-book-btn"
                      onClick={() => handleBook(pkg)}
                    >
                      Book This Troupe <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DancingGroup;

