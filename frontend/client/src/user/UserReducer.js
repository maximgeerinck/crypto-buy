import * as types from "./UserActionTypes";
import { LOGOUT } from "../authentication/AuthenticationActionTypes";
import * as shareTypes from "../share/ShareActionTypes";
import { Map, Record } from "immutable";
import * as errorTypes from "../error/ErrorActionTypes";
import { LOCATION_CHANGE } from "react-router-redux";
import * as CacheHelper from "../helpers/CacheHelper";

export const KEY_USER = "auth_user";
export const USER_CACHE = "auth_user_createdOn";

var InitialState = new Record({
    user: new Map({
        email: null,
    }),
    retrievedOn: null,
    loaded: false,
    form: Map({
        validationErrors: null,
        isSubmitting: false,
        succeeded: false,
        errors: {},
    }),
    preferences: Map({
        validationErrors: null,
    }),
});

let initialState = new InitialState();

// restore user
if (CacheHelper.getCache(KEY_USER)) {
    initialState = initialState
        .set("user", new Map(CacheHelper.getCache(KEY_USER)))
        .set("loaded", true);
}

const UserReducer = (state = initialState, action) => {
    state = state.setIn(["form", "isSubmitting"], false);

    switch (action.type) {
        case types.CREATION_REQUEST:
        case types.USER_CHANGE_PASSWORD_REQUEST:
            return state.setIn(["form", "isSubmitting"], true);

        case types.CREATION_SUCCESS:
        case types.USER_CHANGE_PASSWORD_SUCCESS:
            return state.setIn(["form", "isSubmitting"], false).setIn(["form", "succeeded"], true);

        case types.USER_SUCCESS:
            CacheHelper.cache(KEY_USER, action.body, CacheHelper.SHORT);
            return state
                .set("user", new Map(action.body))
                .set("loaded", true)
                .set("retrievedOn", Date.now());
        case types.CREATION_FAILED_VALIDATION:
            return state.setIn(["form", "validationErrors"], action.body);
        case types.UPDATE_SUCCESS:
            CacheHelper.cache(KEY_USER, action.body, CacheHelper.SHORT);
            return state
                .set("user", new Map(action.body))
                .setIn(["preferences", "validationErrors"], undefined);

        case types.UPDATE_FAILURE:
            return state.setIn(["preferences", "validationErrors"], action.body);

        case types.USER_CHANGE_PASSWORD_FAILURE:
            return state.setIn(["form", "validationErrors"], action.body);

        case errorTypes.ERROR_KNOWN:
            return state.setIn(["form", "errors"], action.body);
        case LOGOUT:
            localStorage.clear();
            return state.set("user", new Map(null)).set("loaded", false);

        case shareTypes.SHARE_SUCCESS:
            let shares = state.get("user").toObject().shares;
            return state.setIn(["user", "shares"], [action.body].concat(shares));

        case shareTypes.SHARE_DELETE_SUCCESS:
            shares = state.get("user").toObject().shares;
            shares = shares.filter(share => share.id !== action.body);
            return state.setIn(["user", "shares"], shares);

        case LOCATION_CHANGE:
            return state
                .setIn(["form", "errors"], {})
                .setIn(["form", "isSubmitting"], false)
                .setIn(["form", "validationErrors"], null)
                .setIn(["form", "succeeded"], false);

        default:
            return state;
    }
};

export default UserReducer;
