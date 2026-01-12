import React from 'react'
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <>
    <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background:"#fff",
            color:"#333",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          },
        }}    
    />
    </>
  )
}
export default ToastProvider
