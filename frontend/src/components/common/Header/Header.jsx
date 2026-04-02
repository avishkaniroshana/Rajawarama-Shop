import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { clearAuth } from "../../../utils/auth";
import profileIcon from "../../../assets/images/profile-icon.png";
import logoImage from "../../../assets/images/Rajawarama logo.jpg";
import {
  ChevronDown,
  Crown,
  LogOut,
  Drum,
  LayoutDashboard,
  Shirt,
  User,
  Menu,
  X,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .rw-logo {
    flex-direction: row;   /* override column → side by side */
    align-items: center;
    gap: 10px;
  }

  .rw-logo-img {
    width: 70px;
    height: 70px;
    object-fit: contain;
    flex-shrink: 0;
    padding: 2px;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #C9A84C, #E8E8E8, #C9A84C, #A8A8A8) border-box;
    border: 2px solid transparent;
    box-shadow: 0 2px 16px rgba(201,168,76,0.25), 0 1px 4px rgba(0,0,0,0.10);
  }

  .rw-logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  :root {
    --crimson:       #8B1A1A;
    --crimson-light: #B22222;
    --crimson-glow:  rgba(139,26,26,0.10);
    --gold:          #C9A84C;
    --gold-light:    #E2C56A;
    --gold-glow:     rgba(201,168,76,0.18);
    --surface:       rgba(255,253,250,0.98);
    --border:        rgba(201,168,76,0.22);
    --text-main:     #1C1008;
    --text-muted:    #6B5B4E;
  }

  /* ── Shell ──────────────────────────────────────────────── */
  .rw-header {
    font-family: 'DM Sans', sans-serif;
    position: sticky; top: 0; z-index: 100;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    transition: padding 0.35s ease, box-shadow 0.35s ease;
  }
  .rw-header.scrolled {
    box-shadow: 0 4px 40px rgba(139,26,26,0.10), 0 1px 0 var(--border);
  }
  .rw-header.scrolled .rw-inner { padding-top: 10px; padding-bottom: 10px; }

  .rw-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 18px 32px;
    display: flex; align-items: center; justify-content: space-between;
    transition: padding 0.35s ease;
  }

  /* ── Logo ───────────────────────────────────────────────── */
  .rw-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem; font-weight: 700;
    color: var(--crimson); text-decoration: none;
    letter-spacing: 0.02em;
    display: flex; flex-direction: column; line-height: 1;
    position: relative;
  }
  .rw-logo .tagline {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.52rem; font-weight: 400;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--gold); margin-top: 3px;
  }
  .rw-logo::after {
    content: '';
    position: absolute; bottom: -4px; left: 0;
    width: 0; height: 1.5px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
    transition: width 0.4s ease;
  }
  .rw-logo:hover::after { width: 100%; }

  /* ── Nav ────────────────────────────────────────────────── */
  .rw-nav { display: flex; align-items: center; gap: 36px; }

  .rw-link {
    font-size: 0.80rem; font-weight: 500;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: var(--text-main); text-decoration: none;
    position: relative; padding-bottom: 3px;
    transition: color 0.25s;
  }
  .rw-link::after {
    content: '';
    position: absolute; bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 1.5px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
    transition: width 0.3s cubic-bezier(.4,0,.2,1);
  }
  .rw-link:hover { color: var(--crimson); }
  .rw-link:hover::after { width: 100%; }

  /* ── Services trigger ───────────────────────────────────── */
  .rw-svc-wrap { position: relative; }

  /* Transparent bridge that fills the gap between trigger and dropdown
     so the hover chain is never broken while the mouse travels down */
  .rw-svc-wrap::after {
    content: '';
    position: absolute;
    top: 100%;
    left: -16px;
    right: -16px;
    height: 22px; /* must be >= the gap (18px) + a little buffer */
  }
  .rw-svc-trigger {
    font-size: 0.80rem; font-weight: 500;
    letter-spacing: 0.10em; text-transform: uppercase;
    color: var(--text-main);
    display: flex; align-items: center; gap: 5px;
    padding-bottom: 3px; position: relative;
    transition: color 0.25s;
    background: none; border: none; cursor: pointer; user-select: none;
  }
  .rw-svc-trigger::after {
    content: '';
    position: absolute; bottom: 0; left: 50%;
    transform: translateX(-50%);
    width: 0; height: 1.5px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
    transition: width 0.3s cubic-bezier(.4,0,.2,1);
  }
  .rw-svc-trigger:hover { color: var(--crimson); }
  .rw-svc-trigger:hover::after { width: 100%; }
  .rw-svc-trigger .chevron { transition: transform 0.3s cubic-bezier(.4,0,.2,1); }
  .rw-svc-wrap:hover .chevron { transform: rotate(180deg); }

  /* ── Services dropdown ──────────────────────────────────── */
  .rw-svc-dropdown {
    position: absolute; top: calc(100% + 18px); left: 50%;
    transform: translateX(-50%) translateY(-8px);
    width: 285px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(139,26,26,0.13), 0 4px 16px rgba(0,0,0,0.06);
    opacity: 0; visibility: hidden; pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(.4,0,.2,1), visibility 0.25s;
    overflow: hidden;
  }
  .rw-svc-dropdown::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--crimson), var(--gold), var(--crimson));
  }
  .rw-svc-wrap:hover .rw-svc-dropdown {
    opacity: 1; visibility: visible; pointer-events: all;
    transform: translateX(-50%) translateY(0);
  }

  .rw-svc-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 20px; text-decoration: none;
    color: var(--text-main); font-size: 0.875rem;
    border-bottom: 1px solid rgba(201,168,76,0.09);
    transition: background 0.2s, padding-left 0.2s, color 0.2s;
  }
  .rw-svc-item:last-child { border-bottom: none; }
  .rw-svc-item:hover {
    background: linear-gradient(90deg, rgba(139,26,26,0.04), transparent);
    padding-left: 26px; color: var(--crimson);
  }
  .rw-svc-item:hover .svc-icon { color: var(--gold); }

  .svc-icon {
    width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(139,26,26,0.08), rgba(201,168,76,0.08));
    display: flex; align-items: center; justify-content: center;
    color: var(--crimson); transition: color 0.2s;
  }
  .svc-text { display: flex; flex-direction: column; }
  .svc-label { font-weight: 500; font-size: 0.875rem; }
  .svc-desc  { font-size: 0.70rem; color: var(--text-muted); margin-top: 2px; }

  /* ── Auth buttons ───────────────────────────────────────── */
  .rw-auth { display: flex; align-items: center; gap: 10px; }

  .rw-btn-in {
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--text-main); text-decoration: none;
    padding: 8px 18px; border: 1px solid rgba(0,0,0,0.14); border-radius: 2px;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .rw-btn-in:hover { border-color: var(--crimson); color: var(--crimson); background: var(--crimson-glow); }

  .rw-btn-up {
    font-size: 0.78rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
    color: #fff; text-decoration: none;
    padding: 8px 18px; border-radius: 2px;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
    position: relative; overflow: hidden;
    transition: box-shadow 0.25s, transform 0.2s;
  }
  .rw-btn-up::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.28), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  .rw-btn-up:hover { box-shadow: 0 4px 20px rgba(139,26,26,0.35); transform: translateY(-1px); }
  .rw-btn-up:hover::after { opacity: 1; }

  /* ── Profile button ─────────────────────────────────────── */
  .rw-prof-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 10px 6px 6px; border-radius: 40px;
    background: transparent; border: 1px solid var(--border);
    cursor: pointer; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    position: relative;
  }
  .rw-prof-btn:hover {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-glow);
    background: rgba(201,168,76,0.04);
  }
  .rw-prof-img {
    width: 34px; height: 34px; border-radius: 50%; object-fit: cover;
    border: 1.5px solid var(--gold);
  }
  .rw-prof-name {
    font-size: 0.83rem; font-weight: 500; color: var(--text-main);
    max-width: 110px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .rw-prof-chevron { transition: transform 0.3s; color: var(--text-muted); }
  .rw-prof-btn.open .rw-prof-chevron { transform: rotate(180deg); }

  /* ── Profile dropdown ───────────────────────────────────── */
  .rw-prof-dd {
    position: absolute; top: calc(100% + 14px); right: 0; width: 260px;
    background: #fff; border: 1px solid var(--border); border-radius: 6px;
    box-shadow: 0 24px 64px rgba(139,26,26,0.13), 0 4px 16px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: dropIn 0.22s cubic-bezier(.4,0,.2,1);
    transform-origin: top right;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: scale(0.94) translateY(-6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  .rw-prof-dd::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
  }

  .rw-dd-head {
    padding: 14px 18px;
    background: linear-gradient(135deg, rgba(139,26,26,0.03), rgba(201,168,76,0.04));
    border-bottom: 1px solid rgba(201,168,76,0.12);
    display: flex; align-items: center; gap: 12px;
  }
  .rw-dd-avi {
    width: 38px; height: 38px; border-radius: 50; flex-shrink: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1.05rem; font-weight: 700;
    font-family: 'Cormorant Garamond', serif;
    box-shadow: 0 2px 12px rgba(139,26,26,0.28);
  }
  .rw-dd-info { display: flex; flex-direction: column; }
  .rw-dd-name { font-weight: 600; font-size: 0.875rem; color: var(--text-main); }
  .rw-dd-role { font-size: 0.68rem; color: var(--gold); letter-spacing: 0.10em; text-transform: uppercase; margin-top: 2px; }

  .rw-dd-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 18px; font-size: 0.85rem; font-weight: 400;
    color: var(--text-main); text-decoration: none;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    transition: background 0.18s, color 0.18s, padding-left 0.2s;
    background: none; border-left: none; border-right: none; border-top: none;
    width: 100%; text-align: left; cursor: pointer;
  }
  .rw-dd-item:last-child { border-bottom: none; }
  .rw-dd-item:hover { background: rgba(139,26,26,0.04); padding-left: 24px; color: var(--crimson); }
  .rw-dd-item.admin { color: #4F46E5; }
  .rw-dd-item.admin:hover { background: rgba(79,70,229,0.06); color: #4338CA; padding-left: 24px; }
  .rw-dd-item.logout { color: #C0392B; }
  .rw-dd-item.logout:hover { background: rgba(192,57,43,0.06); color: #9B2335; padding-left: 24px; }

  .rw-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
  }

  /* ── Mobile toggle ──────────────────────────────────────── */
  .rw-mob-toggle {
    background: none; border: none; cursor: pointer;
    color: var(--text-main); display: none; padding: 6px; border-radius: 6px;
    transition: color 0.2s, background 0.2s;
  }
  .rw-mob-toggle:hover { color: var(--crimson); background: var(--crimson-glow); }

  /* ── Mobile overlay ─────────────────────────────────────── */
  .rw-mob-overlay {
    position: fixed; inset: 0;
    background: rgba(15,7,7,0.60);
    backdrop-filter: blur(6px);
    z-index: 200;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .rw-mob-panel {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(360px, 90vw);
    background: #fff;
    border-left: 3px solid var(--crimson);
    display: flex; flex-direction: column;
    overflow-y: auto;
    animation: slideIn 0.28s cubic-bezier(.4,0,.2,1);
    z-index: 201;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  .rw-mob-top {
    padding: 20px 24px; flex-shrink: 0;
    border-bottom: 1px solid rgba(201,168,76,0.15);
    background: linear-gradient(135deg, rgba(139,26,26,0.04), rgba(201,168,76,0.04));
    display: flex; align-items: center; justify-content: space-between;
  }
  .rw-mob-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.45rem; font-weight: 700; color: var(--crimson);
  }
  .rw-mob-close {
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); padding: 4px; border-radius: 50%;
    transition: color 0.2s, background 0.2s;
  }
  .rw-mob-close:hover { color: var(--crimson); background: var(--crimson-glow); }

  .rw-mob-nav { flex: 1; padding: 8px 0; }

  .rw-mob-link {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 13px 24px;
    font-size: 0.85rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text-main); text-decoration: none;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    background: none; border-left: none; border-right: none; border-top: none;
    text-align: left; cursor: pointer;
    transition: color 0.2s, background 0.2s, padding-left 0.2s;
  }
  .rw-mob-link:hover { color: var(--crimson); background: var(--crimson-glow); padding-left: 30px; }
  .rw-mob-link.admin-link { color: #4F46E5; }
  .rw-mob-link.admin-link:hover { background: rgba(79,70,229,0.06); color: #4338CA; }
  .rw-mob-link.logout-link { color: #C0392B; }
  .rw-mob-link.logout-link:hover { background: rgba(192,57,43,0.06); color: #9B2335; }

  .rw-mob-sub { background: rgba(139,26,26,0.02); }
  .rw-mob-sub-link {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 24px 11px 38px;
    font-size: 0.82rem; color: var(--text-muted); text-decoration: none;
    border-bottom: 1px solid rgba(0,0,0,0.03);
    transition: color 0.2s, padding-left 0.2s;
  }
  .rw-mob-sub-link:hover { color: var(--crimson); padding-left: 44px; }

  .rw-mob-auth {
    padding: 16px 24px; flex-shrink: 0;
    display: flex; flex-direction: column; gap: 10px;
    border-top: 1px solid rgba(201,168,76,0.15);
  }
  .rw-mob-sign-in {
    text-align: center; padding: 11px; text-decoration: none;
    border: 1px solid rgba(0,0,0,0.15); border-radius: 3px;
    font-size: 0.80rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--text-main); transition: border-color 0.2s, color 0.2s;
  }
  .rw-mob-sign-in:hover { border-color: var(--crimson); color: var(--crimson); }
  .rw-mob-sign-up {
    text-align: center; padding: 11px; text-decoration: none;
    background: linear-gradient(135deg, var(--crimson), var(--crimson-light));
    border-radius: 3px;
    font-size: 0.80rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
    color: #fff; transition: box-shadow 0.2s;
  }
  .rw-mob-sign-up:hover { box-shadow: 0 4px 16px rgba(139,26,26,0.35); }

  /* ── Responsive cutoff ──────────────────────────────────── */
  @media (max-width: 900px) {
    .rw-nav, .rw-auth { display: none !important; }
    .rw-mob-toggle { display: flex !important; align-items: center; justify-content: center; }
  }
`;

/* ─── Service items config ──────────────────────────────────────────────── */
const SERVICES = [
  {
    to: "/services/special",
    label: "Special Packages",
    desc: "Premium curated experiences",
    icon: <Crown size={15} />,
  },
  {
    to: "/services/dancing-group",
    label: "Dancing Group",
    desc: "Traditional & modern troupes",
    icon: <Drum size={15} />,
  },
  {
    to: "/services/dress-items",
    label: "Dress & Costumes",
    desc: "Authentic cultural attire",
    icon: <Shirt size={15} />,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const Header = () => {
  const { isLoggedIn: contextLoggedIn, userRole } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(contextLoggedIn);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobSvcOpen, setMobSvcOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);

  /* scroll watcher */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* auth listeners */
  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem("accessToken"));
    check();
    window.addEventListener("storage", check);
    window.addEventListener("auth-change", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("auth-change", check);
    };
  }, []);

  useEffect(() => {
    setIsLoggedIn(contextLoggedIn);
  }, [contextLoggedIn]);

  /* click-outside profile */
  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* lock scroll when mobile open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) await api.post("/api/auth/logout", { refreshToken });
    } catch (err) {
      console.error("Logout API failed:", err);
    }
    clearAuth();
    setProfileOpen(false);
    window.location.href = "/";
  };

  const fullName = localStorage.getItem("fullName") || "User";
  const initial = fullName[0]?.toUpperCase() ?? "U";
  const isAdmin = userRole === "ADMIN";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ════════════════ HEADER ════════════════ */}
      <header className={`rw-header${scrolled ? " scrolled" : ""}`}>
        <div className="rw-inner">
          {/* Logo */}
          <Link to="/">
            <img
              src={logoImage}
              alt="Rajawarama Logo"
              className="rw-logo-img"
            />
          </Link>

          <Link to="/" className="rw-logo">
            Rajawarama
            <span className="tagline">Cultural Performances</span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="rw-nav">
            <Link to="/" className="rw-link">
              Home
            </Link>

            {/* Services hover dropdown */}
            <div className="rw-svc-wrap">
              <button className="rw-svc-trigger">
                Services
                <ChevronDown size={14} className="chevron" />
              </button>
              <div className="rw-svc-dropdown">
                {SERVICES.map((s) => (
                  <Link key={s.to} to={s.to} className="rw-svc-item">
                    <span className="svc-icon">{s.icon}</span>
                    <span className="svc-text">
                      <span className="svc-label">{s.label}</span>
                      <span className="svc-desc">{s.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/my-bookings" className="rw-link">
              My Bookings
            </Link>
            <Link to="/contact" className="rw-link">
              Contact
            </Link>
          </nav>

          {/* ── Desktop Auth / Profile ── */}
          <div className="rw-auth" style={{ position: "relative" }}>
            {!isLoggedIn ? (
              <>
                <Link to="/signin" className="rw-btn-in">
                  Sign In
                </Link>
                <Link to="/signup" className="rw-btn-up">
                  Sign Up
                </Link>
              </>
            ) : (
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  className={`rw-prof-btn${profileOpen ? " open" : ""}`}
                  onClick={() => setProfileOpen((o) => !o)}
                  aria-expanded={profileOpen}
                >
                  <img
                    src={profileIcon}
                    alt="Profile"
                    className="rw-prof-img"
                  />
                  <span className="rw-prof-name">{fullName}</span>
                  <ChevronDown size={14} className="rw-prof-chevron" />
                </button>

                {profileOpen && (
                  <div className="rw-prof-dd" role="menu">
                    {/* User info */}
                    <div className="rw-dd-head">
                      <div className="rw-dd-avi">{initial}</div>
                      <div className="rw-dd-info">
                        <span className="rw-dd-name">{fullName}</span>
                        <span className="rw-dd-role">
                          {isAdmin ? "Administrator" : "CUSTOMER"}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="rw-dd-item"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <User size={15} /> My Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="rw-dd-item admin"
                        onClick={() => setProfileOpen(false)}
                        role="menuitem"
                      >
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}

                    <div className="rw-divider" />

                    <button
                      className="rw-dd-item logout"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="rw-mob-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* ════════════════ MOBILE MENU ════════════════ */}
      {mobileOpen && (
        <>
          {/* backdrop */}
          <div
            className="rw-mob-overlay"
            onClick={() => setMobileOpen(false)}
          />

          {/* slide panel */}
          <div className="rw-mob-panel">
            <div className="rw-mob-top">
              <span className="rw-mob-logo">Rajawarama</span>
              <button
                className="rw-mob-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="rw-mob-nav">
              <Link
                to="/"
                className="rw-mob-link"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>

              {/* Services accordion */}
              <button
                className="rw-mob-link"
                onClick={() => setMobSvcOpen((o) => !o)}
              >
                Services
                <ChevronDown
                  size={15}
                  style={{
                    transition: "transform 0.3s",
                    transform: mobSvcOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {mobSvcOpen && (
                <div className="rw-mob-sub">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="rw-mob-sub-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span style={{ color: "var(--crimson)" }}>{s.icon}</span>
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                to="/booking"
                className="rw-mob-link"
                onClick={() => setMobileOpen(false)}
              >
                Booking
              </Link>
              <Link
                to="/contact"
                className="rw-mob-link"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>

              {/* Logged-in mobile links */}
              {isLoggedIn && (
                <>
                  <Link
                    to="/profile"
                    className="rw-mob-link"
                    style={{ gap: 10 }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <User size={16} /> My Profile
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="rw-mob-link admin-link"
                      style={{ gap: 10 }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    className="rw-mob-link logout-link"
                    style={{ gap: 10 }}
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              )}
            </nav>

            {/* Sign in / up — only when logged out */}
            {!isLoggedIn && (
              <div className="rw-mob-auth">
                <Link
                  to="/signin"
                  className="rw-mob-sign-in"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rw-mob-sign-up"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Header;
