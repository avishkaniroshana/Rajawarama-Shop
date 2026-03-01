//works well
export const setAuth = (accessToken, refreshToken, role, email, fullName) => {

    const validRoles = ["ADMIN", "CUSTOMER"];
    if (!validRoles.includes(role)) {
        console.error("Invalid role:", role);
        return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role); // "ADMIN" or "CUSTOMER"
    localStorage.setItem("email", email);
    localStorage.setItem("fullName", fullName);
};

// Clear auth on logout
export const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
};

// Check authentication
export const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
};

// Get role
export const getUserRole = () => {
    return localStorage.getItem("role");
};

// Get full name
export const getUserFullName = () => {
    return localStorage.getItem("fullName");
};

//1111111111111111111111111111111111111111111111111111111111111111111111

// export const setAuth = (token, role, email, fullName) => {
//     sessionStorage.setItem("token", token);
//     sessionStorage.setItem("role", role);
//     sessionStorage.setItem("email", email);
//     sessionStorage.setItem("fullName", fullName);
// };

// export const clearAuth = () => {
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("role");
//     sessionStorage.removeItem("email");
//     sessionStorage.removeItem("fullName");
// };

// export const isAuthenticated = () => {
//     return !!sessionStorage.getItem("token");
// };

// export const getUserRole = () => {
//     return sessionStorage.getItem("role");
// };

// export const getUserFullName = () => {
//     return sessionStorage.getItem("fullName");
// };