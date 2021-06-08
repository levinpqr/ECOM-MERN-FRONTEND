import { combineReducers } from "redux";
import { userReducer as user } from "./User";
import { loadingReducer as loading } from "./Loading";
import { activeSideNav as active_side_nav } from "./ActiveSideNav";
import { searchText as search_text } from "./SearchText";
import { activeHeader as active_header } from "./ActiveHeader";
import { cart as cart_items } from "./Cart";
import { slideDrawer as slide_drawer } from "./SlideDrawer";
import { coupon } from "./Coupon";

export default combineReducers({
    user,
    loading,
    active_side_nav,
    search_text,
    active_header,
    cart_items,
    slide_drawer,
    coupon,
});
