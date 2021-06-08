import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const loginAPI = async (authtoken, payload) => {
    payload = payload || {};
    return await axios.post(`${API_URL}/auth/login-or-register`, payload, {
        headers: { authtoken },
    });
};

export const getUserByToken = async (authtoken) => {
    return await axios.get(`${API_URL}/auth/user-by-token`, {
        headers: { authtoken },
    });
};

export const getAdminByToken = async (authtoken) => {
    return await axios.get(`${API_URL}/auth/admin-by-token`, {
        headers: { authtoken },
    });
};
