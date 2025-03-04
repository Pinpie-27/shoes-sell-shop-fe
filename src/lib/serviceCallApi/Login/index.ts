import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export interface LoginPayload {
    username: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/login`, data);
        return response.data;
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        throw error.response?.data || "Login failed!";
    }
};