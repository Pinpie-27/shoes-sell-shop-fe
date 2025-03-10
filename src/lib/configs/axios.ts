import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

const getAuthToken = () => localStorage.getItem("authToken") || "";

// Tạo axios instance
const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor: Add token vào headers
axiosClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            // eslint-disable-next-line no-param-reassign
            config.headers.token = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi 401
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized! Redirecting to login...");
            localStorage.removeItem("authToken");
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
