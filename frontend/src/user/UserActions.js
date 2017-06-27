import * as types from './UserActionTypes';
import api from '../app/api';
import { browserHistory } from 'react-router';

const userSuccess = user => ({ type: types.USER_SUCCESS, body: user });
const userRequest = () => ({ type: types.USER_REQUEST });
const userFailed = () => ({ type: types.USER_FAILURE });

const creationSucceeded = user => ({ type: types.CREATION_SUCCESS, body: user });
const creationFailedValidation = errors => ({ type: types.CREATION_FAILED_VALIDATION, body: errors });
const creationFailed = errors => ({ type: types.CREATION_FAILURE, body: errors });
const creationRequest = () => ({ type: types.CREATION_REQUEST });

const updateSucceeded = user => ({ type: types.UPDATE_SUCCESS, body: user });
const updateFailed = err => ({ type: types.UPDATE_FAILURE, body: err });

const requestPasswordRequest = () => ({ type: types.REQUEST_PASSWORD_REQUEST });

export const logout = () => ({ type: types.LOGOUT });

export const me = () => {
  return (dispatch, getState) => {
    dispatch(userRequest());

    return api
      .get('user/me', getState().auth.token)
      .then(user => dispatch(userSuccess(user)))
      .catch(() => dispatch(userFailed()));
  };
};

export const create = user => {
  return dispatch => {
    dispatch(creationRequest());

    setTimeout(() => {
      return api
        .post('user/create', user)
        .then(user => {
          dispatch(creationSucceeded(user));
        })
        .catch(err => {
          if (err.error === 'E_VALIDATION') {
            dispatch(creationFailedValidation(err.validation));
          } else {
            dispatch(creationFailed(err.data));
          }
        });
    }, 500);
  };
};

export const updateUser = user => {
  return (dispatch, getState) => {
    return api
      .post('user/update', { user }, getState().auth.token)
      .then(user => {
        dispatch(updateSucceeded(user));
      })
      .catch(err => {
        dispatch(updateFailed());
      });
  };
};

export const requestPassword = email => {
  return dispatch => {
    dispatch(requestPasswordRequest());

    return api.post('forgot', { email });
  };
};

export const resetPassword = (token, email, password) => {
  return dispatch => {
    return api.post('reset', { email, token, password });
  };
};
