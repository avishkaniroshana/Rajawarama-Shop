import React from "react";
import MainLayout from "./layouts/MainLayout.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import ToastProvider from "./components/common/Toast/ToastProvider.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout>
          <AppRoutes />
          <ToastProvider />
        </MainLayout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
