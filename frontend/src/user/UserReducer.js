import * as types from "./UserActionTypes";
import { LOGOUT } from "../authentication/AuthenticationActionTypes";
import { Record, Map } from "immutable";
import * as errorTypes from "../helpers/ErrorHelper";

const USER = "auth_user";

var InitialState = new Record({
    user: {
        email: null
    },
    isLoaded: false,
    form: Map({
        validationErrors: null,
        isSubmitting: false,
        succeeded: false,
        errors: {}
    }),
    shareSettings: Map({
        token: undefined,
        price: false,
        source: false,
        boughtAt: false,
        amount: false
    })
});

let initialState = new InitialState();

if (localStorage.getItem(USER))
    initialState = initialState.set("user", JSON.parse(localStorage.getItem(USER))).set("isLoaded", true);

const UserReducer = (state = initialState, action) => {
    state = state.setIn([ "form", "isSubmitting" ], false);

    switch (action.type) {
        case types.CREATION_REQUEST:
            return state.setIn([ "form", "isSubmitting" ], true);
        case types.CREATION_SUCCESS:
            return state.setIn([ "form", "isSubmitting" ], false).setIn([ "form", "succeeded" ], true);
        case types.USER_SUCCESS:
            localStorage.setItem(USER, JSON.stringify(action.body));
            return state.set("user", action.body).set("isLoaded", true);
        case types.CREATION_FAILED_VALIDATION:
            return state.setIn([ "form", "validationErrors" ], action.body);
        case types.UPDATE_SUCCESS:
            localStorage.setItem(USER, JSON.stringify(action.body));
            return state.set("user", action.body);
        case errorTypes.ERROR_KNOWN:
            return state.setIn([ "form", "errors" ], action.body);
        case LOGOUT:
            localStorage.removeItem(USER);
            return state.set("user", null).set("isLoaded", false);
        case types.SHARE_SUCCESS:
            return state.set("shareSettings", Map(action.body));
        default:
            return state;
    }
};

export default UserReducer;
