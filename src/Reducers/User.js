import { REDUX } from "../enums";
export function userReducer(state = null, action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.LOGGED_IN:
            return payload;
        case REDUX.LOG_OUT:
            return null;
        default:
            return state;
    }
}
