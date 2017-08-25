import * as types from './CurrencyActionTypes';
import { Record } from 'immutable';

var InitialState = new Record({
  rates: {},
  loading: true
});

let initialState = new InitialState();
const CurrencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CURRENCY_SUCCESS:
      return state.set('rates', action.body.rates).set('loading', false);
    default:
      return state;
  }
};

export default CurrencyReducer;
