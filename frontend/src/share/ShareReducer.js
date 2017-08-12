import * as types from "./ShareActionTypes";
import { Record, Map } from "immutable";

var InitialState = new Record({
    coins: Map({
        isLoading: true,
        items: new Map([])
    }),
    notFound: false
});

let initialState = new InitialState();

const ShareReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHARE_PORTFOLIO_LOAD_SUCCESS:
            return state.setIn([ "coins", "items" ], new Map(action.body)).setIn([ "coins", "isLoading" ], false);
        case types.SHARE_PORTFOLIO_LOAD_FAILURE:
            return state.set("notFound", true);
        default:
            return state;
    }
};

export default ShareReducer;
