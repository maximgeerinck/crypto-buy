import * as types from './AuthenticationActionTypes';
import api from '../app/api';
import { browserHistory } from 'react-router';
import { AUTH_TOKEN } from './AuthenticationConstants';
import * as ErrorHelper from '../helpers/ErrorHelper';

const authenticationSucceeded = user => ({ type: types.AUTHENTICATE_SUCCESS, body: user });
const authenticationRequest = () => ({ type: types.AUTHENTICATE_REQUEST });
const authenticationFailed = () => ({ type: types.AUTHENTICATE_FAILURE });

export const logout = () => ({ type: types.LOGOUT });

export const authenticate = (email, password) => {
  return dispatch => {
    dispatch(authenticationRequest());

    setTimeout(() => {
      return api
        .post('authenticate', { email: email, password: password })
        .then(user => {
          dispatch(authenticationSucceeded(user));
          localStorage.setItem(AUTH_TOKEN, user.token);
          browserHistory.push('/');
        })
        .catch((err, res) => {
          if (err && err.body && err.body.message === 'E_INVALID_CREDENTIALS') {
            dispatch(authenticationFailed());
          } else {
            dispatch(ErrorHelper.handle(err));
          }
        });
    }, 500);
  };
};