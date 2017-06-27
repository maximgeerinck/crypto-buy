import * as types from './PortfolioActionTypes';
import api from '../app/api';

const retrieveItemsSuccess = items => ({ type: types.RETRIEVE_ITEMS_SUCCESS, body: items });
const retrieveItemsRequest = () => ({ type: types.RETRIEVE_ITEMS_REQUEST });
const retrieveItemsFailure = () => ({ type: types.RETRIEVE_ITEMS_FAILURE });

const currencyDetailsSuccess = details => ({ type: types.CURRENCY_DETAILS_SUCCESS, body: details });
const currencyDetailsRequest = () => ({ type: types.CURRENCY_DETAILS_REQUEST });
const currencyDetailsFailure = () => ({ type: types.CURRENCY_DETAILS_FAILURE });

export const retrieve = () => {
  return dispatch => {
    dispatch(retrieveItemsRequest());

    return api
      .get('portfolio/load')
      .then(items => {
        dispatch(retrieveItemsSuccess(items));
      })
      .catch(err => {
        dispatch(retrieveItemsFailure(err.data));
      });
  };
};

export const details = () => {
  return (dispatch, getState) => {
    dispatch(currencyDetailsRequest());

    return api
      .post('currency/details', { coins: getState().portfolio.items.map(c => c.currency) })
      .then(currencies => {
        dispatch(currencyDetailsSuccess(currencies));
      })
      .catch(err => {
        dispatch(currencyDetailsFailure(err.data));
      });
  };
};
