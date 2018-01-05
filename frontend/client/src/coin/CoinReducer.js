import * as types from "./CoinActionTypes";
import { Map, Record } from "immutable";
import * as CacheHelper from "../helpers/CacheHelper";

const KEY_COINS = "coins/index";

var InitialState = new Record({
    coins: new Map(),
    loaded: false,
});

let initialState = new InitialState();

if (CacheHelper.getCache(KEY_COINS)) {
    initialState.set("coins", new Map(CacheHelper.getCache(KEY_COINS))).set("loaded", true);
}

const CoinReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.COINS_SUCCESS:
        CacheHelper.cache(KEY_COINS, action.body, CacheHelper.SHORT);
        return state.set("coins", new Map(action.body)).set("loaded", true);
    default:
        return state;
    }
};

export default CoinReducer;
