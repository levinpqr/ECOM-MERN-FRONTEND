import { REDUX } from "../enums";

export function slideDrawer(state = false, action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.SET_DRAWER:
            return payload;
        default:
            return state;
    }
}
