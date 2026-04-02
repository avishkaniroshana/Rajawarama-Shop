import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Drum,
  Shirt,
  Crown,
  ArrowRight,
  Star,
  Users,
  Award,
  Calendar,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{
    --cr:#8B1A1A;--cr-l:#B22222;--cr-g:rgba(139,26,26,.08);
    --go:#C9A84C;--go-l:#E2C56A;--go-g:rgba(201,168,76,.13);
    --in:#3730A3;--in-g:rgba(55,48,163,.07);
    --bg:#FAF7F4;--bg2:#F2EDE6;--surf:#fff;
    --bdr:rgba(201,168,76,.22);--tx:#1C1008;--mu:#7A6555;--su:#C4B5A8;
  }
  .hm-root{font-family:'DM Sans',sans-serif;background:var(--bg);overflow-x:hidden}

  /* ════════════════ HERO ════════════════ */
  .hm-hero{
    position:relative;min-height:100vh;
    background:linear-gradient(145deg,#0d0202 0%,#1a0505 35%,#2a0808 60%,#150808 100%);
    display:flex;align-items:center;justify-content:center;
    padding:20px 24px 80px;overflow:hidden;
  }

.shop-name {
  font-style: italic;
  font-weight: 1000;
  font-family: 'DM Sans', sans-serif;

  display: inline-block;
  line-height: 1.2;
  margin-top: -4px;

  background: linear-gradient(
    270deg,
    #7A0C0C,
    #FFD700,
    #FFFFFF,
    #B22222,
    #FFD700,
    #7A0C0C
  );
  background-size: 300% 300%;

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;

  animation: textShine 4s linear infinite;
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

  .hm-hero-subtitle{
  font-size:4.05rem;
  font-weight:400;color:rgba(253,248,240,.45);
  margin-bottom: 6px
  }

.div-service-loc {
  position: relative;
  display: block;
  width: fit-content;
  padding: 0 38px;
  margin: auto;
  border-radius: 6px;
  z-index: 1;
  text-align: center;
}

.div-service-loc::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  backdrop-filter: blur(8px);
  z-index: -1;
}

@keyframes borderFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

  .hm-hero-service-location-title{
  font-size:1.15rem;
  font-weight:500;color:rgba(212, 210, 193,.85);
  margin-bottom: 10px
}

  .hm-hero-service-location{
  font-size:1.05rem;
  font-weight:300;color:rgba(255,255,255,255);
  margin-bottom: 20px
}

  .hm-hero::before{content:'';position:absolute;inset:0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 20%,rgba(201,168,76,.10) 0%,transparent 55%),
      radial-gradient(ellipse 60% 50% at 80% 80%,rgba(139,26,26,.28) 0%,transparent 55%),
      radial-gradient(ellipse 40% 40% at 50% 50%,rgba(201,168,76,.06) 0%,transparent 60%);
    pointer-events:none}
  .hm-hero::after{content:'';position:absolute;inset:0;
    background:repeating-linear-gradient(55deg,transparent,transparent 50px,rgba(201,168,76,.02) 50px,rgba(201,168,76,.02) 51px);
    pointer-events:none}

  .hm-orb{position:absolute;border-radius:50%;animation:hm-float linear infinite;pointer-events:none}
  .hm-orb1{width:400px;height:400px;top:-100px;right:-100px;
    background:radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 70%);animation-duration:20s}
  .hm-orb2{width:300px;height:300px;bottom:-50px;left:-80px;
    background:radial-gradient(circle,rgba(139,26,26,.12) 0%,transparent 70%);animation-duration:16s;animation-direction:reverse}
  @keyframes hm-float{
    0%{transform:translate(0,0) rotate(0deg)}
    33%{transform:translate(30px,-20px) rotate(120deg)}
    66%{transform:translate(-20px,25px) rotate(240deg)}
    100%{transform:translate(0,0) rotate(360deg)}
  }

  .hm-hero-inner{position:relative;z-index:2;text-align:center;max-width:860px}
  .hm-hero-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 18px;border-radius:40px;
    border:1px solid rgba(201,168,76,.35);background:rgba(201,168,76,.08);
    color:var(--go-l);font-size:.70rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;
    margin-bottom:28px;backdrop-filter:blur(8px)}
  .hm-hero-badge::before{content:'✦';font-size:.65rem;color:var(--go)}
  .hm-hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(3rem,8vw,5.5rem);
    font-weight:700;line-height:1.02;color:#FDF8F0;margin-bottom:24px;letter-spacing:-.01em}
  .hm-hero-title em{font-style:italic;color:var(--go-l);display:block}
  .hm-hero-sub{font-size:1.05rem;font-weight:300;color:rgba(253,248,240,.62);
    max-width: 670px;margin:0 auto 40px;line-height:1.75}
  .hm-hero-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .hm-btn-primary{display:inline-flex;align-items:center;gap:9px;padding:14px 32px;
    border-radius:7px;border:none;
    background:linear-gradient(135deg,var(--cr),#9B2335);color:#fff;
    font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;letter-spacing:.09em;
    text-transform:uppercase;text-decoration:none;cursor:pointer;
    transition:box-shadow .25s,transform .18s;position:relative;overflow:hidden}
  .hm-btn-primary::after{content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(201,168,76,.22),transparent);opacity:0;transition:.25s}
  .hm-btn-primary:hover{box-shadow:0 6px 28px rgba(139,26,26,.40);transform:translateY(-2px)}
  .hm-btn-primary:hover::after{opacity:1}
  .hm-btn-outline{display:inline-flex;align-items:center;gap:9px;padding:14px 32px;
    border-radius:7px;border:1px solid rgba(201,168,76,.35);background:rgba(201,168,76,.07);
    color:var(--go-l);font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;
    letter-spacing:.09em;text-transform:uppercase;text-decoration:none;backdrop-filter:blur(6px);
    transition:all .22s}
  .hm-btn-outline:hover{background:rgba(201,168,76,.14);border-color:var(--go);color:var(--go-l);transform:translateY(-2px)}

  .hm-scroll-ind{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);
    z-index:2;display:flex;flex-direction:column;align-items:center;gap:6px;
    color:rgba(253,248,240,.35);font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;
    animation:hm-bob 2.2s ease-in-out infinite}
  @keyframes hm-bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}
  .hm-hero-wave{position:absolute;bottom:0;left:0;right:0;pointer-events:none}

  /* ════════════════ STATS ════════════════ */
  .hm-stats{background:var(--surf);border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);
    padding:36px 24px}
  .hm-stats-inner{max-width:960px;margin:0 auto;
    display:grid;grid-template-columns:repeat(4,1fr);gap:0}
  .hm-stat{text-align:center;padding:8px 20px;position:relative}
  .hm-stat:not(:last-child)::after{content:'';position:absolute;right:0;top:15%;bottom:15%;
    width:1px;background:var(--bdr)}
  .hm-stat-num{font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;
    line-height:1;color:var(--cr);margin-bottom:4px}
  .hm-stat-label{font-size:.68rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--mu)}
  @media(max-width:600px){
    .hm-stats-inner{grid-template-columns:1fr 1fr}
    .hm-stat:nth-child(2)::after,.hm-stat:nth-child(4)::after{display:none}
  }

  /* ════════════════ SECTION BASE ════════════════ */
  .hm-section{padding:96px 24px}
  .hm-section-inner{max-width:1200px;margin:0 auto}
  .hm-section-header{text-align:center;margin-bottom:60px}
  .hm-section-eyebrow{font-size:.65rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;
    color:var(--go);margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:10px}
  .hm-section-eyebrow::before,.hm-section-eyebrow::after{content:'';width:30px;height:1px;
    background:linear-gradient(90deg,transparent,var(--go))}
  .hm-section-eyebrow::after{background:linear-gradient(270deg,transparent,var(--go))}
  .hm-section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3rem);
    font-weight:700;color:var(--tx);margin-bottom:14px;line-height:1.15}
  .hm-section-title em{font-style:italic;color:var(--cr)}
  .hm-section-sub{font-size:.90rem;color:var(--mu);font-weight:300;max-width:520px;
    margin:0 auto;line-height:1.75}

  /* ════════════════ SERVICES ════════════════ */
  .hm-services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}
  .hm-svc-card{border:1px solid var(--bdr);border-radius:12px;padding:32px;
    background:var(--surf);position:relative;overflow:hidden;
    box-shadow:0 2px 0 rgba(201,168,76,.12),0 6px 24px rgba(139,26,26,.04);
    transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer;text-decoration:none;display:block}
  .hm-svc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,var(--cr),var(--go));opacity:0;transition:.3s}
  .hm-svc-card:hover{transform:translateY(-5px);border-color:rgba(201,168,76,.35);
    box-shadow:0 2px 0 rgba(201,168,76,.22),0 20px 52px rgba(139,26,26,.08)}
  .hm-svc-card:hover::before{opacity:1}
  .hm-svc-icon{width:52px;height:52px;border-radius:12px;margin-bottom:22px;
    display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,rgba(139,26,26,.08),rgba(201,168,76,.08));
    border:1px solid rgba(201,168,76,.18);color:var(--cr);transition:all .3s}
  .hm-svc-card:hover .hm-svc-icon{background:linear-gradient(135deg,var(--cr),#9B2335);
    color:#fff;border-color:transparent;box-shadow:0 4px 16px rgba(139,26,26,.28)}
  .hm-svc-name{font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:700;
    color:var(--tx);margin-bottom:10px}
  .hm-svc-desc{font-size:.83rem;color:var(--mu);line-height:1.65;font-weight:300;margin-bottom:18px}
  .hm-svc-link{font-size:.75rem;font-weight:500;letter-spacing:.10em;text-transform:uppercase;
    color:var(--cr);display:flex;align-items:center;gap:5px;transition:gap .2s}
  .hm-svc-card:hover .hm-svc-link{gap:9px}

  /* ════════════════ WHY US ════════════════ */
  .hm-why-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:24px}
  .hm-why-card{padding:28px;border:1px solid var(--bdr);border-radius:10px;
    background:var(--surf);text-align:center;
    box-shadow:0 2px 0 rgba(201,168,76,.10),0 4px 16px rgba(0,0,0,.03);
    transition:all .25s}
  .hm-why-card:hover{transform:translateY(-3px);border-color:rgba(201,168,76,.35);
    box-shadow:0 2px 0 rgba(201,168,76,.18),0 12px 36px rgba(139,26,26,.06)}
  .hm-why-icon{width:56px;height:56px;border-radius:50%;margin:0 auto 18px;
    background:linear-gradient(135deg,var(--cr),#9B2335);
    display:flex;align-items:center;justify-content:center;color:#fff;
    box-shadow:0 4px 16px rgba(139,26,26,.25)}
  .hm-why-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;
    color:var(--tx);margin-bottom:8px}
  .hm-why-desc{font-size:.82rem;color:var(--mu);line-height:1.65;font-weight:300}

  @media(max-width:600px){
    .hm-hero{padding:100px 20px 60px}
    .hm-section{padding:64px 20px}
  }
`;

/* ─── Data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    to: "/services/special",
    icon: <Crown size={22} />,
    name: "Special Packages",
    desc: "Curated premium bundles combining attire, dancing, and coordination — everything for a seamless wedding day.",
  },
  {
    to: "/services/dancing-group",
    icon: <Drum size={22} />,
    name: "Dancing Groups",
    desc: "Breathtaking Kandyan and traditional troupes that bring rhythm, colour, and grandeur to every ceremony.",
  },
  {
    to: "/services/dress-items",
    icon: <Shirt size={22} />,
    name: "Dress & Costumes",
    desc: "Authentic traditional attire for the groom, groomsmen, and page boys — handcrafted with heritage in mind.",
  },
];

const WHY = [
  {
    icon: <Award size={22} />,
    title: "25+ Years Heritage",
    desc: "Over two decades of experience preserving and presenting authentic Sri Lankan traditions.",
  },
  {
    icon: <Users size={22} />,
    title: "Expert Performers",
    desc: "Trained, certified Kandyan artists who bring energy, precision and cultural pride to every event.",
  },
  {
    icon: <Star size={22} />,
    title: "500+ Events",
    desc: "Trusted by hundreds of families across Sri Lanka for their most important celebrations.",
  },
  {
    icon: <Calendar size={22} />,
    title: "Custom Packages",
    desc: "Every event is unique — we tailor packages to fit your date, venue, and budget perfectly.",
  },
];

/* ─── Main Component ─────────────────────────────────────────────── */
const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="hm-root">
        {/* ════════════ HERO ════════════ */}
        <section className="hm-hero">
          <div className="hm-orb hm-orb1" />
          <div className="hm-orb hm-orb2" />

          <div className="hm-hero-inner">
            <div className="hm-hero-badge">
              Traditional Sri Lankan Performances
            </div>
            <h1 className="hm-hero-title">
              W E L C O M E <br />
              <h3 className="hm-hero-subtitle">to </h3>
              <em className="shop-name">Rajawarama</em>
            </h1>
            <p className="hm-hero-sub">
              Authentic Kandyan Attire, Attractive Dance Troupes, and Ceremonial
              Expertise. Everything You Need To Make Your Wedding Day
              Unforgettable.
            </p>

            <h3 className="hm-hero-service-location-title">
              Services Available In{" "}
            </h3>

            <div className="div-service-loc">
              <p className="hm-hero-service-location">
                Uva Province | Central Province | Sabaragamuwa Province
              </p>
            </div>
          </div>

          <div className="hm-hero-wave">
            <svg
              viewBox="0 0 1440 90"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "90px" }}
            >
              <path
                d="M0,45 C360,90 1080,0 1440,45 L1440,90 L0,90 Z"
                fill="#FAF7F4"
              />
            </svg>
          </div>
        </section>

        {/* ════════════ STATS ════════════ */}
        <div className="hm-stats">
          <div className="hm-stats-inner">
            {[
              { num: "25+", label: "Years of Excellence" },
              { num: "500+", label: "Events Celebrated" },
              { num: "50+", label: "Performers on Team" },
              { num: "100%", label: "Client Satisfaction" },
            ].map(({ num, label }) => (
              <div key={label} className="hm-stat">
                <div className="hm-stat-num">{num}</div>
                <div className="hm-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════ SERVICES ════════════ */}
        <section className="hm-section">
          <div className="hm-section-inner">
            <div className="hm-section-header">
              <div className="hm-section-eyebrow">Our Services</div>
              <h2 className="hm-section-title">
                Everything For Your <em>Perfect Day</em>
              </h2>
              <p className="hm-section-sub">
                From authentic costumes to vibrant dance troupes, we offer
                everything needed to honour Sri Lanka's rich cultural wedding
                traditions.
              </p>
            </div>

            <div className="hm-services-grid">
              {SERVICES.map((svc) => (
                <Link key={svc.to} to={svc.to} className="hm-svc-card">
                  <div className="hm-svc-icon">{svc.icon}</div>
                  <div className="hm-svc-name">{svc.name}</div>
                  <p className="hm-svc-desc">{svc.desc}</p>
                  <div className="hm-svc-link">
                    Explore <ArrowRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ WHY US ════════════ */}
        <section className="hm-section">
          <div className="hm-section-inner">
            <div className="hm-section-header">
              <div className="hm-section-eyebrow">Why Rajawarama</div>
              <h2 className="hm-section-title">
                Trusted By <em>Hundreds</em> of Families
              </h2>
              <p className="hm-section-sub">
                We bring more than performances — we bring the soul of Sri
                Lankan tradition to your most cherished moments.
              </p>
            </div>
            <div className="hm-why-grid">
              {WHY.map((w) => (
                <div key={w.title} className="hm-why-card">
                  <div className="hm-why-icon">{w.icon}</div>
                  <div className="hm-why-title">{w.title}</div>
                  <p className="hm-why-desc">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
