import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Tag,
  Shirt,
  Drum,
  Star,
  ClipboardList,
  Music,
  Package,
  Home,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  File,
  HatGlasses,
} from "lucide-react";
import { clearAuth } from "../utils/auth";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { to: "/", label: "Home", icon: Home, isExternal: true },
  { to: "/profile", label: "My Profile", icon: User, isExternal: false }, // ← Important: Not external

  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/dress-items", label: "Dress Items", icon: Shirt },
  {
    to: "/admin/dancing-performer-types",
    label: "Dancing Performers ",
    icon: Music,
  },
  { to: "/admin/special-item-types", label: "Special Package Items", icon: Star },
  { to: "/admin/dancing-packages", label: "Dancing Group Packages", icon: Drum },
  { to: "/admin/special-packages", label: "Special Packages", icon: Package },
  {
    to: "/admin/booking-requests",
    label: "Special Package Bookings",
    icon: ClipboardList,
  },
  {
    to: "/admin/dancing-booking-requests",
    label: "Dancing Group Bookings",
    icon: ClipboardList,
  },
  {
    to: "/admin/dress-only-bookings",
    label: "Dress-Only Bookings",
    icon: HatGlasses,
  },
  { to: "/admin/reports", label: "Reports ", icon: File },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate("/signin");
  };

  // Special handling for /profile when accessed by admin
  const isProfilePage = location.pathname === "/profile";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Sidebar - Always shown for admin routes including /profile */}
      <aside
        style={{
          width: collapsed ? 64 : 240,
          transition: "width 0.25s",
          background: "linear-gradient(180deg,#1C0A00 0%,#3B1A00 100%)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          boxShadow: "2px 0 16px rgba(0,0,0,0.18)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? "18px 0" : "22px 18px",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Home size={22} color="#C9A84C" strokeWidth={2.2} />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.28rem",
                  fontWeight: 700,
                  color: "#C9A84C",
                  letterSpacing: "0.04em",
                }}
              >
                Rajawarama
              </span>
            </div>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              background: "rgba(201,168,76,0.12)",
              border: "1px solid rgba(201,168,76,0.22)",
              borderRadius: 6,
              padding: "5px 7px",
              cursor: "pointer",
              color: "#C9A84C",
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, isExternal }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                textDecoration: "none",
                color: isActive ? "#C9A84C" : "rgba(255,255,255,0.75)",
                background: isActive ? "rgba(201,168,76,0.15)" : "transparent",
                borderLeft: isActive
                  ? "3px solid #C9A84C"
                  : "3px solid transparent",
                fontSize: "0.82rem",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.2s",
              })}
            >
              <Icon size={18} strokeWidth={1.9} />
              {!collapsed && (
                <span style={{ whiteSpace: "nowrap" }}>{label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Red Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            justifyContent: collapsed ? "center" : "flex-start",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#E11D48",
            fontSize: "0.83rem",
            fontWeight: 500,
            borderTop: "1px solid rgba(201,168,76,0.15)",
            width: "100%",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(225, 29, 72, 0.15)";
            e.currentTarget.style.color = "#F43F5E";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#E11D48";
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: collapsed ? 64 : 240,
          transition: "margin-left 0.25s",
          flex: 1,
          background: "#FAF7F4",
          minHeight: "100vh",
          padding: isProfilePage ? "0" : "0", 
        }}
      >
        {children}
      </main>
    </div>
  );
}
