import * as types from "./FeedbackActionTypes";
import { Record, List } from "immutable";
import * as CacheHelper from "../helpers/CacheHelper";
import * as CookieHelper from "../helpers/CookieHelper";

export const KEY_COLLAPSED = "feedback/collapsed";

var InitialState = new Record({
    sent: false,
    collapsed: false,
    lastFeedback: undefined
});

let initialState = new InitialState();

if (CookieHelper.getCookie(KEY_COLLAPSED)) {
    initialState = initialState.set("collapsed", CookieHelper.getCookie(KEY_COLLAPSED));
}

const FeedbackReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FEEDBACK_SEND_SUCCESS:
            CacheHelper.cache(KEY_COLLAPSED, true, CacheHelper.WEEK);
            return state
                .set("sent", true)
                .set("collapsed", false)
                .set("lastFeedback", action.body);
        case types.FEEDBACK_COLLAPSE:
            CookieHelper.setCookie(KEY_COLLAPSED, CookieHelper.MONTH, true);
            return state.set("collapsed", action.body);
        default:
            return state;
    }
};

export default FeedbackReducer;
