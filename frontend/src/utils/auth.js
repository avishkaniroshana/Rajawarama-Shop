export const setAuth = (token, role, email, fullName) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("fullName", fullName);
};

export const clearAuth = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("fullName");
};

export const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
};

export const getUserRole = () => {
    return sessionStorage.getItem("role");
};

export const getUserFullName = () => {
    return sessionStorage.getItem("fullName");
};