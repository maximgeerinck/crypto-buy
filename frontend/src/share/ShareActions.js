import * as types from "./ShareActionTypes";
import api from "../app/api";

const loadShareSuccess = (share) => ({ type: types.SHARE_LOAD_SUCCESS, body: share });
const loadShareRequest = () => ({ type: types.SHARE_LOAD_REQUEST });
const loadShareFailure = (errors) => ({ type: types.SHARE_LOAD_FAILURE, body: errors });

const deleteShareSuccess = (id) => ({ type: types.SHARE_DELETE_SUCCESS, body: id });

const shareLinkRequest = () => ({ type: types.SHARE_REQUEST });
const shareLinkSuccess = (share) => ({ type: types.SHARE_SUCCESS, body: share });

export const loadShare = (token) => {
    return (dispatch, getState) => {
        api
            .get(`share/${token}`)
            .then((share) => {
                dispatch(loadShareSuccess(share));
            })
            .catch((err) => {
                dispatch(loadShareFailure(err));
            });
    };
};

export const deleteShare = (id) => {
    return (dispatch, getState) => {
        api.delete(`share/${id}`, getState().auth.token).then((success) => {
            dispatch(deleteShareSuccess(id));
        });
    };
};

export const share = (settings) => {
    return (dispatch, getState) => {
        dispatch(shareLinkRequest());
        return api.post("share", { settings }, getState().auth.token).then((createdShare) => {
            dispatch(shareLinkSuccess(createdShare));
        });
    };
};
