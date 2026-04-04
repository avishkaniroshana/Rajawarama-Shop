import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Package, Users, Tags, Shirt,Drum, Music, File,
  ClipboardList, Crown, HatGlasses, Star,
} from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes shimmerGold {
    0%   { background-position:-300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes orbFloat {
    0%,100% { transform:translateY(0) scale(1); }
    50%      { transform:translateY(-18px) scale(1.04); }
  }
  @keyframes rotateSlow {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes cardReveal {
    from { opacity:0; transform:translateY(30px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)    scale(1); }
  }
  @keyframes lineExpand {
    from { width:0; }
    to   { width:100%; }
  }
  @keyframes lotusScale {
    from { transform:scale(0) rotate(-90deg); opacity:0; }
    to   { transform:scale(1) rotate(0deg);   opacity:1; }
  }

  .dash-card {
    opacity: 0;
    animation: cardReveal 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .dash-card:hover .card-arrow { transform: translateX(5px); }
  .dash-card:hover .card-icon-wrap { transform: scale(1.08) rotate(-4deg); }
  .dash-card:hover .card-overlay { opacity: 1; }
  .dash-card:hover .card-shine   { opacity: 1; }
  .dash-card:hover .card-title   { background-position: 0% center; }

  .card-icon-wrap  { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
  .card-arrow      { transition: transform 0.25s ease; display:inline-block; }
  .card-overlay    { transition: opacity 0.3s ease; opacity: 0; }
  .card-shine      { transition: opacity 0.4s ease; opacity: 0; }

  .card-title {
    background: linear-gradient(90deg, #1C1008 0%, #C9A84C 50%, #1C1008 100%);
    background-size: 200%;
    background-position: 100% center;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: background-position 0.5s ease;
  }

  .gold-shimmer-text {
    background: linear-gradient(90deg, #C9A84C 0%, #F5DFA0 30%, #E2C56A 50%, #F5DFA0 70%, #C9A84C 100%);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerGold 4s linear infinite;
  }
`;

function injectCSS() {
  if (document.getElementById("admin-dash-css")) return;
  const s = document.createElement("style");
  s.id = "admin-dash-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* --------------------------------- Dashboard items  */
const ITEMS = [
  { title:"User Management",         description:"Manage customer & administrator accounts, roles and access privileges",       path:"/admin/users",                    icon:<Users size={26}/>,        num:"01" },
  { title:"Category Management",     description:"Create and organize product and service categories efficiently",               path:"/admin/categories",               icon:<Tags size={26}/>,         num:"02" },
  { title:"Dress Items Management",  description:"Manage traditional costumes, inventory and availability",                     path:"/admin/dress-items",              icon:<Shirt size={26}/>,        num:"03" },
  { title:"Dancing Performers",      description:"Manage performers, their unit prices and availability windows",                path:"/admin/dancing-performer-types",  icon:<Music size={26}/>,   num:"04" },
  { title:"Special Package Items",   description:"Configure individual items included in premium special packages",             path:"/admin/special-item-types",       icon:<Star size={26}/>,         num:"05" },
  { title:"Special Packages",        description:"Build and manage premium wedding and ceremonial bundles",                     path:"/admin/special-packages",         icon:<Package size={26}/>,      num:"06" },
  { title:"Dancing Group Packages",  description:"Manage Kandyan and cultural dance group performance packages",                path:"/admin/dancing-packages",         icon:<Drum size={26}/>,         num:"07" },
  { title:"Special Package Bookings",    description:"View and process booking requests for all special packages",                  path:"/admin/booking-requests",         icon:<ClipboardList size={26}/>,num:"08" },
  { title:"Dancing Group Bookings",  description:"Manage bookings for dance performances and cultural groups",                  path:"/admin/dancing-booking-requests", icon:<ClipboardList size={26}/>,       num:"09" },
  { title:"Dress Bookings",          description:"Handle dress-only reservations, fittings and rental requests",                path:"/admin/dress-only-bookings",      icon:<HatGlasses size={26}/>,   num:"10" },
  { title:"Reports & Analytics",        description:"View sales reports, customer insights and performance metrics",             path:"/admin/reports",                  icon:<File size={26}/>,         num:"11" },
];

/* ----------------------------- Decorative SVG components  */
const LotusOrn = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ animation:"lotusScale 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.6s both" }}>
    <circle cx="24" cy="24" r="3" fill="#C9A84C"/>
    {[0,45,90,135,180,225,270,315].map((deg, i) => (
      <ellipse key={i} cx="24" cy="14" rx="2.5" ry="6" fill="#C9A84C" opacity="0.7"
        transform={`rotate(${deg} 24 24)`}/>
    ))}
    {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((deg, i) => (
      <ellipse key={i} cx="24" cy="10" rx="1.5" ry="4" fill="#E2C56A" opacity="0.45"
        transform={`rotate(${deg} 24 24)`}/>
    ))}
  </svg>
);

const MandalaBg = () => (
  <svg width="480" height="480" viewBox="0 0 480 480" fill="none" opacity="0.045"
    style={{ position:"absolute", animation:"rotateSlow 80s linear infinite", pointerEvents:"none" }}>
    {[20,40,60,80,100,120,140,160,180,200,220].map((r,i) => (
      <circle key={i} cx="240" cy="240" r={r} stroke="#C9A84C" strokeWidth="0.6"
        strokeDasharray={i%2===0 ? "4 8" : "1 6"}/>
    ))}
    {Array.from({length:24},(_,i)=>{
      const angle = (i/24)*Math.PI*2;
      const x1 = 240 + Math.cos(angle)*40, y1 = 240 + Math.sin(angle)*40;
      const x2 = 240 + Math.cos(angle)*220,y2 = 240 + Math.sin(angle)*220;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="0.4" opacity="0.6"/>;
    })}
    {[60,120,180].map((r,i)=>(
      Array.from({length:8},(_,j)=>{
        const angle=(j/8)*Math.PI*2;
        return <circle key={`${i}-${j}`} cx={240+Math.cos(angle)*r} cy={240+Math.sin(angle)*r} r="2.5" fill="#C9A84C" opacity="0.5"/>;
      })
    ))}
  </svg>
);

const CornerOrn = ({ flip }) => (
  <svg width="90" height="90" viewBox="0 0 90 90" fill="none" opacity="0.35"
    style={{ transform: flip ? "scaleX(-1)" : "none" }}>
    <path d="M5 85 Q5 5 85 5" stroke="#C9A84C" strokeWidth="1" fill="none"/>
    <path d="M15 85 Q15 15 85 15" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.5"/>
    <circle cx="5" cy="85" r="3" fill="#C9A84C"/>
    <circle cx="85" cy="5" r="3" fill="#C9A84C"/>
    <circle cx="28" cy="28" r="1.5" fill="#E2C56A" opacity="0.7"/>
  </svg>
);

/* --------------------------------- Main Component  */
const AdminDashboard = () => {
  useEffect(() => { injectCSS(); }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F4", fontFamily:"'DM Sans', sans-serif" }}>

      {/* ----------------------------------------
          HERO
      --------------------------------------------*/}
      <div style={{
        position:"relative",
        background:"linear-gradient(160deg, #100800 0%, #1C1008 40%, #241408 70%, #100800 100%)",
        padding:"36px 24px 52px",
        overflow:"hidden",
      }}>
        {/* Radial glow spots */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"-10%", left:"15%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)", animation:"orbFloat 7s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", bottom:"-20%", right:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", animation:"orbFloat 9s ease-in-out infinite 2s" }}/>
          <div style={{ position:"absolute", top:"30%", right:"30%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)" }}/>
        </div>

        {/* Mandala — centered behind text */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }}>
          <MandalaBg/>
        </div>

        {/* Corner ornaments */}
        <div style={{ position:"absolute", top:20, left:20 }}><CornerOrn/></div>
        <div style={{ position:"absolute", top:20, right:20 }}><CornerOrn flip/></div>

        {/* Content */}
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative", zIndex:2 }}>
          {/* Crown badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:14, animation:"fadeIn 0.6s ease both" }}>
            <div style={{ width:28, height:1, background:"linear-gradient(90deg,transparent,#C9A84C)" }}/>
            <Crown size={18} color="#C9A84C"/>
            <span style={{ fontSize:"0.65rem", letterSpacing:"0.32em", color:"#C9A84C", fontWeight:500, textTransform:"uppercase" }}>
              Rajawarama Admin Dashboard
            </span>
            <Crown size={18} color="#C9A84C"/>
            <div style={{ width:28, height:1, background:"linear-gradient(90deg,#C9A84C,transparent)" }}/>
          </div>

          <h1 style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontSize:"clamp(1.9rem, 4.5vw, 3.2rem)",
            fontWeight:700,
            lineHeight:1.05,
            margin:"0 0 18px",
            animation:"fadeUp 0.7s ease 0.25s both",
          }}>
            <span className="gold-shimmer-text">Administrator</span>
          </h1>
        </div>
      </div>

      {/* ----------------------------------------------------------
          LOTUS DIVIDER
       -------------------------------------------------------------*/}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, margin:"-1px 0 0", background:"#FAF7F4", padding:"0 32px", position:"relative", zIndex:10 }}>
        {/* left line */}
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.4))", animation:"lineExpand 1s ease 0.7s both" }}/>
        {/* lotus */}
        <div style={{ padding:"0 18px", marginTop:"-24px" }}>
          <div style={{ width:48, height:48, background:"#FAF7F4", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(201,168,76,0.2)", boxShadow:"0 0 24px rgba(201,168,76,0.12)" }}>
            <LotusOrn/>
          </div>
        </div>
        {/* right line */}
        <div style={{ flex:1, height:1, background:"linear-gradient(90deg,rgba(201,168,76,0.4),transparent)", animation:"lineExpand 1s ease 0.7s both" }}/>
      </div>

      {/* -------------------------------------------------------
          SECTION LABEL
      ----------------------------------------------------------- */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 28px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, animation:"fadeIn 0.6s ease 0.8s both", opacity:0 }}>
          <span style={{ fontSize:"0.6rem", letterSpacing:"0.35em", color:"#C4B5A8", textTransform:"uppercase", fontWeight:500 }}>Management Modules</span>
          <div style={{ flex:1, height:"1px", background:"rgba(201,168,76,0.15)" }}/>
          <span style={{ fontSize:"0.6rem", letterSpacing:"0.2em", color:"rgba(196,181,168,0.5)", textTransform:"uppercase" }}>{ITEMS.length} sections</span>
        </div>
      </div>

      {/* ----------------------------------------------------
          CARD GRID
      -------------------------------------------------------- */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 28px 80px" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",
          gap:20,
        }}>
          {ITEMS.map((item, i) => (
            <Link
              key={item.title}
              to={item.path}
              className="dash-card"
              style={{
                textDecoration:"none",
                animationDelay:`${i * 65}ms`,
                display:"block",
              }}
            >
              <div style={{
                position:"relative",
                background:"#FFFFFF",
                borderRadius:16,
                border:"1px solid rgba(201,168,76,0.18)",
                overflow:"hidden",
                boxShadow:"0 2px 0 rgba(201,168,76,0.06), 0 6px 24px rgba(28,16,8,0.06)",
                height:"100%",
              }}>

                {/* Gold left accent bar */}
                <div style={{
                  position:"absolute", top:0, left:0, width:3, height:"100%",
                  background:"linear-gradient(180deg,#C9A84C,#E2C56A 50%,#C9A84C)",
                  opacity:0.6,
                }}/>

                {/* Shine overlay on hover */}
                <div className="card-shine" style={{
                  position:"absolute", inset:0, pointerEvents:"none",
                  background:"linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)",
                }}/>

                {/* Hover bottom gradient */}
                <div className="card-overlay" style={{
                  position:"absolute", bottom:0, left:0, right:0, height:80,
                  background:"linear-gradient(0deg, rgba(201,168,76,0.05), transparent)",
                  pointerEvents:"none",
                }}/>

                {/* Card body */}
                <div style={{ padding:"22px 22px 20px 26px" }}>
                  {/* Top row: number + icon */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                    {/* Number */}
                    <span style={{
                      fontFamily:"'Cormorant Garamond',serif",
                      fontSize:"0.75rem",
                      fontWeight:400,
                      color:"rgba(201,168,76,0.5)",
                      letterSpacing:"0.15em",
                    }}>
                      {item.num}
                    </span>

                    {/* Icon badge */}
                    <div className="card-icon-wrap" style={{
                      width:46, height:46,
                      borderRadius:12,
                      background:"linear-gradient(135deg, #1C1008, #2C1A10)",
                      border:"1px solid rgba(201,168,76,0.25)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"#C9A84C",
                      boxShadow:"0 4px 14px rgba(28,16,8,0.18), inset 0 1px 0 rgba(201,168,76,0.12)",
                    }}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="card-title" style={{
                    fontFamily:"'Cormorant Garamond',serif",
                    fontSize:"1.35rem",
                    fontWeight:600,
                    lineHeight:1.2,
                    margin:"0 0 8px",
                    letterSpacing:"0.01em",
                  }}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize:"0.78rem",
                    color:"#7A6555",
                    lineHeight:1.6,
                    margin:"0 0 18px",
                    fontWeight:300,
                    minHeight:38,
                  }}>
                    {item.description}
                  </p>

                  {/* Bottom row: CTA */}
                  <div style={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-between",
                    borderTop:"1px solid rgba(201,168,76,0.12)",
                    paddingTop:14,
                  }}>
                    <span style={{
                      fontSize:"0.7rem",
                      letterSpacing:"0.18em",
                      textTransform:"uppercase",
                      color:"#C9A84C",
                      fontWeight:500,
                    }}>
                      Manage
                    </span>
                    <div style={{
                      width:28, height:28,
                      borderRadius:8,
                      background:"rgba(201,168,76,0.08)",
                      border:"1px solid rgba(201,168,76,0.2)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <span className="card-arrow" style={{ color:"#C9A84C", fontSize:"0.9rem", lineHeight:1 }}>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ----------------------------- Footer  */}
        <div style={{ marginTop:60, textAlign:"center" }}>
          {/* ornamental line */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:60, height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.3))" }}/>
            <Crown size={12} color="rgba(201,168,76,0.4)"/>
            <div style={{ width:60, height:"1px", background:"linear-gradient(90deg,rgba(201,168,76,0.3),transparent)" }}/>
          </div>
          <p style={{
            fontSize:"0.58rem",
            letterSpacing:"0.35em",
            color:"#C4B5A8",
            textTransform:"uppercase",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            Rajawarama &nbsp;•&nbsp; Traditional Wedding Services &nbsp;•&nbsp; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
