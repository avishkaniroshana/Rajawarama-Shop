import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import {
  Shirt,
  Filter,
  Users,
  User,
  ArrowRight,
  RefreshCw,
  ImageOff,
  Search,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --crimson:       #8B1A1A;
    --crimson-light: #B22222;
    --crimson-glow:  rgba(139,26,26,0.07);
    --gold:          #C9A84C;
    --gold-light:    #E2C56A;
    --gold-glow:     rgba(201,168,76,0.12);
    --bg:            #FAF7F4;
    --bg2:           #F2EDE6;
    --surface:       #FFFFFF;
    --border:        rgba(201,168,76,0.22);
    --text:          #1C1008;
    --muted:         #7A6555;
    --subtle:        #C4B5A8;
  }

  /* ── Page root ─────────────────────────────────────── */
  .di-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Hero ──────────────────────────────────────────── */
  .di-hero {
    position: relative;
    background: linear-gradient(135deg, #1a0808 0%, #2e1010 40%, #1a1206 100%);
    padding: 88px 24px 100px;
    text-align: center;
    overflow: hidden;
  }
  .di-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 10% 30%, rgba(201,168,76,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 90% 70%, rgba(139,26,26,0.25) 0%, transparent 55%),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 40px,
        rgba(201,168,76,0.015) 40px,
        rgba(201,168,76,0.015) 41px
      );
    pointer-events: none;
  }
  .di-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 16px; border-radius: 40px;
    border: 1px solid rgba(201,168,76,0.30);
    background: rgba(201,168,76,0.07);
    color: var(--gold-light);
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.20em; text-transform: uppercase;
    margin-bottom: 22px; position: relative; z-index: 1;
  }
  .di-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.6rem, 6vw, 4.4rem);
    font-weight: 700; line-height: 1.05;
    color: #FDF8F0;
    position: relative; z-index: 1; margin-bottom: 18px;
  }
  .di-hero-title em { font-style: italic; color: var(--gold-light); }
  .di-hero-sub {
    font-size: 1rem; font-weight: 300; color: rgba(253,248,240,0.60);
    max-width: 500px; margin: 0 auto 36px;
    line-height: 1.7; position: relative; z-index: 1;
  }
  .di-hero-rule {
    width: 60px; height: 1.5px; margin: 0 auto;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    position: relative; z-index: 1;
  }
  .di-hero-wave {
    position: absolute; bottom: 0; left: 0; right: 0; pointer-events: none;
  }

  /* ── Toolbar ───────────────────────────────────────── */
  .di-toolbar {
    position: sticky; top: 0; z-index: 10;
    background: rgba(250,247,244,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
  }
  .di-toolbar-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }

  /* Search */
  .di-search-wrap {
    position: relative;
    flex: 1; max-width: 320px; min-width: 200px;
  }
  .di-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--subtle); pointer-events: none;
  }
  .di-search {
    width: 100%; padding: 9px 14px 9px 36px;
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 6px; background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; color: var(--text);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .di-search:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow);
  }
  .di-search::placeholder { color: var(--subtle); }

  /* Category filter tabs */
  .di-filter-tabs {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .di-filter-icon { color: var(--muted); margin-right: 4px; flex-shrink: 0; }
  .di-tab {
    padding: 7px 14px; border-radius: 40px;
    border: 1px solid var(--border);
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.04em;
    color: var(--muted); cursor: pointer;
    transition: all 0.2s;
  }
  .di-tab.active {
    background: linear-gradient(135deg, var(--crimson), #9B2335);
    border-color: transparent; color: #fff;
    box-shadow: 0 2px 12px rgba(139,26,26,0.25);
  }
  .di-tab:hover:not(.active) {
    border-color: var(--gold); color: var(--text);
    background: var(--gold-glow);
  }

  /* ── Body ──────────────────────────────────────────── */
  .di-body {
    max-width: 1200px; margin: 0 auto;
    padding: 48px 24px 96px;
  }

  .di-count-line {
    font-size: 0.80rem; color: var(--muted); font-weight: 300;
    margin-bottom: 28px;
    display: flex; align-items: center; gap: 6px;
  }
  .di-count-num {
    font-weight: 600; color: var(--crimson);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
  }

  /* ── Cards grid ────────────────────────────────────── */
  .di-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 28px;
  }

  /* ── Dress Card ────────────────────────────────────── */
  .di-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 2px 0 rgba(201,168,76,0.12), 0 6px 24px rgba(139,26,26,0.04);
    transition: transform 0.30s cubic-bezier(.4,0,.2,1), box-shadow 0.30s;
    position: relative;
  }
  .di-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 2px 0 rgba(201,168,76,0.22), 0 24px 56px rgba(139,26,26,0.09);
  }

  /* Image */
  .di-img-wrap {
    position: relative;
    background: var(--bg2);
    aspect-ratio: 3/4;
    overflow: hidden;
  }
  .di-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(.4,0,.2,1);
  }
  .di-card:hover .di-img { transform: scale(1.05); }

  .di-img-placeholder {
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; color: var(--subtle);
    background: linear-gradient(135deg, rgba(201,168,76,0.05), rgba(139,26,26,0.04));
  }
  .di-img-placeholder span {
    font-size: 0.72rem; letter-spacing: 0.10em; text-transform: uppercase;
  }

  /* Category pill on image */
  .di-cat-pill {
    position: absolute; top: 12px; left: 12px;
    padding: 4px 10px; border-radius: 40px;
    background: rgba(26,5,5,0.72);
    backdrop-filter: blur(6px);
    color: var(--gold-light);
    font-size: 0.65rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    border: 1px solid rgba(201,168,76,0.25);
  }

  /* Availability badge */
  .di-avail {
    position: absolute; bottom: 12px; right: 12px;
    padding: 4px 10px; border-radius: 40px;
    background: rgba(26,5,5,0.72); backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.10);
    display: flex; align-items: center; gap: 6px;
  }
  .di-avail-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #22C55E;
    box-shadow: 0 0 6px rgba(34,197,94,0.60);
  }
  .di-avail span {
    font-size: 0.65rem; color: rgba(255,255,255,0.80);
    font-weight: 500; letter-spacing: 0.06em;
  }

  /* Card body */
  .di-card-body {
    padding: 18px 18px 14px;
    flex: 1; display: flex; flex-direction: column; gap: 10px;
  }
  .di-dress-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 700; line-height: 1.15;
    color: var(--text);
  }
  .di-dress-desc {
    font-size: 0.82rem; color: var(--muted); font-weight: 300;
    line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Qty pills */
  .di-qty-row {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .di-qty-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 6px;
    font-size: 0.75rem; font-weight: 500;
  }
  .di-qty-pill.adult {
    background: rgba(139,26,26,0.06);
    border: 1px solid rgba(139,26,26,0.14);
    color: var(--crimson);
  }
  .di-qty-pill.boys {
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.22);
    color: #7A5C1E;
  }
  .di-qty-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 700; line-height: 1;
  }

  /* Card footer */
  .di-card-foot {
    padding: 0 18px 18px;
  }
  .di-enquire-btn {
    width: 100%; padding: 11px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--text); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.22s;
  }
  .di-enquire-btn:hover {
    background: linear-gradient(135deg, var(--crimson), #9B2335);
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 16px rgba(139,26,26,0.28);
    transform: translateY(-1px);
  }

  /* ── Loading / Error / Empty ─────────────────────────── */
  .di-state {
    min-height: 60vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; text-align: center; padding: 40px;
  }
  .di-spinner {
    width: 48px; height: 48px; border-radius: 50%;
    border: 2px solid rgba(201,168,76,0.15);
    border-top-color: var(--gold);
    animation: diSpin 0.85s linear infinite;
  }
  @keyframes diSpin { to { transform: rotate(360deg); } }
  .di-state-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 700; color: var(--text);
  }
  .di-state-text { font-size: 0.875rem; color: var(--muted); font-weight: 300; }
  .di-retry-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 22px; border-radius: 5px;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
    border: none; color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
    cursor: pointer; transition: box-shadow 0.22s, transform 0.18s;
  }
  .di-retry-btn:hover { box-shadow: 0 4px 18px rgba(139,26,26,0.35); transform: translateY(-1px); }

  .di-empty { text-align: center; padding: 80px 20px; }
  .di-empty-icon {
    width: 72px; height: 72px; border-radius: 16px; margin: 0 auto 20px;
    background: rgba(139,26,26,0.06);
    border: 1px solid rgba(139,26,26,0.14);
    display: flex; align-items: center; justify-content: center; color: var(--crimson);
  }

  /* ── Responsive ───────────────────────────────────────── */
  @media (max-width: 768px) {
    .di-toolbar-inner { flex-direction: column; align-items: stretch; }
    .di-search-wrap { max-width: 100%; }
    .di-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  }
  @media (max-width: 480px) {
    .di-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
    .di-hero-title { font-size: 2.2rem; }
  }
`;

/* ─── Dress Card ────────────────────────────────────────────────────────── */
const DressCard = ({ item }) => {
  const [imgErr, setImgErr] = useState(false);
  const totalQty = (item.quantityAdult || 0) + (item.quantityPageBoys || 0);

  return (
    <div className="di-card">
      {/* Image */}
      <div className="di-img-wrap">
        {item.imagePath && !imgErr ? (
          <img
            className="di-img"
            src={item.imagePath}
            alt={item.dressItemName}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="di-img-placeholder">
            <ImageOff size={28} />
            <span>No image</span>
          </div>
        )}

        {/* Category pill */}
        {item.categoryName && (
          <span className="di-cat-pill">{item.categoryName}</span>
        )}

        {/* Availability */}
        {totalQty > 0 && (
          <div className="di-avail">
            <span className="di-avail-dot" />
            <span>Available</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="di-card-body">
        <h3 className="di-dress-name">{item.dressItemName}</h3>

        {item.description && (
          <p className="di-dress-desc">{item.description}</p>
        )}

        {/* Quantities */}
        <div className="di-qty-row">
          {item.quantityAdult > 0 && (
            <span className="di-qty-pill adult">
              <User size={11} />
              <span className="di-qty-val">{item.quantityAdult}</span>
              Adult
            </span>
          )}
          {item.quantityPageBoys > 0 && (
            <span className="di-qty-pill boys">
              <Users size={11} />
              <span className="di-qty-val">{item.quantityPageBoys}</span>
              Page Boys
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="di-card-foot">
        <Link to="/booking">
          <button className="di-enquire-btn">
            Enquire Now <ArrowRight size={13} />
          </button>
        </Link>
      </div>
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────────────────────────────── */
const DressItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/public/dress-items");
      setItems(res.data || []);
    } catch {
      setError("Failed to load dress items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* Unique categories */
  const categories = useMemo(() => {
    const names = items.map((i) => i.categoryName).filter(Boolean);
    return ["All", ...new Set(names)];
  }, [items]);

  /* Filtered list */
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        activeCategory === "All" || item.categoryName === activeCategory;
      const matchSearch =
        !searchTerm ||
        item.dressItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.categoryName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, activeCategory, searchTerm]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="di-root">
        {/* ── Hero ── */}
        <section className="di-hero">
          <div className="di-hero-badge">
            <Shirt size={12} /> Cultural Attire
          </div>
          <h1 className="di-hero-title">
            Dress &amp; <em>Costumes</em>
          </h1>
          <p className="di-hero-sub">
            Authentic traditional dress and ceremonial costumes for every
            wedding role — from bride and groom to page boys and guests.
          </p>
          <div className="di-hero-rule" />
          <div className="di-hero-wave">
            <svg
              viewBox="0 0 1440 80"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "80px" }}
            >
              <path
                d="M0,30 C480,80 960,0 1440,30 L1440,80 L0,80 Z"
                fill="#FAF7F4"
              />
            </svg>
          </div>
        </section>

        {/* ── Toolbar ── */}
        {!loading && !error && (
          <div className="di-toolbar">
            <div className="di-toolbar-inner">
              {/* Search */}
              <div className="di-search-wrap">
                <Search size={14} className="di-search-icon" />
                <input
                  type="text"
                  className="di-search"
                  placeholder="Search dresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category tabs */}
              <div className="di-filter-tabs">
                <Filter size={13} className="di-filter-icon" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`di-tab${activeCategory === cat ? " active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="di-body">
          {!loading && !error && items.length > 0 && (
            <p className="di-count-line">
              Showing <span className="di-count-num">{filtered.length}</span> of{" "}
              {items.length} items
              {activeCategory !== "All" && ` in "${activeCategory}"`}
            </p>
          )}

          {loading && (
            <div className="di-state">
              <div className="di-spinner" />
              <p className="di-state-text">Loading collection…</p>
            </div>
          )}

          {error && (
            <div className="di-state">
              <p className="di-state-title">Something went wrong</p>
              <p className="di-state-text">{error}</p>
              <button className="di-retry-btn" onClick={fetchItems}>
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="di-empty">
              <div className="di-empty-icon">
                <Shirt size={28} />
              </div>
              <p className="di-state-title">No Items Yet</p>
              <p className="di-state-text">
                Our collection is being curated. Please check back soon.
              </p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && items.length > 0 && (
            <div className="di-empty">
              <p className="di-state-title">No Results Found</p>
              <p className="di-state-text">
                Try a different search term or category.
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="di-grid">
              {filtered.map((item) => (
                <DressCard key={item.dressItemId} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DressItems;

