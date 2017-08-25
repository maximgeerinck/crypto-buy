import * as types from "./CoinActionTypes";
import { Record, Map } from "immutable";

var InitialState = new Record({
    coins: new Map(),
    isLoading: true
});

let initialState = new InitialState();

const CoinReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.COINS_SUCCESS:
            return state.set("coins", new Map(action.body)).set("isLoading", false);
        default:
            return state;
    }
};

export default CoinReducer;
