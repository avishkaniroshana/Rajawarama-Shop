import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ArrowUpRight,
  Sparkles,
  Users,
  Shirt,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --crimson:        #8B1A1A;
    --crimson-light:  #B22222;
    --crimson-glow:   rgba(139,26,26,0.18);
    --gold:           #C9A84C;
    --gold-light:     #E2C56A;
    --gold-dim:       rgba(201,168,76,0.14);
    --ft-bg:          #0D0605;
    --ft-surface:     #130808;
    --ft-border:      rgba(201,168,76,0.12);
    --ft-text:        #C8B8AE;
    --ft-muted:       #6B5042;
    --ft-white:       #F5EDE8;
  }

  /* ── Wrapper ─────────────────────────────────────────────── */
  .ft-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--ft-bg);
    position: relative;
    overflow: hidden;
  }

  /* Decorative background orbs */
  .ft-root::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 480px; height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,26,26,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .ft-root::after {
    content: '';
    position: absolute;
    bottom: 60px; right: -80px;
    width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Top gold rule ───────────────────────────────────────── */
  .ft-top-rule {
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--gold) 30%,
      var(--gold-light) 50%,
      var(--gold) 70%,
      transparent 100%
    );
    opacity: 0.55;
  }

  /* ── Main grid ───────────────────────────────────────────── */
  .ft-main {
    max-width: 1280px;
    margin: 0 auto;
    padding: 72px 40px 56px;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
    gap: 48px 40px;
  }

  /* ── Brand column ────────────────────────────────────────── */
  .ft-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--ft-white);
    letter-spacing: 0.02em;
    line-height: 1;
    text-decoration: none;
    display: inline-block;
    position: relative;
    transition: color 0.3s;
  }
  .ft-brand-name:hover { color: var(--gold-light); }

  .ft-brand-tagline {
    font-size: 0.55rem;
    font-weight: 400;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 4px;
    display: block;
  }

  .ft-brand-divider {
    width: 48px; height: 1.5px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
    margin: 18px 0;
  }

  .ft-brand-desc {
    font-size: 0.875rem;
    line-height: 1.75;
    color: var(--ft-text);
    font-weight: 300;
    max-width: 280px;
  }

  .ft-brand-desc em {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: var(--gold-light);
    font-size: 1rem;
  }

  /* Social icons */
  .ft-socials {
    display: flex;
    gap: 10px;
    margin-top: 28px;
  }
  .ft-social-btn {
    width: 36px; height: 36px;
    border-radius: 6px;
    border: 1px solid var(--ft-border);
    background: rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: center;
    color: var(--ft-muted);
    text-decoration: none;
    transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.2s;
  }
  .ft-social-btn:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: var(--gold-dim);
    transform: translateY(-2px);
  }

  /* ── Column headings ─────────────────────────────────────── */
  .ft-col-head {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--ft-white);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 12px;
  }
  .ft-col-head::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    width: 28px; height: 1.5px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
  }

  /* ── Quick links ─────────────────────────────────────────── */
  .ft-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }

  .ft-link {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.875rem; font-weight: 400;
    color: var(--ft-text); text-decoration: none;
    padding: 5px 0;
    border-bottom: 1px solid transparent;
    transition: color 0.22s, gap 0.22s;
    position: relative;
  }
  .ft-link .arrow {
    opacity: 0;
    transform: translate(-4px, 4px);
    transition: opacity 0.22s, transform 0.22s;
    flex-shrink: 0;
    color: var(--gold);
  }
  .ft-link:hover { color: var(--ft-white); gap: 10px; }
  .ft-link:hover .arrow { opacity: 1; transform: translate(0, 0); }

  /* ── Services sub-items ──────────────────────────────────── */
  .ft-svc-item {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(201,168,76,0.06);
    text-decoration: none;
    transition: gap 0.22s;
  }
  .ft-svc-item:last-child { border-bottom: none; }
  .ft-svc-icon {
    width: 30px; height: 30px; border-radius: 6px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(139,26,26,0.20), rgba(201,168,76,0.10));
    border: 1px solid rgba(201,168,76,0.12);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold);
    transition: background 0.22s, border-color 0.22s;
  }
  .ft-svc-item:hover .ft-svc-icon {
    background: linear-gradient(135deg, rgba(139,26,26,0.35), rgba(201,168,76,0.18));
    border-color: var(--gold);
  }
  .ft-svc-label {
    font-size: 0.83rem; color: var(--ft-text);
    transition: color 0.22s;
  }
  .ft-svc-item:hover .ft-svc-label { color: var(--ft-white); }

  /* ── Contact column ──────────────────────────────────────── */
  .ft-contact-item {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 18px;
  }
  .ft-contact-icon-wrap {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: rgba(139,26,26,0.18);
    border: 1px solid rgba(139,26,26,0.30);
    display: flex; align-items: center; justify-content: center;
    color: var(--crimson-light);
    margin-top: 1px;
  }
  .ft-contact-label {
    font-size: 0.68rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--ft-muted);
    margin-bottom: 2px;
  }
  .ft-contact-value {
    font-size: 0.875rem; color: var(--ft-text);
    text-decoration: none;
    transition: color 0.22s;
    display: block;
    line-height: 1.5;
  }
  a.ft-contact-value:hover { color: var(--gold-light); }

  /* Address styled block */
  .ft-address-block {
    border-left: 2px solid rgba(201,168,76,0.20);
    padding-left: 10px;
    line-height: 1.8;
    font-size: 0.875rem;
    color: var(--ft-text);
    font-style: normal;
  }

  /* ── Bottom bar ──────────────────────────────────────────── */
  .ft-bottom-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ft-border), transparent);
  }
  .ft-bottom {
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .ft-copy {
    font-size: 0.78rem;
    color: var(--ft-muted);
    letter-spacing: 0.04em;
  }
  .ft-copy span { color: var(--gold); }

  .ft-badge {
    font-size: 0.70rem;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--ft-muted);
    display: flex; align-items: center; gap: 6px;
  }
  .ft-badge::before {
    content: '';
    display: inline-block;
    width: 20px; height: 1px;
    background: linear-gradient(90deg, var(--crimson), var(--gold));
  }

  /* ── Responsive ──────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .ft-main {
      grid-template-columns: 1fr 1fr;
      gap: 40px 32px;
    }
  }
  @media (max-width: 640px) {
    .ft-main {
      grid-template-columns: 1fr;
      padding: 48px 24px 40px;
      gap: 36px;
    }
    .ft-bottom {
      padding: 18px 24px;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }
    .ft-brand-desc { max-width: 100%; }
  }
`;

/* ─── Data ───────────────────────────────────────────────────────────────── */
const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/booking", label: "Booking" },
  { to: "/contact", label: "Contact" },
];

const SERVICES = [
  {
    to: "/services/special",
    label: "Special Packages",
    icon: <Sparkles size={13} />,
  },
  {
    to: "/services/dancing-group",
    label: "Dancing Group",
    icon: <Users size={13} />,
  },
  {
    to: "/services/dress-items",
    label: "Dress & Costumes",
    icon: <Shirt size={13} />,
  },
];

const SOCIALS = [
  {
    href: "https://facebook.com",
    icon: <Facebook size={15} />,
    label: "Facebook",
  },
  {
    href: "https://instagram.com",
    icon: <Instagram size={15} />,
    label: "Instagram",
  },
  {
    href: "https://youtube.com",
    icon: <Youtube size={15} />,
    label: "YouTube",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const Footer = () => {
  const styleRef = useRef(false);

  return (
    <>
      {!styleRef.current && (
        <style
          ref={() => {
            styleRef.current = true;
          }}
          dangerouslySetInnerHTML={{ __html: FOOTER_STYLES }}
        />
      )}

      <footer className="ft-root">
        {/* Gold top rule */}
        <div className="ft-top-rule" />

        {/* ── Main grid ── */}
        <div className="ft-main">
          {/* ── Col 1 · Brand ── */}
          <div>
            <Link to="/" className="ft-brand-name">
              Rajawarama
              <span className="ft-brand-tagline">Cultural Performances</span>
            </Link>
            <div className="ft-brand-divider" />
            <p className="ft-brand-desc">
              Preserving Sri Lanka's traditional wedding and cultural heritage
              through <em>authentic performances</em> and artisan services —
              passed down through generations.
            </p>

            {/* Social icons */}
            <div className="ft-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social-btn"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2 · Quick Links ── */}
          <div>
            <h4 className="ft-col-head">Quick Links</h4>
            <ul className="ft-links">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="ft-link">
                    <ArrowUpRight size={13} className="arrow" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 · Services ── */}
          <div>
            <h4 className="ft-col-head">Services</h4>
            {SERVICES.map((s) => (
              <Link key={s.to} to={s.to} className="ft-svc-item">
                <span className="ft-svc-icon">{s.icon}</span>
                <span className="ft-svc-label">{s.label}</span>
              </Link>
            ))}
          </div>

          {/* ── Col 4 · Contact ── */}
          <div>
            <h4 className="ft-col-head">Contact Us</h4>

            <div className="ft-contact-item">
              <span className="ft-contact-icon-wrap">
                <Mail size={14} />
              </span>
              <div>
                <p className="ft-contact-label">Email</p>
                <a
                  href="mailto:isurudasanayaka98@gmail.com"
                  className="ft-contact-value"
                >
                  isurudasanayaka98@gmail.com
                </a>
              </div>
            </div>

            <div className="ft-contact-item">
              <span className="ft-contact-icon-wrap">
                <Phone size={14} />
              </span>
              <div>
                <p className="ft-contact-label">Phone</p>
                <a href="tel:+94773583546" className="ft-contact-value">
                  +94 77 358 3546
                </a>
              </div>
            </div>

            <div className="ft-contact-item">
              <span className="ft-contact-icon-wrap">
                <MapPin size={14} />
              </span>
              <div>
                <p className="ft-contact-label">Location</p>
                <address className="ft-address-block">
                  Badulla Road,
                  <br />
                  Bindunuwewa,
                  <br />
                  Bandarawela,
                  <br />
                  Sri Lanka.
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom-rule" />
        <div className="ft-bottom">
          <p className="ft-copy">
            © {new Date().getFullYear()} <span>Rajawarama</span>. All rights
            reserved.
          </p>
          <p className="ft-badge">Sri Lankan Cultural Heritage</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
