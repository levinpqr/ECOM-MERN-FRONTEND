import { REDUX } from "../enums";
export function loadingReducer(state = false, action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.SET_LOADING:
            return payload;
        default:
            return state;
    }
}
