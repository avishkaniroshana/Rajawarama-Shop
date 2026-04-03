
import React, { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=DM+Sans:wght@400;500&display=swap');

  @keyframes toastSlideIn {
    0%  { opacity: 0; transform: translateX(28px) scale(0.96); }
    60% { transform: translateX(-4px) scale(1.01); }
    100%{ opacity: 1; transform: translateX(0)   scale(1); }
  }
  @keyframes toastSlideOut {
    0%  { opacity: 1; transform: translateX(0) scale(1); }
    100%{ opacity: 0; transform: translateX(28px) scale(0.95); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes iconPop {
    0%  { transform: scale(0.5) rotate(-15deg); opacity: 0; }
    70% { transform: scale(1.15) rotate(4deg); }
    100%{ transform: scale(1)   rotate(0deg);  opacity: 1; }
  }
  @keyframes barShrink {
    from { width: 100%; }
    to   { width: 0%; }
  }
`;

function injectKeyframes() {
  if (document.getElementById("luxury-toast-kf")) return;
  const s = document.createElement("style");
  s.id = "luxury-toast-kf";
  s.textContent = KEYFRAMES;
  document.head.appendChild(s);
}

const VARIANTS = {
  success: {
    accent:   "#16a34a",                              // rich green
    accentBg: "rgba(22,163,74,0.10)",
    barColor: "linear-gradient(90deg,#16a34a,#4ade80,#16a34a)",
    label:    "Success",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5.5 9.25L7.75 11.5L12.5 6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  error: {
    accent:   "#dc2626",                              // vivid red
    accentBg: "rgba(220,38,38,0.10)",
    barColor: "linear-gradient(90deg,#dc2626,#f87171,#dc2626)",
    label:    "Error",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 6L12 12M12 6L6 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    ),
  },
  blank: {
    accent:   "#7A6555",
    accentBg: "rgba(122,101,85,0.10)",
    barColor: "linear-gradient(90deg,#7A6555,#A08878,#7A6555)",
    label:    "Notice",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 5.5V9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <circle cx="9" cy="12.25" r="0.875" fill="currentColor"/>
      </svg>
    ),
  },
  loading: {
    accent:   "#C9A84C",
    accentBg: "rgba(201,168,76,0.08)",
    barColor: "linear-gradient(90deg,#C9A84C,#E2C56A,#C9A84C)",
    label:    "Loading",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation:"spin 1s linear infinite" }}>
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28 20" strokeLinecap="round"/>
      </svg>
    ),
  },
};

function LuxuryToast({ t: toastObj, duration = 3000 }) {
  const type   = toastObj.type || "blank";
  const v      = VARIANTS[type] || VARIANTS.blank;
  const msg    = toastObj.message;
  const visible = toastObj.visible;

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        width:         340,
        background:    "#FEFCF9",
        borderRadius:  14,
        border:        `1px solid ${v.accent}44`,
        boxShadow:     `0 0 0 1px ${v.accent}18, 0 8px 32px rgba(28,10,0,0.14), 0 2px 8px rgba(28,10,0,0.08)`,
        overflow:      "hidden",
        fontFamily:    "'DM Sans', sans-serif",
        animation:     visible
          ? "toastSlideIn 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards"
          : "toastSlideOut 0.28s ease-in forwards",
        position:      "relative",
      }}
    >
      <div style={{
        height:          2,
        backgroundImage: v.barColor,
        backgroundSize:  "200% auto",
        animation:       "shimmer 2.4s linear infinite",
      }} />

      <div style={{
        display:    "flex",
        alignItems: "flex-start",
        gap:        12,
        padding:    "13px 15px 11px",
      }}>
        {/* icon badge */}
        <div style={{
          color:          v.accent,
          background:     v.accentBg,
          border:         `1px solid ${v.accent}33`,
          borderRadius:   8,
          width:          36,
          height:         36,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          flexShrink:     0,
          animation:      "iconPop 0.38s cubic-bezier(0.34,1.56,0.64,1) both",
          animationDelay: "0.12s",
        }}>
          {v.icon}
        </div>

        {/* text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin:        0,
            fontFamily:    "'Cormorant Garamond', serif",
            fontSize:      "0.95rem",
            fontWeight:    600,
            color:         "#1C1008",
            letterSpacing: "0.01em",
            lineHeight:    1.2,
            marginBottom:  3,
          }}>
            {v.label}
          </p>
          <p style={{
            margin:     0,
            fontSize:   "0.78rem",
            color:      "#7A6555",
            lineHeight: 1.45,
            fontWeight: 400,
          }}>
            {typeof msg === "string" ? msg : ""}
          </p>
        </div>

        {/* dismiss button */}
        <button
          onClick={() => toast.dismiss(toastObj.id)}
          style={{
            background:   "none",
            border:       "none",
            cursor:       "pointer",
            color:        "#C4B5A8",
            padding:      "2px 2px",
            borderRadius: 4,
            display:      "flex",
            alignItems:   "center",
            flexShrink:   0,
            transition:   "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#7A6555")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#C4B5A8")}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {visible && (
        <div style={{
          height:       2.5,
          margin:       "0 14px 10px",
          borderRadius: 2,
          background:   `${v.accent}1a`,
          overflow:     "hidden",
        }}>
          <div style={{
            height:          "100%",
            borderRadius:    2,
            backgroundImage: v.barColor,
            backgroundSize:  "200% auto",
            animation:       `barShrink ${duration}ms linear forwards, shimmer 1.8s linear infinite`,
          }} />
        </div>
      )}
    </div>
  );
}

/*  Provider  */
const ToastProvider = () => {
  useEffect(() => {
    injectKeyframes();

    /* inject spin keyframe for loading icon */
    if (!document.getElementById("toast-spin-kf")) {
      const s = document.createElement("style");
      s.id = "toast-spin-kf";
      s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <Toaster
      position="top-right"
      gutter={10}
      containerStyle={{ top: 20, right: 20 }}
      toastOptions={{
        duration: 3000,
        style: { padding: 0, background: "transparent", boxShadow: "none" },
      }}
    >
      {(t) => (
        <LuxuryToast
          t={t}
          duration={t.duration ?? 3000}
        />
      )}
    </Toaster>
  );
};

export default ToastProvider;