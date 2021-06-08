import { REDUX } from "../enums";
export function activeSideNav(state = "", action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.SET_USERSIDENAV:
            return payload;
        default:
            return state;
    }
}
