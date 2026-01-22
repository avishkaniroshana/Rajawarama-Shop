import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          color: "#fff",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        },

        // SUCCESS
        success: {
          style: {
            background: "#16a34a", 
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#16a34a",
          },
        },

        // ERROR
        error: {
          style: {
            background: "#dc2626", 
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#dc2626",
          },
        },

        // INFO / DEFAULT
        blank: {
          style: {
            background: "#2563eb",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#2563eb",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
