import * as types from "./AuthenticationActionTypes";
import { LOCATION_CHANGE } from "react-router-redux";
import Immutable from "immutable";
import { AUTH_TOKEN } from "./AuthenticationConstants";
import * as errorTypes from "../error/ErrorActionTypes";
import * as CacheHelper from "../helpers/CacheHelper";

var InitialState = new Immutable.Record({
    isAuthenticated: CacheHelper.getCache(AUTH_TOKEN) ? true : false,
    token: CacheHelper.getCache(AUTH_TOKEN) || null,
    form: Immutable.Map({
        isInvalid: false,
        isSubmitting: false,
        errors: {},
    }),
    error: undefined,
});

let initialState = new InitialState();

const AuthenticationReducer = (state = initialState, action) => {
    state = state.setIn(["form", "isSubmitting"], false).set("error", undefined);
    switch (action.type) {
        case types.AUTHENTICATE_SUCCESS:
            CacheHelper.cache(AUTH_TOKEN, action.body.token, CacheHelper.MONTH);
            return state.set("isAuthenticated", true).set("token", action.body.token);
        case types.AUTHENTICATE_FAILURE:
            return state.setIn(["form", "isInvalid"], true);
        case types.AUTHENTICATE_REQUEST:
            return state.setIn(["form", "isSubmitting"], true);
        case LOCATION_CHANGE:
            return state.setIn(["form", "isInvalid"], false);
        case types.LOGOUT:
            CacheHelper.remove(AUTH_TOKEN);
            return state.set("isAuthenticated", false);
        case errorTypes.ERROR_KNOWN:
            return state.setIn(["form", "errors"], action.body);
        default:
            return state;
    }
};

export default AuthenticationReducer;
