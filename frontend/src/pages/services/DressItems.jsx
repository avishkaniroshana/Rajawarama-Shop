//   1. "Enquire Now" button → navigates to /booking/dress-only  (was /booking → 404)
//   2. <style dangerouslySetInnerHTML> → useEffect injection (fixes footer CSS flash)
//   3. Added "Book Dress Only" CTA banner above the grid
//   4. Shows category dress prices on each card (Groom / Bestman / Pageboy)
//   5. FIX: item.imageUrl → item.imagePath (matches API response & admin manager)

import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
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
  :root{--crimson:#8B1A1A;--crimson-light:#B22222;--crimson-glow:rgba(139,26,26,0.07);
    --gold:#C9A84C;--gold-light:#E2C56A;--gold-glow:rgba(201,168,76,0.12);
    --bg:#FAF7F4;--bg2:#F2EDE6;--surface:#FFFFFF;--border:rgba(201,168,76,0.22);
    --text:#1C1008;--muted:#7A6555;--subtle:#C4B5A8;}
  .di-root{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;overflow-x:hidden}
  .di-hero{position:relative;background:linear-gradient(135deg,#1a0808 0%,#2e1010 40%,#1a1206 100%);
    padding:88px 24px 100px;text-align:center;overflow:hidden}
  .di-hero::before{content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse 70% 60% at 10% 30%,rgba(201,168,76,0.12) 0%,transparent 55%),
               radial-gradient(ellipse 60% 50% at 90% 70%,rgba(139,26,26,0.25) 0%,transparent 55%);pointer-events:none}
  .di-hero-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 16px;border-radius:40px;
    border:1px solid rgba(201,168,76,0.30);background:rgba(201,168,76,0.07);color:var(--gold-light);
    font-size:0.72rem;font-weight:500;letter-spacing:0.20em;text-transform:uppercase;
    margin-bottom:22px;position:relative;z-index:1}
  .di-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2.6rem,6vw,4.4rem);
    font-weight:700;line-height:1.05;color:#FDF8F0;position:relative;z-index:1;margin-bottom:18px}
  .di-hero-title em{font-style:italic;color:var(--gold-light)}
  .di-hero-sub{font-size:1rem;font-weight:300;color:rgba(253,248,240,0.60);max-width:500px;
    margin:0 auto 36px;line-height:1.7;position:relative;z-index:1}
  .di-hero-rule{width:60px;height:1.5px;margin:0 auto;
    background:linear-gradient(90deg,transparent,var(--gold),transparent);position:relative;z-index:1}
  .di-toolbar{position:sticky;top:0;z-index:10;background:rgba(250,247,244,0.92);
    backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:16px 24px}
  .di-toolbar-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;
    justify-content:space-between;flex-wrap:wrap;gap:12px}
  .di-search-wrap{position:relative;flex:1;max-width:320px;min-width:200px}
  .di-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--subtle);pointer-events:none}
  .di-search{width:100%;padding:9px 14px 9px 36px;border:1px solid rgba(201,168,76,0.25);border-radius:6px;
    background:var(--surface);font-family:'DM Sans',sans-serif;font-size:0.85rem;color:var(--text);
    outline:none;transition:border-color 0.2s,box-shadow 0.2s}
  .di-search:focus{border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-glow)}
  .di-search::placeholder{color:var(--subtle)}
  .di-filter-tabs{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .di-filter-icon{color:var(--muted);margin-right:4px;flex-shrink:0}
  .di-tab{padding:7px 14px;border-radius:40px;border:1px solid var(--border);background:transparent;
    font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:500;letter-spacing:0.04em;
    color:var(--muted);cursor:pointer;transition:all 0.2s}
  .di-tab.active{background:linear-gradient(135deg,var(--crimson),#9B2335);border-color:transparent;
    color:#fff;box-shadow:0 2px 12px rgba(139,26,26,0.25)}
  .di-tab:hover:not(.active){border-color:var(--gold);color:var(--text);background:var(--gold-glow)}
  .di-body{max-width:1200px;margin:0 auto;padding:48px 24px 96px}
  .di-count-line{font-size:0.80rem;color:var(--muted);font-weight:300;margin-bottom:28px;display:flex;align-items:center;gap:6px}
  .di-count-num{font-weight:600;color:var(--crimson);font-family:'Cormorant Garamond',serif;font-size:1rem}
  .di-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:28px}
  .di-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;
    display:flex;flex-direction:column;
    box-shadow:0 2px 0 rgba(201,168,76,0.12),0 6px 24px rgba(139,26,26,0.04);
    transition:transform 0.30s cubic-bezier(.4,0,.2,1),box-shadow 0.30s;position:relative}
  .di-card:hover{transform:translateY(-5px);box-shadow:0 2px 0 rgba(201,168,76,0.22),0 24px 56px rgba(139,26,26,0.09)}
  .di-img-wrap{position:relative;background:var(--bg2);height:220px;overflow:hidden}
  .di-img{width:100%;height:100%;object-fit:contain;background:var(--bg2);transition:transform 0.5s cubic-bezier(.4,0,.2,1)}
  .di-card:hover .di-img{transform:scale(1.05)}
  .di-img-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:10px;color:var(--subtle);
    background:linear-gradient(135deg,rgba(201,168,76,0.05),rgba(139,26,26,0.04))}
  .di-img-placeholder span{font-size:0.72rem;letter-spacing:0.10em;text-transform:uppercase}
  .di-cat-pill{position:absolute;top:12px;left:12px;padding:4px 10px;border-radius:40px;
    background:rgba(26,5,5,0.72);backdrop-filter:blur(6px);
    color:var(--gold-light);font-size:0.66rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase}
  .di-card-body{padding:18px 18px 12px;flex:1;display:flex;flex-direction:column;gap:8px}
  .di-dress-name{font-family:'Cormorant Garamond',serif;font-size:1.20rem;font-weight:700;
    color:var(--text);margin:0;line-height:1.2}
  .di-dress-desc{font-size:0.78rem;color:var(--muted);line-height:1.55;margin:0;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .di-qty-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
  .di-qty-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:5px;
    font-size:0.70rem;font-weight:500}
  .di-qty-pill.adult{background:rgba(55,48,163,0.07);border:1px solid rgba(55,48,163,0.16);color:#3730A3}
  .di-qty-pill.boys{background:rgba(201,168,76,0.10);border:1px solid rgba(201,168,76,0.28);color:#8B6914}
  .di-qty-val{font-family:'Cormorant Garamond',serif;font-size:0.95rem;font-weight:700}
  /* ── Category prices ── */
  .di-price-table{margin-top:8px;background:rgba(139,26,26,0.04);border:1px solid rgba(201,168,76,0.18);
    border-radius:8px;padding:8px 12px;display:flex;flex-direction:column;gap:4px}
  .di-price-row{display:flex;justify-content:space-between;align-items:center;font-size:0.72rem}
  .di-price-key{color:var(--muted)}
  .di-price-val{font-weight:600;color:var(--crimson);font-family:'Cormorant Garamond',serif;font-size:0.80rem}
  .di-card-foot{padding:12px 18px 18px;border-top:1px solid var(--border);margin-top:auto}
  .di-enquire-btn{width:100%;padding:11px 18px;border-radius:7px;border:none;cursor:pointer;
    background:linear-gradient(135deg,var(--crimson),#9B2335);color:#fff;
    font-family:'DM Sans',sans-serif;font-size:0.80rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;
    display:flex;align-items:center;justify-content:center;gap:8px;
    transition:box-shadow 0.22s,transform 0.18s}
  .di-enquire-btn:hover{box-shadow:0 4px 18px rgba(139,26,26,0.32);transform:translateY(-1px)}
  .di-cta-banner{background:linear-gradient(135deg,rgba(139,26,26,0.06),rgba(201,168,76,0.10));
    border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:16px 22px;
    display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:28px}
  .di-cta-text{font-size:0.88rem;color:var(--text);font-weight:400;line-height:1.55}
  .di-cta-text strong{color:var(--crimson)}
  .di-cta-link{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:7px;border:none;
    background:linear-gradient(135deg,var(--crimson),#9B2335);color:#fff;
    font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;
    text-decoration:none;transition:box-shadow 0.22s}
  .di-cta-link:hover{box-shadow:0 4px 16px rgba(139,26,26,0.30)}
  .di-spinner{width:44px;height:44px;border-radius:50%;border:2px solid rgba(201,168,76,0.15);
    border-top-color:var(--gold);animation:diSpin 0.85s linear infinite;margin:80px auto;display:block}
  @keyframes diSpin{to{transform:rotate(360deg)}}
  .di-error{text-align:center;padding:60px 20px;color:var(--crimson)}
  .di-empty{text-align:center;padding:60px 20px;color:var(--muted);font-size:0.90rem}
`;

const DressCard = ({ item }) => {
  const navigate = useNavigate();

  // ✅ FIX: was item.imageUrl — API returns item.imagePath (same field used in admin DressItemsManager)
  const hasImage = !!item.imagePath;
  const imageSrc = hasImage
    ? `${api.defaults.baseURL ?? ""}${item.imagePath}`
    : null;

  const prices = [
    item.categoryGroomDressPrice && {
      label: "Groom",
      price: item.categoryGroomDressPrice,
    },
    item.categoryBestmanDressPrice && {
      label: "Bestman",
      price: item.categoryBestmanDressPrice,
    },
    item.categoryPageBoyDressPrice && {
      label: "Pageboy",
      price: item.categoryPageBoyDressPrice,
    },
  ].filter(Boolean);

  return (
    <div className="di-card">
      {/* Image */}
      <div className="di-img-wrap">
        {hasImage ? (
          // ✅ FIX: was item.imageUrl
          <img
            src={imageSrc}
            alt={item.dressItemName}
            className="di-img"
            onError={(e) => {
              // If the image URL is broken, fall back to placeholder
              e.currentTarget.style.display = "none";
              const placeholder = e.currentTarget.parentElement.querySelector(
                ".di-img-placeholder",
              );
              if (placeholder) placeholder.style.display = "flex";
            }}
          />
        ) : null}

        {/* Placeholder shown when no imagePath OR when img load fails */}
        <div
          className="di-img-placeholder"
          style={{ display: hasImage ? "none" : "flex" }}
        >
          <ImageOff size={28} strokeWidth={1.5} />
          <span>No image</span>
        </div>

        {item.categoryName && (
          <span className="di-cat-pill">{item.categoryName}</span>
        )}
      </div>

      {/* Body */}
      <div className="di-card-body">
        <h3 className="di-dress-name">{item.dressItemName}</h3>
        {item.description && (
          <p className="di-dress-desc">{item.description}</p>
        )}

        <div className="di-qty-row">
          {item.quantityAdult > 0 && (
            <span className="di-qty-pill adult">
              <User size={11} />
              <span className="di-qty-val">{item.quantityAdult}</span>Adult
            </span>
          )}
          {item.quantityPageBoys > 0 && (
            <span className="di-qty-pill boys">
              <Users size={11} />
              <span className="di-qty-val">{item.quantityPageBoys}</span>Page
              Boys
            </span>
          )}
        </div>

        {/* Category prices */}
        {prices.length > 0 && (
          <div className="di-price-table">
            {prices.map(({ label, price }) => (
              <div key={label} className="di-price-row">
                <span className="di-price-key">{label} Dressing</span>
                <span className="di-price-val">
                  Rs. {new Intl.NumberFormat("en-LK").format(price)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="di-card-foot">
        <button
          className="di-enquire-btn"
          onClick={() => navigate("/booking/dress-only")}
        >
          Request For Booking Now <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────
const DressItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  /* CSS injection — avoids flash */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-page", "dress-items");
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
    return () => {
      if (document.head.contains(tag)) document.head.removeChild(tag);
    };
  }, []);

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

  const categories = useMemo(() => {
    const names = items.map((i) => i.categoryName).filter(Boolean);
    return ["All", ...new Set(names)];
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
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
      }),
    [items, activeCategory, searchTerm],
  );

  return (
    <div className="di-root">
      {/* Hero */}
      <section className="di-hero">
        <div className="di-hero-badge">
          <Shirt size={12} /> Dress Items Booking
        </div>
        <h1 className="di-hero-title">
          Traditional <em>Wedding Dresses</em>
        </h1>
        <p className="di-hero-sub">
          Authentic Sri Lankan wedding attire for Grooms, Bestmen and Page Boys
          — crafted with cultural heritage and artisan care.
        </p>
        <div className="di-hero-rule" />
      </section>

      {/* Sticky toolbar */}
      <div className="di-toolbar">
        <div className="di-toolbar-inner">
          <div className="di-search-wrap">
            <Search size={14} className="di-search-icon" />
            <input
              className="di-search"
              placeholder="Search dresses or categories…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
          <button
            onClick={fetchItems}
            style={{
              padding: "8px",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: "6px",
              background: "transparent",
              cursor: "pointer",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="di-body">
        {/* Book Dress Only CTA banner */}
        <div className="di-cta-banner">
          <div className="di-cta-text">
            <strong>Want to book dresses only?</strong> No dancing package
            required — select dresses for Groom, Best Man and Page Boys and
            request a booking directly.
          </div>
          <Link to="/booking/dress-only" className="di-cta-link">
            <Shirt size={13} /> Book Dresses Only <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="di-spinner" />
        ) : error ? (
          <div className="di-error">{error}</div>
        ) : (
          <>
            <div className="di-count-line">
              Showing <span className="di-count-num">{filtered.length}</span> of{" "}
              {items.length} dress items
              {activeCategory !== "All" && (
                <>
                  {" "}
                  in <strong>{activeCategory}</strong>
                </>
              )}
            </div>
            {filtered.length === 0 ? (
              <div className="di-empty">
                No dresses found matching your search.
              </div>
            ) : (
              <div className="di-grid">
                {filtered.map((item) => (
                  <DressCard key={item.dressItemId} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DressItems;
