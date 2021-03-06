import * as types from "./NotificationActionTypes";
import { buildGetRequest } from "../app/api";

const loadNotificationsSuccess = notifications => ({
    type: types.NOTIFICATION_LOAD_SUCCESS,
    body: notifications,
});
const loadNotificationsRequest = () => ({ type: types.NOTIFICATION_LOAD_REQUEST });
const loadNotificationsFailure = err => ({ type: types.NOTIFICATION_LOAD_FAILURE, body: err });

export const loadNotifications = () => {
    return dispatch => {
        dispatch(loadNotificationsRequest());

        return buildGetRequest("notifications/active")
            .send()
            .then(notifications => dispatch(loadNotificationsSuccess(notifications)))
            .catch(err => loadNotificationsFailure(err));
    };
};
