import axios from "axios";



function axiosConfig () {
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    if (!token) {
        console.warn("Token not found in localStorage, checking sessionStorage...");
    }

    if (!token) {
        console.error("Token does not exist or has not been saved!");
        throw new Error("Token does not exist or has not been saved!");
    } else {
        console.log("Fetching token:", token);
    }

    try {
        return axios.create({
            baseURL: "http://localhost:3000/api",
            headers: {
                token: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const axiosClient = axiosConfig();