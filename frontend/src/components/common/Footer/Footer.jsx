import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  ArrowUpRight,
  Crown,
  Drum,
  Shirt,
} from "lucide-react";

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

  .ft-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--ft-bg);
    position: relative;
    overflow: hidden;
  }
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
  .ft-top-rule {
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent 100%
    );
    opacity: 0.55;
  }
  .ft-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 24px 20px;
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr 1.4fr;
    gap: 32px;
  }
  @media (max-width: 900px) {
    .ft-main { grid-template-columns: 1fr 1fr; gap: 20px; }
  }
  @media (max-width: 560px) {
    .ft-main { grid-template-columns: 1fr; gap: 16px; padding: 20px 20px 16px; }
  }
  .ft-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--ft-white);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
    line-height: 1;
    margin-bottom: 10px;
  }
  .ft-brand-tagline {
    font-size: 0.58rem;
    font-weight: 400;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    font-family: 'DM Sans', sans-serif;
  }
  .ft-brand-divider {
    width: 36px;
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin-bottom: 8px;
  }
  .ft-brand-desc {
    font-size: 0.78rem;
    color: var(--ft-text);
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .ft-brand-desc em { color: var(--gold-light); font-style: italic; }
  .ft-socials { display: flex; gap: 6px; }
  .ft-social-btn {
    width: 28px; height: 28px;
    border-radius: 6px;
    border: 1px solid var(--ft-border);
    background: rgba(201,168,76,0.05);
    color: var(--ft-muted);
    display: flex; align-items: center; justify-content: center;
    text-decoration: none;
    transition: all 0.2s;
  }
  .ft-social-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.10); }
  .ft-col-head {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ft-white);
    margin-bottom: 10px;
    padding-bottom: 7px;
    border-bottom: 1px solid var(--ft-border);
    letter-spacing: 0.04em;
  }
  .ft-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
  .ft-link {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.78rem; color: var(--ft-text);
    text-decoration: none;
    transition: color 0.18s;
  }
  .ft-link:hover { color: var(--gold); }
  .ft-link .arrow { color: var(--ft-muted); transition: color 0.18s; }
  .ft-link:hover .arrow { color: var(--gold); }
  .ft-svc-item {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 8px;
    border-radius: 6px;
    text-decoration: none;
    transition: background 0.18s;
    margin-bottom: 2px;
  }
  .ft-svc-item:hover { background: rgba(201,168,76,0.06); }
  .ft-svc-icon {
    width: 24px; height: 24px;
    border-radius: 5px;
    background: rgba(201,168,76,0.08);
    border: 1px solid var(--ft-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); flex-shrink: 0;
  }
  .ft-svc-label { font-size: 0.78rem; color: var(--ft-text); }
  .ft-contact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
  .ft-contact-icon-wrap {
    width: 26px; height: 26px;
    border-radius: 6px;
    background: rgba(201,168,76,0.08);
    border: 1px solid var(--ft-border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); flex-shrink: 0; margin-top: 1px;
  }
  .ft-contact-label { font-size: 0.60rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ft-muted); margin-bottom: 1px; }
  .ft-contact-value { font-size: 0.78rem; color: var(--ft-text); text-decoration: none; transition: color 0.18s; }
  .ft-contact-value:hover { color: var(--gold); }
  .ft-address-block { font-size: 0.76rem; color: var(--ft-text); font-style: normal; line-height: 1.55; }
  .ft-bottom-rule { height: 1px; background: var(--ft-border); margin: 0 24px; }
  .ft-bottom {
    max-width: 1200px; margin: 0 auto;
    padding: 10px 24px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 6px;
  }
  .ft-copy { font-size: 0.72rem; color: var(--ft-muted); }
  .ft-copy span { color: var(--gold-light); }
  .ft-badge {
    font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--ft-muted);
    padding: 2px 8px;
    border: 1px solid var(--ft-border);
    border-radius: 40px;
  }
`;

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/my-bookings", label: "My Bookings" },
  { to: "/contact", label: "Contact" },
  { to: "/services/special", label: "Special Packages" },
  { to: "/services/dancing-group", label: "Dancing Groups" },
  { to: "/services/dress-items", label: "Dress Items" },
];  

const SERVICES = [
  { to: "/services/special",        icon: <Crown size={13} />, label: "Special Packages" },
  { to: "/services/dancing-group",  icon: <Drum    size={13} />, label: "Dancing Groups" },
  { to: "/services/dress-items",    icon: <Shirt    size={13} />, label: "Dress Items" },
];

const SOCIALS = [
  { href: "https://facebook.com",  icon: <Facebook  size={15} />, label: "Facebook" },
];

//  FOOTER COMPONENT
const Footer = () => {
  /* ── Inject CSS on mount, remove on unmount — fixes navigation flash ── */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.setAttribute("data-component", "footer");
    tag.innerHTML = FOOTER_STYLES;
    document.head.appendChild(tag);
    return () => { if (document.head.contains(tag)) document.head.removeChild(tag); };
  }, []);

  return (
    <footer className="ft-root">
      {/* Gold top rule */}
      <div className="ft-top-rule" />

      {/* ── Main grid ── */}
      <div className="ft-main">
        {/* Col 1 · Brand */}
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
          <div className="ft-socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="ft-social-btn" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 · Quick Links */}
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

        {/* Col 3 · Services */}
        <div>
          <h4 className="ft-col-head">Services</h4>
          {SERVICES.map((s) => (
            <Link key={s.to} to={s.to} className="ft-svc-item">
              <span className="ft-svc-icon">{s.icon}</span>
              <span className="ft-svc-label">{s.label}</span>
            </Link>
          ))}
        </div>

        {/* Col 4 · Contact */}
        <div>
          <h4 className="ft-col-head">Contact Us</h4>
          <div className="ft-contact-item">
            <span className="ft-contact-icon-wrap"><Mail size={14} /></span>
            <div>
              <p className="ft-contact-label">Email</p>
              <a href="mailto:isurudasanayaka98@gmail.com" className="ft-contact-value">
                isurudasanayaka98@gmail.com
              </a>
            </div>
          </div>
          <div className="ft-contact-item">
            <span className="ft-contact-icon-wrap"><Phone size={14} /></span>
            <div>
              <p className="ft-contact-label">Phone</p>
              <a href="tel:+94773583546" className="ft-contact-value">+94 77 358 3546</a>
            </div>
          </div>
          <div className="ft-contact-item">
            <span className="ft-contact-icon-wrap"><MapPin size={14} /></span>
            <div>
              <p className="ft-contact-label">Location</p>
              <address className="ft-address-block">
                Badulla Road,<br />Bindunuwewa,<br />Bandarawela,<br />Sri Lanka.
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom-rule" />
      <div className="ft-bottom">
        <p className="ft-copy">
          © {new Date().getFullYear()} <span>Rajawarama</span>. All rights reserved.
        </p>
        <p className="ft-badge">Sri Lankan Cultural Heritage</p>
      </div>
    </footer>
  );
};

export default Footer;

