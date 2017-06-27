import * as types from './AuthenticationActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';
import Immutable from 'immutable';
import { AUTH_TOKEN } from './AuthenticationConstants';

var InitialState = new Immutable.Record({
  isAuthenticated: localStorage.getItem(AUTH_TOKEN) ? true : false,
  token: localStorage.getItem(AUTH_TOKEN) || null,
  form: Immutable.Map({
    isInvalid: false,
    isSubmitting: false
  })
});

const AuthenticationReducer = (state = new InitialState(), action) => {
  state = state.setIn(['form', 'isSubmitting'], false);
  switch (action.type) {
    case types.AUTHENTICATE_SUCCESS:
      return state.set('isAuthenticated', true).set('token', action.body.token);
    case types.AUTHENTICATE_FAILURE:
      return state.setIn(['form', 'isInvalid'], true);
    case types.AUTHENTICATE_REQUEST:
      return state.setIn(['form', 'isSubmitting'], true);
    case LOCATION_CHANGE:
      return state.setIn(['form', 'isInvalid'], false);
    case types.LOGOUT:
      localStorage.removeItem(AUTH_TOKEN);
      return state.set('isAuthenticated', false);
    default:
      return state;
  }
};

export default AuthenticationReducer;
