import * as types from "./NotificationActionTypes";
import { List, Record } from "immutable";
import * as CacheHelper from "../helpers/CacheHelper";

const KEY_FLASH = "flashmessages/index";

var InitialState = new Record({
    flashMessages: List(),
    loaded: false
});

let initialState = new InitialState();

if (CacheHelper.getCache(KEY_FLASH)) {
    initialState = initialState.set("flashMessages", CacheHelper.getCache(KEY_FLASH)).set("loaded", true);
}

const NotificationReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.NOTIFICATION_LOAD_SUCCESS:
        CacheHelper.cache(KEY_FLASH, action.body, CacheHelper.SHORT);
        return state.set("flashMessages", action.body).set("loaded", true);
    default:
        return state;
    }
};

export default NotificationReducer;
