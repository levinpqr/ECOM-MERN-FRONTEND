import { REDUX } from "../enums";
export function coupon(state = false, action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.COUPON_APPLIED:
            return payload;
        default:
            return state;
    }
}
