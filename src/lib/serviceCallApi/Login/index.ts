import axiosClient from "@/lib/configs/axios";

export interface LoginPayload {
    username: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
    try {
        const response = await axiosClient.post("/login", data);
        return response.data;
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        throw error.response?.data || "Login failed!";
    }
};
