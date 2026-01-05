import React from "react";
import Header from "../components/common/Header/Header.jsx";
import Footer from "../components/common/Footer/Footer.jsx";

function MainLayout  ({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
