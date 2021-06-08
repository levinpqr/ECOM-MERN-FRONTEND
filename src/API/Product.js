import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createProduct = async (payload, authtoken) => {
    return await axios.post(`${API_URL}/product`, payload, {
        headers: { authtoken },
    });
};

export const updateProduct = async (payload, slug, authtoken) => {
    return await axios.put(`${API_URL}/product/${slug}`, payload, {
        headers: { authtoken },
    });
};

export const getAllProductColors = async (filters) => {
    filters = filters || {};
    return await axios.get(
        `${API_URL}/product/colors?filter=${JSON.stringify(filters)}`
    );
};

export const getAllProductBrands = async (filters) => {
    filters = filters || {};
    return await axios.get(
        `${API_URL}/product/brands?filter=${JSON.stringify(filters)}`
    );
};

export const getAllProducts = async (filters, withCount) => {
    filters = filters || {};
    const count_str = withCount ? "&count=true" : "";
    return await axios.get(
        `${API_URL}/product?filter=${JSON.stringify(filters)}${count_str}`
    );
};

export const deleteProduct = async (slug, authtoken) => {
    return await axios.delete(`${API_URL}/product/${slug}`, {
        headers: { authtoken },
    });
};

export const rateAProduct = async (star, id, authtoken) => {
    return await axios.put(
        `${API_URL}/product/rate/${id}`,
        { star },
        {
            headers: { authtoken },
        }
    );
};
