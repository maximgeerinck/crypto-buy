import * as types from "./ShareActionTypes";
import { Record, Map } from "immutable";

var InitialState = new Record({
    coins: Map({
        loading: true,
        items: []
    })
});

let initialState = new InitialState();

const ShareReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHARE_PORTFOLIO_LOAD_SUCCESS:
            return state.setIn([ "coins", "items" ], action.body);

        default:
            return state;
    }
};

export default ShareReducer;
