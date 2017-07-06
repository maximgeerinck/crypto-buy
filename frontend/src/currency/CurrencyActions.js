import * as types from './CurrencyActionTypes';
import api from '../app/api';

const currencySuccess = currencies => ({ type: types.CURRENCY_SUCCESS, body: currencies });
const currencyRequest = () => ({ type: types.CURRENCY_REQUEST });
const currencyFailed = () => ({ type: types.CURRENCY_FAILURE });

export const index = currencies => {
  return dispatch => {
    dispatch(currencyRequest());

    return api
      .get('currencies/latest')
      .then(currencies => {
        dispatch(currencySuccess(currencies));
      })
      .catch((err, obj) => {
        currencyFailed();
      });
  };
};
