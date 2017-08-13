import * as types from "./ShareActionTypes";
import { Record, Map } from "immutable";

var InitialState = new Record({
    coins: Map({
        isLoading: true,
        items: new Map([])
    }),
    settings: new Map(),
    latestShare: {
        token: null
    },
    notFound: false
});

let initialState = new InitialState();

const ShareReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHARE_LOAD_SUCCESS:
            return state
                .setIn([ "coins", "items" ], new Map(action.body.portfolio))
                .set("settings", action.body.settings)
                .setIn([ "coins", "isLoading" ], false);
        case types.SHARE_LOAD_FAILURE:
            return state.set("notFound", true);
        case types.SHARE_SUCCESS:
            return state.set("latestShare", action.body);
        default:
            return state;
    }
};

export default ShareReducer;
