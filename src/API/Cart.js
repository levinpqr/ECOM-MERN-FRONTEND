import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const pushToCart = async (cart, authtoken) => {
    return await axios.post(`${API_URL}/user/cart`, cart, {
        headers: { authtoken },
    });
};

export const getUserCart = async (authtoken) => {
    return await axios.get(`${API_URL}/user/cart`, { headers: { authtoken } });
};

export const emptyUserCart = async (authtoken) => {
    return await axios.put(`${API_URL}/user/cart`, undefined, {
        headers: { authtoken },
    });
};
