import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createCategory = async (category, authtoken) => {
    return await axios.post(
        `${API_URL}/category`,
        { name: category },
        { headers: { authtoken } }
    );
};

export const getCategories = async (filters, withCount) => {
    filters = filters || {};
    const count_str = withCount ? "&count=true" : "";
    return await axios.get(
        `${API_URL}/category?filter=${JSON.stringify(filters)}${count_str}`
    );
};

export const getCategory = async (slug) => {
    return await axios.get(`${API_URL}/category/${slug}`);
};

export const updateCategory = async (slug, category, authtoken) => {
    return await axios.put(
        `${API_URL}/category/${slug}`,
        { name: category },
        { headers: { authtoken } }
    );
};

export const deleteCategory = async (slug, authtoken) => {
    return await axios.delete(`${API_URL}/category/${slug}`, {
        headers: { authtoken },
    });
};
