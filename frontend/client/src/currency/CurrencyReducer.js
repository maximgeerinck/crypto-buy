import * as types from "./CurrencyActionTypes";
import { Record } from "immutable";
import * as CacheHelper from "../helpers/CacheHelper";

const KEY_CURRENCY = "currency/index";

var InitialState = new Record({
    items: {},
    loaded: false
});

let initialState = new InitialState();

if (CacheHelper.getCache(KEY_CURRENCY)) {
    initialState.set("items", CacheHelper.getCache(KEY_CURRENCY)).set("loaded", true);
}

const CurrencyReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.CURRENCY_SUCCESS:
        CacheHelper.cache(KEY_CURRENCY, action.body.currencies, CacheHelper.SHORT);
        return state.set("items", action.body.currencies).set("loaded", true);
    default:
        return state;
    }
};

export default CurrencyReducer;