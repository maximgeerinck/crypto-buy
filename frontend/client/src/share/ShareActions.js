import * as types from "./ShareActionTypes";
import api, { buildGetRequest } from "../app/api";
import * as ErrorActions from "../error/ErrorActions";

const loadShareSuccess = share => ({ type: types.SHARE_LOAD_SUCCESS, body: share });
const loadShareRequest = () => ({ type: types.SHARE_LOAD_REQUEST });
const loadShareFailure = errors => ({ type: types.SHARE_LOAD_FAILURE, body: errors });

const deleteShareSuccess = id => ({ type: types.SHARE_DELETE_SUCCESS, body: id });

const shareLinkRequest = () => ({ type: types.SHARE_REQUEST });
const shareLinkSuccess = share => ({ type: types.SHARE_SUCCESS, body: share });

export const loadShare = token => {
    return (dispatch, getState) => {
        dispatch(loadShareRequest());

        return buildGetRequest(`share/${token}`)
            .auth(getState().auth.token)
            .onTimeout(() => {
                dispatch(ErrorActions.timeout("Could not fetch share"));
            }, 60 * 1000)
            .send()
            .then(share => {
                dispatch(loadShareSuccess(share));
            })
            .catch(err => {
                dispatch(loadShareFailure(err));
            });
    };
};

export const deleteShare = id => {
    return (dispatch, getState) => {
        api.delete(`share/${id}`, getState().auth.token).then(success => {
            dispatch(deleteShareSuccess(id));
        });
    };
};

export const share = (settings, currency) => {
    return (dispatch, getState) => {
        dispatch(shareLinkRequest());
        return api
            .post("share", { settings, currency }, getState().auth.token)
            .then(createdShare => {
                dispatch(shareLinkSuccess(createdShare));
            });
    };
};
