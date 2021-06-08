import { REDUX } from "../enums";
export function searchText(state = { text: "" }, action) {
    const { type, payload } = action;
    switch (type) {
        case REDUX.SEARCH_QUERY:
            return { ...state, ...payload };
        default:
            return state;
    }
}
