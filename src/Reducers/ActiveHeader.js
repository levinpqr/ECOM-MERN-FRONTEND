import { REDUX } from "../enums";
export function activeHeader(state = "", action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.SET_HEADER:
            return payload;
        default:
            return state;
    }
}
