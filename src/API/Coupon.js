import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createCoupon = async (body, authtoken) => {
    return await axios.post(`${API_URL}/coupon`, body, {
        headers: { authtoken },
    });
};

export const listCoupons = async (filters) => {
    filters = filters || {};
    return await axios.get(
        `${API_URL}/coupon?filter=${JSON.stringify(filters)}`
    );
};

export const deleteCoupon = async (id, authtoken) => {
    return await axios.delete(`${API_URL}/coupon/${id}`, {
        headers: { authtoken },
    });
};
