export const URLS = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    REGISTER_COMPLETE: "/register/complete",
    FORGOT_PASSWORD: "/forgot/password",
    USER_HISTORY: "/user/history",
    USER_PASSWORD: "/user/password",
    USER_WISHLIST: "/user/wishlist",
    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_PRODUCT: "/admin/product",
    PRODUCT_VIEW: "/product/:slug",
    ADMIN_PRODUCTS: "/admin/products",
    ADMIN_PRODUCT_UPDATE: "/admin/product/:slug",
    ADMIN_CATEGORIES: "/admin/categories",
    ADMIN_CATEGORY: "/admin/category/:slug",
    ADMIN_SUBCATEGORIES: "/admin/sub",
    ADMIN_SUBCATEGORY: "/admin/sub/:slug",
    ADMIN_COUPONS: "/admin/coupon",
    SUBCATEGORY: "/sub/:slug",
    CATEGORY: "/category/:slug",
    SHOP: "/shop",
    CART: "/cart",
    CHECKOUT: "/checkout",
    PAYMENT: "/payment",
};

export const REDUX = {
    LOGGED_IN: "LOGGED_IN",
    LOG_OUT: "LOG_OUT",
    SET_LOADING: "SET_LOADING",
    SET_USERSIDENAV: "SET_USERSIDENAV",
    SET_ADMINSIDENAV: "SET_ADMINSIDENAV",
    SET_HEADER: "SET_HEADER",
    SEARCH_QUERY: "SEARCH_QUERY",
    ADD_TO_CART: "ADD_TO_CART",
    EMPTY_CART: "EMPTY_CART",
    SET_DRAWER: "SET_DRAWER",
    COUPON_APPLIED: "COUPON_APPLIED",
};

export const NO_RATING = { average: 0, num_raters: 0 };

export const MAX_RATE = 5;

export const MAX_PRICE = 1000000;

export const PRICE_RANGE_DEFAULT = [0, MAX_PRICE];

export const FILTER_DELAY_MS = 2000;

export const SHIPPING_CHOICES = ["Yes", "No"];

export const CART_QUANTITY_PROPS = {
    MIN: 1,
    MAX: 50,
};
