import { REDUX } from "../enums";

export function cart(state = [], action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.ADD_TO_CART:
            return payload;
        case REDUX.EMPTY_CART:
            return [];
        default:
            return state;
    }
}
