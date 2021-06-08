import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const uploadImage = async (base64, authtoken) => {
    return await axios.post(
        `${API_URL}/cloudinary/upload`,
        { image: base64 },
        { headers: { authtoken } }
    );
};

export const removeImage = async (public_id, authtoken) => {
    return await axios.delete(`${API_URL}/cloudinary/${public_id}`, {
        headers: { authtoken },
    });
};
