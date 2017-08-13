import * as types from "./UserActionTypes";
import { LOGOUT } from "../authentication/AuthenticationActionTypes";
import * as shareTypes from "../share/ShareActionTypes";
import { Record, Map, List } from "immutable";
import * as errorTypes from "../helpers/ErrorHelper";

export const USER = "auth_user";

var InitialState = new Record({
    user: new Map({
        email: null
    }),
    isLoaded: false,
    form: Map({
        validationErrors: null,
        isSubmitting: false,
        succeeded: false,
        errors: {}
    })
});

let initialState = new InitialState();

// if (localStorage.getItem(USER))
//     initialState = initialState.set("user", new Map(JSON.parse(localStorage.getItem(USER)))).set("isLoaded", true);

const UserReducer = (state = initialState, action) => {
    state = state.setIn([ "form", "isSubmitting" ], false);

    switch (action.type) {
        case types.CREATION_REQUEST:
            return state.setIn([ "form", "isSubmitting" ], true);
        case types.CREATION_SUCCESS:
            return state.setIn([ "form", "isSubmitting" ], false).setIn([ "form", "succeeded" ], true);
        case types.USER_SUCCESS:
            localStorage.setItem(USER, JSON.stringify(action.body));
            return state.set("user", new Map(action.body)).set("isLoaded", true);
        case types.CREATION_FAILED_VALIDATION:
            return state.setIn([ "form", "validationErrors" ], action.body);
        case types.UPDATE_SUCCESS:
            localStorage.setItem(USER, JSON.stringify(action.body));
            return state.set("user", new Map(action.body));
        case errorTypes.ERROR_KNOWN:
            return state.setIn([ "form", "errors" ], action.body);
        case LOGOUT:
            localStorage.removeItem(USER);
            return state.set("user", new Map(null)).set("isLoaded", false);

        case shareTypes.SHARE_SUCCESS:
            let shares = state.get("user").toObject().shares;
            return state.setIn([ "user", "shares" ], [ action.body ].concat(shares));

        case shareTypes.SHARE_DELETE_SUCCESS:
            shares = state.get("user").toObject().shares;
            shares = shares.filter((share) => share.id !== action.body);
            return state.setIn([ "user", "shares" ], shares);

        default:
            return state;
    }
};

export default UserReducer;
