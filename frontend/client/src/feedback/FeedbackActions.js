import * as types from "./FeedbackActionTypes";
import { buildPostRequest } from "../app/api";

const sendFeedbackSuccess = feedback => ({ type: types.FEEDBACK_SEND_SUCCESS, body: feedback });
const sendFeedbackRequest = () => ({ type: types.FEEDBACK_SEND_REQUEST });
const sendFeedbackFailure = err => ({ type: types.FEEDBACK_SEND_FAILURE, body: err });

const updateFeedbackSuccess = feedback => ({ type: types.FEEDBACK_UPDATE_SUCCESS, body: feedback });
const updateFeedbackRequest = () => ({ type: types.FEEDBACK_UPDATE_REQUEST });

const collapseType = collapsed => ({ type: types.FEEDBACK_COLLAPSE, body: collapsed });

export const submit = (rating, message) => {
    return (dispatch, getState) => {
        dispatch(sendFeedbackRequest());

        const obj = {
            rating,
            data: {
                language: navigator.language,
            },
        };
        if (message) {
            obj.message = message;
        }

        let request = buildPostRequest("feedback");

        if (getState().auth.isAuthenticated) {
            request = request.auth(getState().auth.token);
        }

        return request
            .send(obj)
            .then(feedback => dispatch(sendFeedbackSuccess(feedback)))
            .catch(err => sendFeedbackFailure(err));
    };
};

export const update = feedback => {
    return dispatch => {
        dispatch(updateFeedbackRequest());

        return buildPostRequest("feedback/update")
            .send(feedback)
            .then(feedback => dispatch(updateFeedbackSuccess(feedback)))
            .catch(err => sendFeedbackFailure(err));
    };
};

export function toggle(collapsed) {
    return dispatch => {
        dispatch(collapseType(collapsed));
    };
}

export function collapse() {
    return dispatch => {
        dispatch(collapseType(true));
    };
}
