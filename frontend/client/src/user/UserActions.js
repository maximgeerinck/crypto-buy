import * as types from "./UserActionTypes";
import api, { buildPostRequest, buildGetRequest } from "../app/api";
import * as ErrorHelper from "../helpers/ErrorHelper";
import * as ErrorActions from "../error/ErrorActions";

const userSuccess = user => ({ type: types.USER_SUCCESS, body: user });
const userRequest = () => ({ type: types.USER_REQUEST });
const userFailed = () => ({ type: types.USER_FAILURE });

const creationSucceeded = user => ({ type: types.CREATION_SUCCESS, body: user });
const creationFailedValidation = errors => ({
    type: types.CREATION_FAILED_VALIDATION,
    body: errors,
});
// const creationFailed = errors => ({ type: types.CREATION_FAILURE, body: errors });
const creationRequest = () => ({ type: types.CREATION_REQUEST });

const updateSucceeded = user => ({ type: types.UPDATE_SUCCESS, body: user });
const updateFailed = err => ({ type: types.UPDATE_FAILURE, body: err });

const requestPasswordRequest = () => ({ type: types.REQUEST_PASSWORD_REQUEST });

const changePasswordSuccess = () => ({ type: types.USER_CHANGE_PASSWORD_SUCCESS });
const changePasswordFailure = err => ({ type: types.USER_CHANGE_PASSWORD_FAILURE, body: err });
const changePasswordRequest = () => ({ type: types.USER_CHANGE_PASSWORD_REQUEST });

export const changePassword = (currentPassword, newPassword) => {
    return (dispatch, getState) => {
        dispatch(changePasswordRequest());

        return buildPostRequest("user/password")
            .auth(getState().auth.token)
            .send({ currentPassword, newPassword })
            .then(response => {
                dispatch(changePasswordSuccess());
            })
            .catch(err => {
                dispatch(changePasswordFailure(err));
            });
    };
};

export const me = () => {
    return (dispatch, getState) => {
        dispatch(userRequest());

        return buildGetRequest("user/me")
            .auth(getState().auth.token)
            .onTimeout(() => {
                dispatch(ErrorActions.timeout("Could not load user"));
            }, 60 * 1000)
            .send()
            .then(user => {
                dispatch(userSuccess(user));
            })
            .catch(err => {
                dispatch(userFailed());
            });
    };
};

export const create = user => {
    return dispatch => {
        dispatch(creationRequest());

        setTimeout(() => {
            return api
                .post("user/create", user)
                .then(user => {
                    dispatch(creationSucceeded(user));
                })
                .catch(err => {
                    if ((err && err.error === "E_VALIDATION") || (err && err.validation)) {
                        dispatch(creationFailedValidation(err.validation));
                    } else {
                        dispatch(ErrorHelper.handle(err));
                    }
                });
        }, 500);
    };
};

export const updateUser = user => {
    return (dispatch, getState) => {
        return api
            .post("user/update", { user }, getState().auth.token)
            .then(user => {
                dispatch(updateSucceeded(user));
            })
            .catch((err, obj) => {
                dispatch(ErrorHelper.handle(err));
            });
    };
};

export const updatePreferences = preferences => {
    return (dispatch, getState) => {
        return api
            .post("user/preferences/update", preferences, getState().auth.token)
            .then(user => {
                dispatch(updateSucceeded(user));
            })
            .catch((err, obj) => {
                if ((err && err.error === "E_VALIDATION") || (err && err.validation)) {
                    dispatch(updateFailed(err.validation));
                } else {
                    dispatch(ErrorHelper.handle(err));
                }
            });
    };
};

export const requestPassword = email => {
    return dispatch => {
        dispatch(requestPasswordRequest());

        return api.post("forgot", { email });
    };
};

export const resetPassword = (token, email, password) => {
    return dispatch => {
        return api.post("reset", { email, token, password });
    };
};
