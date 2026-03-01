import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// Attach access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);


// Auto-refresh on 401 (except login)

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;

        // Skip refresh for login/refresh endpoints themselves
        if (
            originalRequest.url.includes("/api/auth/login") ||
            originalRequest.url.includes("/api/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        // Trigger refresh on 401 OR 403 (expired token often causes 403 in role-checked endpoints)
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                console.log("Refreshing token...");

                const res = await axios.post("http://localhost:8080/api/auth/refresh", {
                    refreshToken,
                });

                const newAccessToken = res.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh failed:", refreshError);
                localStorage.clear();
                window.location.href = "/signin";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;