import { toast } from "react-toastify";
import get from "lodash/get";
import { NO_RATING } from "./enums";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function print(e) {
    console.log(e);
}

export function toastError(e) {
    console.log(e);
    toast.error(get(e, "response.data.err"));
}

export function toastSuccess(str) {
    toast(str, {
        className: "toast-success-custom",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        progressStyle: {
            background: "white",
            borderColor: "black",
            border: 20,
        },
        style: { background: "#03a9f4", color: "white" },
    });
}

export function isNonEmptyArray(arr) {
    return Boolean(arr && Array.isArray(arr) && arr.length);
}

export const getBase64Promise = (file) =>
    new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            return resolve(reader.result);
        };
        reader.onerror = function (error) {
            console.log("Error: ", error);
            return reject();
        };
    });

export const getRatingAverage = (product) => {
    if (product && isNonEmptyArray(product.ratings)) {
        let average = 0;
        let num_raters = product.ratings.length;
        for (let rating of product.ratings) {
            average = average + rating.star;
        }
        average = average / num_raters;
        return { average, num_raters };
    }
    return NO_RATING;
};

export const handleProductFilters = (
    query,
    price,
    categories,
    rating,
    subs,
    brands,
    colors,
    shipping
) => {
    const limit = 12;
    let where = {};
    let andConditions = [];

    if (isNonEmptyArray(price) && price.length === 2) {
        andConditions.push({ price: { $gte: price[0] } });
        andConditions.push({ price: { $lte: price[1] } });
    }

    if (query) andConditions.push({ $text: { $search: query } });

    if (isNonEmptyArray(categories))
        andConditions.push({ category_str: { $in: categories } });

    if (typeof rating === "number") andConditions.push({ rating_ave: rating });

    if (isNonEmptyArray(subs)) andConditions.push({ subs_str: { $in: subs } });

    if (isNonEmptyArray(brands))
        andConditions.push({ brand_str: { $in: brands } });

    if (isNonEmptyArray(colors))
        andConditions.push({ color_str: { $in: colors } });

    if (isNonEmptyArray(shipping))
        andConditions.push({ shipping: { $in: shipping } });

    if (!andConditions.length) andConditions.push({});

    Object.assign(where, { $and: andConditions });

    return {
        limit,
        where,
    };
};

export const addToCart = (product) => {
    let cart = [];
    try {
        if (typeof window === "undefined") return;
        cart = JSON.parse(localStorage.getItem("cart"));
        if (!Array.isArray(cart)) cart = [];
        const index = cart.findIndex((c) => c._id === product._id);
        if (index >= 0) cart.splice(index, 1);
        cart.push({ ...product, count: 1 });
        const unique = uniqWith(cart, isEqual);
        localStorage.setItem("cart", JSON.stringify(unique));
        cart = unique;
    } catch (e) {
        console.log(e);
    }
    return cart;
};

export const isEmptyHTML = htmlString => {
    const parser = new DOMParser();

    const { textContent } = parser.parseFromString(htmlString, "text/html").documentElement;

    return !textContent.trim();
}