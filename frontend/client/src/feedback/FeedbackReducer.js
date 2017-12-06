import * as types from "./FeedbackActionTypes";
import { Record, List } from "immutable";
import * as CacheHelper from "../helpers/CacheHelper";

export const KEY_COLLAPSED = "feedback/collapsed";

var InitialState = new Record({
    sent: false,
    collapsed: false,
    lastFeedback: undefined
});

let initialState = new InitialState();

if (CacheHelper.getCache(KEY_COLLAPSED)) {
    initialState = initialState.set("collapsed", CacheHelper.getCache(KEY_COLLAPSED));
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
            CacheHelper.cache(KEY_COLLAPSED, true);
            return state.set("collapsed", action.body);
        default:
            return state;
    }
};

export default FeedbackReducer;
