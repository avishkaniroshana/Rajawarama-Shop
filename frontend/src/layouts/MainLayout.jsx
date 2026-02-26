import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/common/Header/Header.jsx";
import Footer from "../components/common/Footer/Footer.jsx";
import AdminSidebar from "../components/admin/AdminSidebar";

function MainLayout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
<Header />
      <div className="flex">
        {/* Admin Sidebar (only for admin pages) */}
        {isAdminRoute && (
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        )}

        {/* Main Content */}
        <main
          className={`min-h-screen transition-all duration-300 w-full
          ${isAdminRoute ? (collapsed ? "ml-[90px]" : "ml-[260px]") : ""}`}
        >
          {children}
        </main>
      </div>

<Footer/>    
</>
  );
}

export default MainLayout;

// import React from "react";
// import Header from "../components/common/Header/Header.jsx";
// import Footer from "../components/common/Footer/Footer.jsx";

// function MainLayout  ({ children }) {
//   return (
//     <>
//       <Header />
//       <main className="min-h-screen">{children}</main>
//       <Footer />
//     </>
//   );
// };

// export default MainLayout;
