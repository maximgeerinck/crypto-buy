import * as types from "./FeedbackActionTypes";
import { buildPostRequest } from "../app/api";

const sendFeedbackSuccess = feedback => ({ type: types.FEEDBACK_SEND_SUCCESS, body: feedback });
const sendFeedbackRequest = () => ({ type: types.FEEDBACK_SEND_REQUEST });
const sendFeedbackFailure = err => ({ type: types.FEEDBACK_SEND_FAILURE, body: err });

const updateFeedbackSuccess = feedback => ({ type: types.FEEDBACK_UPDATE_SUCCESS, body: feedback });
const updateFeedbackRequest = () => ({ type: types.FEEDBACK_UPDATE_REQUEST });
const updateFeedbackFailure = err => ({ type: types.FEEDBACK_UPDATE_FAILURE, body: err });

const collapseType = () => ({ type: types.FEEDBACK_COLLAPSE });

export const submit = (rating, message) => {
  return dispatch => {
    dispatch(sendFeedbackRequest());

    const obj = {
      rating
    };
    if (message) {
      obj.message = message;
    }

    return buildPostRequest("feedback")
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

export function collapse() {
  return dispatch => {
    dispatch(collapseType());
  };
}
