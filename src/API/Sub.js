import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createSub = async (sub, parent_name, authtoken) => {
    return await axios.post(
        `${API_URL}/sub`,
        { name: sub, parent: parent_name },
        { headers: { authtoken } }
    );
};

export const getSubs = async (filters, fields) => {
    filters = filters || {};
    fields = fields || {};
    return await axios.get(
        `${API_URL}/sub?filter=${JSON.stringify(
            filters
        )}&fields=${JSON.stringify(fields)}`
    );
};

export const getSub = async (slug) => {
    return await axios.get(`${API_URL}/sub/${slug}`);
};

export const updateSub = async (slug, sub, parent, authtoken) => {
    return await axios.put(
        `${API_URL}/sub/${slug}`,
        { name: sub, parent },
        { headers: { authtoken } }
    );
};

export const deleteSub = async (slug, authtoken) => {
    return await axios.delete(`${API_URL}/sub/${slug}`, {
        headers: { authtoken },
    });
};

export const listSubs = async (filters, withCount) => {
    filters = filters || {};
    const count_str = withCount ? "&count=true" : "";
    return await axios.get(
        `${API_URL}/sub/list?filter=${JSON.stringify(filters)}${count_str}`
    );
};
