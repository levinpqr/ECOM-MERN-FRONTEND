import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const saveUserAddress = async (address, authtoken) => {
    return await axios.put(
        `${API_URL}/user/address`,
        { address },
        {
            headers: { authtoken },
        }
    );
};

export const getUserAddress = async (authtoken) => {
    return await axios.get(`${API_URL}/user/address`, {
        headers: { authtoken },
    });
};

export const applyCouponToUserCart = async (body, authtoken) => {
    return await axios.put(`${API_URL}/user/coupon`, body, {
        headers: { authtoken },
    });
};
