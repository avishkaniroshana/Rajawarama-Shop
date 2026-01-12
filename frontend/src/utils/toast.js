import toast from "react-hot-toast";

export const toastSuccess = (message) =>
    toast.success(message, {
        icon: "🟢",
    });

export const toastError = (message) =>
    toast.error(message, {
        icon: "🔴",
    });

export const toastInfo = (message) =>
    toast(message, {
        icon: "ℹ️",
    });